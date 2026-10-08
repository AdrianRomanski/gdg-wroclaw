# ADR-0011: Button Component and Phosphor Icons

- **Status**: Accepted (the Contrast section is superseded by [ADR-0012](0012-primary-button-text-color-for-wcag-aa.md))
- **Date**: 2026-10-08
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

The Figma **Button** component set (`143:2772`, on the **Button / Nav Button** page) has 144 variants:

- **Color:** Blue, Green, Yellow, Red
- **Variant:** Primary (filled), Secondary (outlined)
- **Size:** L (48px tall), M (40px tall)
- **State:** Default, Hover, Disabled
- **Property** (content): text only, text plus a trailing icon, icon only

| State    | Primary                                             | Secondary                                         |
| :------- | :-------------------------------------------------- | :------------------------------------------------ |
| Default  | fill `Brand-{c}-Primary`, text `Content`            | 2px border `Brand-{c}-Primary`, text `Content`    |
| Hover    | fill `Brand-{c}-Secondary` (halftone)               | border `Brand-{c}-Secondary`                      |
| Disabled | fill `Background-Disabled`, text `Content-Disabled` | border `Border-Disabled`, text `Content-Disabled` |

The label is Google Sans Medium 16px with a 1.5 line height. Padding (vertical / horizontal) depends on size and content:

| Content     | L                              | M                             |
| :---------- | :----------------------------- | :---------------------------- |
| Text only   | 12 / 24                        | 8 / 24                        |
| Text + icon | 12 / 20, 16 gap                | 8 / 16, 16 gap                |
| Icon only   | 12 on all sides (48×48 circle) | 8 on all sides (40×40 circle) |

The icon is Phosphor **CaretRight**: 24px, in the text color.

An older copy of the set (`142:1982`, on the Typography page, without the icon property) is out of date and is ignored.

Three questions need answers:

1. What API should the component have?
2. How do icons get into the codebase?
3. What do we do about contrast? The Primary text fails WCAG AA.

---

## Decision Drivers

- Match Figma exactly, while keeping native `<button>`/`<a>` semantics and accessibility.
- Use the same pattern as Nav Button (ADR-0009).
- Use Figma's icon family without a runtime dependency or extra bundler setup.
- Make the contrast problem visible and cheap to fix once the design changes.

---

## Considered Options

- **Selector:**
  - attribute component on `button`/`a`, as in ADR-0009 (chosen)
  - `<gdg-button>` element wrapper
- **Icons:**
  - generated registry from `@phosphor-icons/core` + `gdg-icon` (chosen)
  - importing `.svg` files
  - an Angular icon library
  - hand-inlined SVGs
- **Contrast:**
  - match Figma and route the text through a semantic token (chosen)
  - dark text on fills, which deviates from Figma
  - match Figma and disable the a11y rule

---

## Decision Outcome

### Button

- **Selector:** `button[gdg-button], a[gdg-button]`, standalone and `OnPush`.
- **Inputs** (signal inputs):
  - `color`: `'blue' | 'green' | 'yellow' | 'red'`, default `blue`
  - `variant`: `'primary' | 'secondary'`, default `primary`
  - `size`: `'l' | 'm'`, default `l` (the Figma names)
  - `iconOnly`: boolean
  - `disabled`: boolean
- **Host classes:** inputs become host classes (`gdg-button--{variant|color|size}`, `--with-icon`, `--icon-only`).
  - `--with-icon` comes from `contentChild(Icon)`. CSS can't detect the icon with `:has()`, because Angular's emulated encapsulation would scope that selector.
  - `iconOnly` has to be explicit, because CSS can't tell "only an icon" apart from "icon plus a text node". In dev mode, a `console.warn` fires if an icon-only button has no `aria-label` or `aria-labelledby`.
- **Content:** the label is projected content, and a projected `<gdg-icon>` always lands after the label, as in Figma.
- **Disabled behavior** moves into a shared host directive, `DisabledInteractive`, which `NavButton` now uses too:
  - On a `<button>`, it sets the native `disabled` attribute.
  - On an `<a>`, it sets `aria-disabled="true"` and `tabindex="-1"`, and swallows clicks.
