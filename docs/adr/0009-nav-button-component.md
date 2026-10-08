# ADR-0009: Nav Button as an Attribute Component on Native Links and Buttons

- **Status**: Accepted
- **Date**: 2026-10-08
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

Nav Button is the first design-system component. It comes from the Figma **Button / Nav Button** page (component set `143:2869`) and has four states:

| State    | Background                             | Text                             |
| :------- | :------------------------------------- | :------------------------------- |
| Default  | none                                   | `Content/Content` (OFF White)    |
| Hover    | `Background/NavButton-BG-Hover` (10%)  | `Content/Content`                |
| Active   | `Background/NavButton-BG-Active` (20%) | `Content/Content`                |
| Disabled | none                                   | `Content/Content-Disabled` (40%) |

It is 40px tall, with 8px × 16px padding, a 24px radius, and Google Sans Regular 16px with a 1.5 line height.

A nav button is almost always a **link** to a page (Landing, Workshops, Team/Partners, FAQ, Contact). "Active" means "this is the current page". To be accessible and work with the Angular router, it should stay a real `<a>` element. It should support `routerLink`, open-in-new-tab, `aria-current`, and the browser's own keyboard and focus behavior.

Two questions need answers:

1. How is the component applied: an element wrapper, or an attribute on a native element?
2. Where do the two new colors live?

Building the first component also showed that the library's test and typecheck configs could not compile Angular components yet.

---

## Decision Drivers

- **Native semantics**: links stay links, and buttons stay buttons.
- **Router-friendly**: works with `routerLink`/`routerLinkActive` without wrapping or re-exposing their inputs.
- **Accessibility**: the current page is announced with `aria-current="page"`, disabled links are not focusable, and focus is visible.
- **Token fidelity**: colors come from the Figma variables through the token pipeline (ADR-0008).
- **A pattern that scales** to the Button component that comes next.

---

## Considered Options

1. **Attribute component** `a[gdg-nav-button], button[gdg-nav-button]` that styles the host element
2. **Element component** `<gdg-nav-button>` that renders an inner `<a>` and re-exposes `href`/`routerLink`
3. **CSS class only** (`.gdg-nav-button`), with no Angular component

---

## Decision Outcome

Chosen option: **Attribute component on native `<a>` and `<button>`** (the pattern Angular Material uses for `a[mat-button]`), because it keeps native semantics and router integration with no extra API.

- `NavButton` (`libs/shared/ui/src/lib/nav-button/`) is standalone and `OnPush`, and uses signal inputs:
  - `active` sets `aria-current="page"`.
  - `disabled`:
    - On a `<button>`, it sets the native `disabled` attribute.
    - On an `<a>`, it sets `aria-disabled="true"` and `tabindex="-1"`, and suppresses clicks.
- Styles target state **attributes**, not classes: `:hover`, `[aria-current]`, `[disabled]`/`[aria-disabled]`, and `:focus-visible`. Because of this, `routerLinkActive ariaCurrentWhenActive="page"` gives the Active style with no extra input.
- Focus ring: 2px `content-default` outline with a 2px offset. Figma has no focus state, so this ring was added for accessibility. Background transitions are turned off under `prefers-reduced-motion`.
- **New semantic tokens**, which follow the Figma variable names (ADR-0008):
  - `color.background.nav-button-hover` → `color.off-white-alpha-10`
  - `color.background.nav-button-active` → `color.off-white-alpha-20`
- The ESLint `component-selector` rule for `shared-ui` now allows `type: ['element', 'attribute']`.
- Storybook stories live at `Design System/Atoms/Nav Button`: Default, Active, Disabled, AsButton, States, and Navigation. Stories render on the dark `background-default` surface, and `play` functions assert the ARIA states.
- **Library tooling fixes**, needed by the first real component:
  - `tsconfig.json` adds the `dom` lib.
  - `tsconfig.spec.json` extends the library `tsconfig.json`, so it gets Angular compiler options and bundler resolution.
  - A new `tsconfig.vitest.json` feeds the Analog Vite plugin during unit tests. It is non-composite, for the same reason as `.storybook/tsconfig.json`: composite project references hide component sources from the Angular compiler.

### Positive Consequences

- Real links: middle-click, open-in-new-tab, crawlers, and screen readers all behave natively.
- No wrapper API to maintain for `href`, `routerLink`, `target`, `queryParams`, and so on.
- The same pattern will apply to the Button component (`button[gdg-button]`, `a[gdg-button]`).
- The library can now unit-test and typecheck Angular components.

### Negative Consequences / Trade-offs

- Consumers must remember to put the attribute on an `<a>` or a `<button>`. Any other element does not match the selector.
- Disabled links are emulated with ARIA, because `<a>` has no native `disabled`.
- Two component-specific semantic tokens (`nav-button-*`) mirror the Figma names. Generic interaction tokens (`hover`, `selected`) may replace them later.

## Pros and Cons of the Options

### Attribute component

- Good, because it keeps native semantics and router directives.
- Good, because it is a proven pattern (Angular Material, Angular CDK).
- Bad, because it needs an ESLint rule change, and the selector is less discoverable.

### Element component with an inner `<a>`

- Good, because it is the conventional `gdg-*` element selector.
- Bad, because it would have to re-expose `href`, `routerLink`, `target`, and the router inputs. It also adds an extra DOM node and makes `routerLinkActive` awkward.

### CSS class only

- Good, because it has no runtime cost.
- Bad, because it has no typed API and no ARIA handling for disabled links. It is also inconsistent with the components that will need behavior.

## Implementation Guidelines / Next Steps

- With the router, use `<a gdg-nav-button routerLink="/faq" routerLinkActive ariaCurrentWhenActive="page">FAQ</a>`.
- Use `<button gdg-nav-button>` only for in-page actions, such as opening a menu.
- Build the Button component (`142:2103`) with the same attribute-selector pattern.
