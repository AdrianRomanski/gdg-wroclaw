# ADR-0004: Use a Single Vite-based Storybook for the Design System

- **Status**: Accepted
- **Date**: 2026-10-07
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

ADR-0001 requires UI components to have Storybook stories, and ADR-0003 introduced the first design-system foundation (color tokens) with documenting them in Storybook as a next step. Before building components (buttons, navigation, cards) from Figma, we need a place to develop, review and document them in isolation.

Constraints of this workspace:

- Angular 22 with **zoneless** change detection and the esbuild/Vite-based `@angular/build` builder (no `zone.js`, no webpack).
- Nx TypeScript **project references** setup with npm workspaces, which the `@nx/angular:library` generator does not officially support.
- Vitest as the unit-test runner.

We need to decide **where** Storybook lives and **which Storybook builder** to use.

---

## Decision Drivers

- **One catalogue for designers and developers**: the design system should be browsable in one place, not spread across several Storybooks.
- **Match the app's toolchain**: zoneless Angular, Vite/esbuild, Vitest; avoid introducing webpack as a real build path.
- **Low maintenance**: a setup that scales as the number of components grows.
- **Docs first**: foundations (colors, typography) must be documentable alongside components.

---

## Considered Options

### Where Storybook lives

1. **One design-system Storybook** hosted in a new Angular library `libs/shared/ui`
2. **Storybook per library** (Nx default), one per `ui-*` library
3. **Storybook on the tokens library** `libs/shared/ui-tokens`

### Builder

A. **`@analogjs/storybook-angular`** (Vite builder, Storybook 10)
B. **`@storybook/angular`** default webpack builder (Storybook 10)

---

## Decision Outcome

Chosen options: **One design-system Storybook in `libs/shared/ui`** with the **`@analogjs/storybook-angular` Vite builder**.

- `libs/shared/ui` (project `shared-ui`, import path `@org/shared-ui`, tags `scope:shared`, `type:ui`) is the Angular design-system component library and the Storybook host. Design-system components (Button, Nav Button, …) will live here as standalone, OnPush, signal-based components.
- `libs/shared/ui-tokens` stays framework-agnostic; `shared-ui` depends on it.
- Storybook 10 with addons `@storybook/addon-docs` and `@storybook/addon-a11y`. Stories are discovered from `libs/shared/ui/src/**/*.mdx` and `**/*.stories.ts`.
- `.storybook/preview.ts` imports `@org/shared-ui-tokens/tokens.css`, so every story renders with the real tokens. Accessibility violations are configured to fail (`a11y.test: 'error'`).
- Targets on `shared-ui`: `storybook` (dev server on port 4400) and `build-storybook` (output `dist/storybook/shared-ui`), using `@analogjs/storybook-angular` executors with `experimentalZoneless: true` and Compodoc disabled. CI runs `build-storybook`.
- The first docs page, **Design System/Foundations/Colors**, renders the palette from the `colors` map in `@org/shared-ui-tokens`, completing ADR-0003's Storybook next step.
- Story titles follow the hierarchy `Design System/Foundations|Atoms|Molecules|Organisms/*`, `Features/<Domain>/*`, `Pages/*`.

### Library setup notes

- `shared-ui` was generated with `NX_IGNORE_UNSUPPORTED_TS_SETUP=true npx nx g @nx/angular:library …` and then aligned with the workspace: a `package.json` (npm workspace package) instead of `paths` in `tsconfig.base.json`, a reference in the root `tsconfig.json`, and inferred `lint`. Unit tests use Vitest via `@analogjs/vitest-angular` (the `vitest-angular` runner requires buildable libraries). `nx.json` records `vitest-analog` as the default for future Angular libraries.
- `@storybook/angular` (a required peer of the Analog framework) declares peers on `@angular-devkit/build-angular`, `@angular/animations` and `@angular/platform-browser-dynamic`. They are installed as dev dependencies pinned to Angular 22 to satisfy npm; they are not used to build the app.

### Positive Consequences

- A single Storybook for the whole design system: foundations and components side by side.
- Same toolchain as the app (Vite, zoneless, Vitest), fast startup and builds.
- Accessibility checks on every story from day one.

### Negative Consequences / Trade-offs

- `@analogjs/storybook-angular` is a community integration, not maintained by the Storybook team.
  - _Mitigation_: it is widely used in the Angular/Nx community; switching back to `@storybook/angular`'s builder only requires changing the framework and executors.
- Extra dev dependencies (`@angular-devkit/build-angular` and friends) are installed only to satisfy peer ranges.
- `shared-ui` relies on an Nx override flag for future generator runs (`NX_IGNORE_UNSUPPORTED_TS_SETUP=true`).
- All design-system components live in one library, so its tests and Storybook rebuild when any component changes.
  - _Mitigation_: acceptable at the current size; split into more `ui-*` libraries later if it becomes a bottleneck.

---

## Pros and Cons of the Options

### One design-system Storybook in `libs/shared/ui`

- **Good**, because designers and developers get one catalogue.
- **Good**, because it keeps tokens framework-agnostic while giving components an Angular home.
- **Bad**, because one library holds many components.

### Storybook per library

- **Good**, because it is the Nx default and isolates each library.
- **Bad**, because several Storybooks have to be run and deployed, and foundations are separate from components.

### Storybook on the tokens library

- **Good**, because it needs the fewest projects.
- **Bad**, because it mixes framework-agnostic tokens with Angular components.

### `@analogjs/storybook-angular` (Vite)

- **Good**, because it matches the app's Vite/esbuild toolchain and supports zoneless change detection.
- **Bad**, because it is a community package.

### `@storybook/angular` webpack builder

- **Good**, because it is the official Storybook framework.
- **Bad**, because it builds with webpack and expects `zone.js`, diverging from the app's zoneless esbuild setup.

---

## Implementation Guidelines / Next Steps

1. Generate design-system components into `libs/shared/ui/src/lib/<component>/` as standalone, `OnPush` components using signal `input()`/`output()`, and export them from `src/index.ts`.
2. Every component gets a co-located `<component>.stories.ts` (CSF3, `Meta`/`StoryObj` from `@analogjs/storybook-angular`) with the states it supports and `fn()` spies for outputs.
3. Run Storybook with `npx nx storybook shared-ui`; CI builds it with `build-storybook`.
4. Next: add typography tokens with a **Foundations/Typography** page, then Button / Nav Button components.
5. When components with behavior arrive, add interaction tests (`play` functions) run through `@storybook/addon-vitest`, and consider publishing the built Storybook (e.g. GitHub Pages or Chromatic).
