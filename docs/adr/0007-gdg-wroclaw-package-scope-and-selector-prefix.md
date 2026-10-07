# ADR-0007: `@gdg-wroclaw` Package Scope and `gdg` Selector Prefix

- **Status**: Accepted
- **Date**: 2026-10-07
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Maintainers
- **Informed**: All project contributors

---

## Context and Problem Statement

The workspace still carried generator placeholders:

- The npm scope `@org` (root package `@org/source`, libraries `@org/shared-ui` and `@org/shared-ui-tokens`, and the TypeScript custom condition `@org/source`).
- The `events` app used the Angular selector prefix `app` (`app-root`).
- The app rendered the generated Nx welcome page.

Import paths and selectors appear in every file that consumes a library or component. Renaming them gets more expensive with every feature, so it should happen before components and features are built.

---

## Decision Drivers

- Names should identify the project (GDG Wrocław) in imports, the DOM and npm.
- One consistent prefix across apps and libraries.
- The cheapest time to rename is now, while there are few consumers.

---

## Considered Options

1. **`@gdg-wroclaw` scope, `gdg` prefix**
2. **`@gdg` scope**: shorter, but implies the global GDG program rather than this chapter.
3. **Keep the placeholders**

---

## Decision Outcome

Chosen option: **`@gdg-wroclaw` scope with the `gdg` selector prefix**.

- Packages: `@gdg-wroclaw/source` (root), `@gdg-wroclaw/shared-ui`, `@gdg-wroclaw/shared-ui-tokens`.
- TypeScript custom condition: `@gdg-wroclaw/source`.
- All Angular selectors use the `gdg` prefix (`gdg-root`, `gdg-button`, …), enforced by `@angular-eslint/component-selector` and `directive-selector` in every Angular project. The `shared-ui` library already used `gdg`.
- The Nx welcome page is replaced with a minimal app shell (dark `black-02` background, `off-white` text, `heading-1` title, `<router-outlet />`) until the landing page is built.
- ADR-0003 to ADR-0006 still mention `@org/…`. They are historical records and are not edited; this ADR supersedes their import paths.

### Positive Consequences

- Imports read as the project's own (`@gdg-wroclaw/shared-ui-tokens`).
- DOM elements are clearly attributable (`gdg-*`).
- The app no longer ships generator demo content.

### Negative Consequences / Trade-offs

- Open branches using `@org/…` imports need a search-and-replace when rebasing.
- If packages are ever published, the `@gdg-wroclaw` npm organization must be claimed.

---

## Pros and Cons of the Options

### `@gdg-wroclaw` / `gdg`

- **Good**, because it is unambiguous and matches the repository name.
- **Bad**, because import paths are slightly longer.

### `@gdg`

- **Good**, because it is short.
- **Bad**, because it suggests the global GDG program, and the npm scope is likely unavailable.

### Keep the placeholders

- **Good**, because it needs no work.
- **Bad**, because the names say nothing about the project and become costlier to change later.

---

## Implementation Guidelines / Next Steps

1. Generate new projects with `--importPath=@gdg-wroclaw/<scope>-<name>` and `--prefix=gdg`.
2. Name the npm package of each library `@gdg-wroclaw/<project-name>` in its `package.json`.
