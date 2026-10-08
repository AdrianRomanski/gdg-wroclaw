# ADR-0013: Design System and UI Library Architecture

- **Status**: Accepted (amends [ADR-0002](0002-organize-workspace-into-apps-and-libs.md) and [ADR-0004](0004-storybook-for-design-system.md))
- **Date**: 2026-10-08
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

The design system grew inside `libs/shared/`:

- `shared-ui-tokens` (`@gdg-wroclaw/shared-ui-tokens`) holds the design tokens.
- `shared-ui` (`@gdg-wroclaw/shared-ui`) holds three things: the Figma primitives (Button, Nav Button, Icon), the Foundations docs pages, and the only Storybook.

Every project could depend on every other project (`depConstraints: * → *`).

The next step is GDG product UI: Navbar, Footer, event cards, FAQ, and the sections of the Landing, Workshop, Team and Contact pages. That UI is built _from_ the design system but is not part of it. Without explicit layers:

- product UI would leak into the design system, or
- the design system would start depending on product code.

We also need an obvious place for each kind of component, and a Storybook that is not owned by any one library.

---

## Decision Drivers

- **Explicit layers** with one-way dependencies, enforced by tooling rather than by convention.
- **A design system that stays generic**: only Figma primitives and tokens, with no GDG page knowledge.
- **Discoverability**: the path and package name tell you what a library is.
- **One Storybook** (ADR-0004) covering every UI layer, with stories next to their code.

---

## Considered Options

- **Layout**:
  - `libs/design-system/{tokens,components}` plus `libs/ui` (chosen)
  - a single `libs/design-system` with `src/components` and `src/tokens` directories
  - keep `libs/shared/*`
- **What goes in ui**:
  - composed GDG product UI, presentational only (chosen)
  - generic molecules and organisms only, with page sections in feature libraries
- **Storybook**:
  - its own project, `apps/storybook` (chosen)
  - hosted by the design-system components library, with globs reaching into `libs/ui`
  - one Storybook per library

---

## Decision Outcome

### Layout

```
apps/
  events/                    type:app
  storybook/                 type:storybook        (@gdg-wroclaw/storybook, private)
libs/
  design-system/
    tokens/                  @gdg-wroclaw/design-system-tokens      project design-system-tokens      scope:design-system, type:tokens
    components/              @gdg-wroclaw/design-system-components  project design-system-components  scope:design-system, type:components
  ui/                        @gdg-wroclaw/ui                        project ui                          scope:ui, type:ui
```

- **`design-system-tokens`** is the base layer and has no workspace dependencies.
  - Contents: the DTCG token sources, the Style Dictionary build and the generated CSS/TS (ADR-0008).
  - It now also holds the **Foundations** docs pages (`docs/*.mdx`), because they document tokens and import only this package.
- **`design-system-components`** holds the Figma primitives: Button, Nav Button, Icon and the `DisabledInteractive` host directive (ADR-0009, ADR-0011), plus the Phosphor icon registry generator.
- **`ui`** holds composed GDG product UI built from the two design-system libraries. Its rules:
  - Components are presentational: standalone, `OnPush`, signal inputs and outputs.
  - No data fetching, stores or router navigation. Data comes in through inputs, and user intent goes out through outputs. Data and routing belong to future `feature-*` and `data-access-*` libraries (ADR-0001, ADR-0002).
  - Styling uses design-system components and `--gdg-*` tokens only.
  - The library starts empty. Its first component, the Landing Page Navbar built from `NavButton`, is the next step.
- The libraries were moved with `nx g @nx/workspace:move`, so git history is preserved as renames. Nothing else in the workspace imported `@gdg-wroclaw/shared-ui`. The events app imports only the tokens CSS.
- The npm `workspaces` setting lists `apps/*`, `libs/*/*` and `libs/ui`. The `libs/*/*` pattern does not match the one-level `libs/ui` folder.

### Dependency rules

`@nx/enforce-module-boundaries`, root `eslint.config.mjs`:

| Source tag            | May depend on                               |
| :-------------------- | :------------------------------------------ |
| `type:tokens`         | `type:tokens`                               |
| `type:components`     | `type:tokens`                               |
| `type:ui`             | `type:components`, `type:tokens`            |
| `type:app`            | `type:ui`, `type:components`, `type:tokens` |
| `type:storybook`      | `type:ui`, `type:components`, `type:tokens` |
| `scope:design-system` | `scope:design-system`                       |

A design-system library importing `@gdg-wroclaw/ui` fails lint for two reasons: the tag rule, and the circular-dependency check (`ui` depends on the design system).

### Storybook (amends ADR-0004)

The single Storybook moves out of the component library into **`apps/storybook`**, a project with no source code of its own. It owns:

- **`.storybook/`**:
  - `main.ts` globs `libs/design-system/tokens/docs/**/*.mdx`, `libs/design-system/components/src/**/*.@(mdx|stories.ts)` and `libs/ui/src/**/*.@(mdx|stories.ts)`.
  - `preview.ts` imports `tokens.css` and keeps `a11y.test: 'error'`.
  - `tsconfig.json` is the non-composite config for the Analog plugin (ADR-0006), widened to all three source trees.
- **Targets**:
  - `storybook` (port 4400)
  - `build-storybook` (output `dist/storybook`)
  - `test-storybook`: Playwright smoke tests over every entry, against both the dev server and the static build (ADR-0006).
- **Dependencies**: its `package.json` depends on the three libraries. So Nx links it in the project graph, and `build-storybook`'s `^production` inputs cover every library it renders.

Stories stay next to their component and are type-checked by their own library's `tsconfig.storybook.json`. Each library's build excludes `*.stories.ts`. Story titles:

- `Design System/Foundations/*`
- `Design System/Atoms|Molecules|Organisms/*`
- `UI/*`
- later: `Features/<Domain>/*` and `Pages/*`

### Positive Consequences

- The intended dependency direction (`apps → ui → design-system components → tokens`) is enforced by lint.
- The design system stays generic and could be extracted or published on its own.
- No library's configuration reaches into another library. Storybook is the one place that composes them.
- Package names say what a library is (`design-system-components`, `design-system-tokens`, `ui`).

### Negative Consequences / Trade-offs

- **Renames.** Imports change from `@gdg-wroclaw/shared-ui*` to `@gdg-wroclaw/design-system-*`, and project names change too: `nx run design-system-tokens:generate-tokens`, `nx run design-system-components:generate-icons`, `nx storybook storybook`. Older ADRs keep the old names as history.
- **Path convention.** `libs/ui` and `libs/design-system/*` don't follow ADR-0002's `libs/<scope>/<type>-<name>` naming. ADR-0002's convention still applies to future domain libraries.
- **Generator follow-up.** The Angular library generator still needs manual alignment with the workspace TypeScript setup: `NX_IGNORE_UNSUPPORTED_TS_SETUP`, `package.json` instead of `paths`, the `dom` lib, the spec and vitest tsconfigs, and the attribute-selector lint rule. `libs/ui` is the reference setup.

## Implementation Guidelines / Next Steps

- New Figma primitive → `libs/design-system/components/src/lib/<name>/`, with a story titled `Design System/Atoms/<Name>`.
- New composed GDG piece → `libs/ui/src/lib/<name>/`, with a story titled `UI/<Name>`, built only from design-system parts.
- Data, routing or state → a `feature-*` or `data-access-*` library (ADR-0002) that uses `ui`. Add `type:feature` and `type:data-access` constraints when the first one is created.
- Next: the Landing Page Navbar in `ui`, using `NavButton`.