- **The 2px border:** Figma draws it _inside_ the box. So every variant gets a 2px border (transparent on Primary) and 2px less padding, which keeps L at 48px and M at 40px in every variant.
- **Colors:** each color sets the private custom properties `--_fill` and `--_fill-hover` from `brand-*` tokens. The variants consume them: Primary as the background, Secondary as the border.
- **Spacing, radius and weight** use the ADR-0010 tokens.
- **Focus and motion:** a focus-visible ring and the reduced-motion rule, both as in Nav Button. Figma defines no focus or pressed state.
- **`type`** is left native; consumers set `type="button"` outside forms.

### Icons

- **Package:** `@phosphor-icons/core` (~2.1.1, MIT), as a dev dependency. Only its SVG files are read, at generation time.
- **Generator:**
  - `src/lib/icon/icons.json` is the allowlist; it starts with `["caret-right"]`.
  - `tools/build-icons.ts` writes `src/lib/icon/generated/icons.ts`, a typed map from name to inner SVG markup, plus `IconName`.
  - Run it with `npx nx run shared-ui:generate-icons`.
  - The generated file is committed, excluded from Prettier, and guarded by a drift test, the same approach as tokens in ADR-0008.
  - We generate instead of importing `.svg` files, because those imports would need loader configuration in every consumer (Vite and the Angular esbuild builder).
- **`gdg-icon` component:**
  - **Inputs:** `name: IconName`, `size` (px, default 24, emitted in rem) and `label`.
  - **Rendering:** it outputs an `<svg viewBox="0 0 256 256" fill="currentColor">`, so icons inherit the text color.
  - **Accessibility:** icons are `aria-hidden` unless a `label` is given; then the icon gets `role="img"` and that label.
  - **Sanitizer:** the markup goes through `bypassSecurityTrustHtml`. This is safe because the registry is generated at build time and is never user input.

### Contrast (issue #13)

> **Superseded by [ADR-0012](0012-primary-button-text-color-for-wcag-aa.md):** Primary text is now black (`#000000`) and meets WCAG AA. The section below records the original decision.

OFF White text on the brand fills is between 1.25:1 (halftone yellow, Hover) and 3.44:1 (red), below AA's 4.5:1. Black 02 text would pass on every fill except red-500 (4.25:1).

We match Figma for now, but the Primary text color goes through a new semantic token, `color.content.on-brand` (→ OFF White). Once the designers fix the colors, the code change is a single token value.

Storybook's a11y check reports violations without failing for stories that include Primary buttons (`a11y.test: 'todo'`). Secondary and Disabled stories stay at `'error'`.

### Positive Consequences

- The design is reproduced pixel-accurately. Static measurements match Figma, apart from text-width rounding of less than 1px.
- Links and buttons keep native semantics, and one directive handles disabled behavior for every interactive atom.
- New icons cost one line in `icons.json` plus a generate run, and only the icons listed there ship.
- The contrast debt is visible in the code, in Storybook and in issue #13.

### Negative Consequences / Trade-offs

- Until issue #13 is resolved, Primary buttons ship with insufficient text contrast.
- `iconOnly` is a manual flag, and forgetting `aria-label` only triggers a dev-mode warning.
- `gdg-icon` is the only supported icon slot: arbitrary SVGs are not projected as the trailing icon.
- Storybook's `AllVariants` story simulates Hover with an inline `--_fill` override, because a static matrix cannot trigger `:hover`.

## Implementation Guidelines / Next Steps

- Actions: `<button gdg-button type="button" color="green">Save</button>`
- Navigation: `<a gdg-button routerLink="/register">Register <gdg-icon name="caret-right" /></a>`
- Icon only: `<button gdg-button type="button" iconOnly aria-label="Next"><gdg-icon name="caret-right" /></button>`
- When issue #13 is resolved, update `color.content.on-brand` (and the fills, if they change), regenerate the tokens, and remove `a11y.test: 'todo'` from the Button stories.
