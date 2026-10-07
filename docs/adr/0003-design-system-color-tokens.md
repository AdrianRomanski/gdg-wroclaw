# ADR-0003: Build a Design System Starting with Color Tokens from Figma

- **Status**: Accepted
- **Date**: 2026-10-07
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

The `events` application (showcasing [GDG Wrocław events](https://gdg.community.dev/gdg-wroclaw/)) is designed in Figma. The design file defines foundations (Colors, Typography), components (Button / Nav Button) and pages (Landing, Team/Partners, Workshop, FAQs, Contact Form).

Before building pages, we need a shared design system so that every application and `ui-*` library uses the same visual foundations instead of hard-coding values. The first foundation is color.

The Figma "Colors" page (node `0:1`) defines 20 colors as drawn swatches (not Figma variables):

| Group     | Colors                                             |
| :-------- | :------------------------------------------------- |
| Core      | Blue 500, Green 500, Yellow 600, Red 500           |
| Halftones | Halftone Blue, Green, Yellow, Red                  |
| Pastels   | Pastel Blue, Green, Yellow, Red                    |
| Grayscale | OFF White, Black 02                                |
| Alpha     | OFF White and Black 02 at 40%, 20% and 10% opacity |

We need to decide how these tokens are represented in code, where they live, and how applications consume them.

---

## Decision Drivers

- **Single place to change a color**: Updating a color must not require touching every component.
- **Framework-agnostic styling**: Tokens should work in component styles, global styles, Storybook and any future non-Angular tooling.
- **Runtime theming**: Leave room for theme switching (e.g. dark mode) without rebuilding.
- **Traceability to Figma**: Token names should map 1:1 to Figma names so designers and developers speak the same language.
- **Nx compatibility**: The library must fit the workspace's TypeScript project-references setup and ADR-0002 layout.

---

## Considered Options

1. **CSS custom properties in a shared tokens library** (with a mirrored TypeScript map)
2. **SCSS variables / maps**
3. **Tailwind CSS theme configuration**
4. **TypeScript constants only** (CSS-in-JS or inline styles)

---

## Decision Outcome

Chosen option: **CSS custom properties in a shared tokens library**, because they are native to the platform, work in any stylesheet without a preprocessor, can be overridden at runtime for theming, and need no additional tooling.

- Library: `libs/shared/ui-tokens` (project `shared-ui-tokens`, import path `@org/shared-ui-tokens`, tags `scope:shared`, `type:ui`).
- Tokens are defined in `src/styles/colors.css` on `:root` with the `--gdg-color-` prefix, named after Figma (e.g. Figma "Halftone Blue" → `--gdg-color-halftone-blue`, "Alpha Black 02 40" → `--gdg-color-black-02-alpha-40`). Alpha colors use 8-digit hex.
- `src/tokens.css` is the entry point that imports all token files (colors now; typography, spacing, etc. later). It is exported as `@org/shared-ui-tokens/tokens.css`.
- Applications import it once in their global stylesheet: `@import '@org/shared-ui-tokens/tokens.css';` and declare `implicitDependencies: ["shared-ui-tokens"]`, because Nx does not detect CSS imports in the project graph.
- A TypeScript map (`colors`, `ColorToken`, `colorVar()`) is exported for code that needs colors outside CSS (Storybook, charts). A unit test keeps it in sync with the CSS.
- The library was generated with `@nx/js:library` (non-buildable) because `@nx/angular:library` does not support the workspace's TypeScript project-references setup, and tokens do not need Angular. This added `@nx/vitest`, `vite` and `@vitest/coverage-v8` as dev dependencies.

### Positive Consequences

- One source of truth in code for every color, traceable to Figma.
- Works in Angular component styles, global CSS, Storybook and any future framework.
- Runtime theming is possible by overriding the custom properties on a selector.
- No preprocessor or CSS framework lock-in.

### Negative Consequences / Trade-offs

- Colors are duplicated in CSS and TypeScript.
  - _Mitigation_: a unit test fails if the two drift apart.
- Figma colors are swatches, not Figma variables, so syncing is manual.
  - _Mitigation_: token names mirror Figma names; if the designers move to Figma variables, we can generate the CSS from them.
- Typos in `var(--gdg-color-…)` are not caught at compile time.
  - _Mitigation_: consider Stylelint rules for allowed custom properties later.

---

## Pros and Cons of the Options

### CSS custom properties in a shared tokens library

- **Good**, because they are native, framework-agnostic and themeable at runtime.
- **Good**, because they need no build tooling.
- **Bad**, because they offer no compile-time checking in stylesheets.

### SCSS variables / maps

- **Good**, because they support compile-time math and loops.
- **Bad**, because the workspace uses plain CSS (`style: css` in `nx.json`), so SCSS would add a preprocessor.
- **Bad**, because values are compiled away and cannot be themed at runtime.

### Tailwind CSS theme configuration

- **Good**, because it offers utility classes and a strong token convention.
- **Bad**, because it introduces a CSS framework, which is a larger decision deserving its own ADR.
- **Bad**, because tokens would be tied to Tailwind instead of usable everywhere.

### TypeScript constants only

- **Good**, because they are type-safe.
- **Bad**, because they cannot be used directly in stylesheets, which pushes styling into TypeScript.

---

## Implementation Guidelines / Next Steps

1. Never hard-code a color that exists in the design system; use `var(--gdg-color-…)` (or `colorVar()` in TypeScript).
2. When Figma colors change, update `colors.css` and `colors.ts` together; the unit test enforces it.
3. Add new foundations (typography next, then spacing, radii, shadows) as files in `libs/shared/ui-tokens/src/styles/`, imported from `src/tokens.css`.
4. Introduce semantic tokens (e.g. `--gdg-color-text-primary`, `--gdg-color-surface`) on top of these palette tokens once components define how colors are used.
5. Document the palette in Storybook when Storybook is introduced (ADR-0001).
