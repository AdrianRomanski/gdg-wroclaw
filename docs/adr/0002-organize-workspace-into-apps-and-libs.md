# ADR-0002: Organize the Nx Workspace into `apps/` and `libs/`

- **Status**: Accepted (amended by [ADR-0013](0013-design-system-and-ui-library-architecture.md))
- **Date**: 2026-10-07
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Maintainers
- **Informed**: All project contributors

---

## Context and Problem Statement

The workspace was bootstrapped with the Nx TypeScript preset, which places every project under a single `packages/` folder. The first Angular application (`web`, see [ADR-0001](0001-use-angular-for-frontend-development.md)) was generated there.

ADR-0001 commits us to splitting frontend code into `feature-*`, `ui-*`, `data-access-*` and `util-*` libraries. As the number of projects grows, a flat `packages/` folder mixes deployable applications with reusable libraries, making it harder to see what is shipped, what is shared, and where new code belongs.

We need a folder convention that makes the role of each project obvious and scales with the number of applications and libraries.

---

## Decision Drivers

- **Clarity**: Contributors should be able to tell from the path whether a project is deployable or reusable.
- **Thin applications**: Encourage keeping applications as thin shells that compose libraries.
- **Nx conventions**: Align with the layout Nx generators, docs and community examples use by default.
- **Low migration cost**: The workspace currently contains a single project, so restructuring now is cheap.

---

## Considered Options

1. **`apps/` + `libs/`** — applications in `apps/`, libraries in `libs/`
2. **Single `packages/` folder** — keep the preset layout
3. **Domain-first folders** — e.g. `events/app`, `events/feature-list`, top-level per domain

---

## Decision Outcome

Chosen option: **`apps/` + `libs/`**, because it separates deployable projects from reusable code at a glance, matches the default Nx layout, and supports the library types defined in ADR-0001.

- **`apps/`** contains deployable applications only (e.g. `apps/events`). Applications contain bootstrapping, configuration and routing composition; business logic and UI live in libraries.
- **`libs/`** contains all reusable code, grouped by scope (domain) and named by type:

  ```
  libs/
    <scope>/
      feature-<name>/
      ui-<name>/
      data-access-<name>/
      util-<name>/
    shared/
      ui-<name>/
      util-<name>/
  ```

`nx.json` declares `workspaceLayout` (`appsDir: apps`, `libsDir: libs`) and the npm `workspaces` field lists `apps/*` and `libs/*`.

### Positive Consequences

- The role of each project is clear from its path.
- Applications stay thin, and logic is shareable between applications.
- Matches Nx docs and generator defaults, so examples apply without translation.

### Negative Consequences / Trade-offs

- Two top-level folders instead of one; contributors must pick the right one.
  - _Mitigation_: this ADR and the README document where each kind of project goes.
- Moving a library between scopes later requires the Nx move generator (`nx g @nx/workspace:move`).

---

## Pros and Cons of the Options

### `apps/` + `libs/`

- **Good**, because deployable and reusable code are visibly separated.
- **Good**, because it is the most widely used Nx layout.
- **Bad**, because a domain's code is split across two top-level folders.

### Single `packages/` folder

- **Good**, because it requires no migration.
- **Good**, because it suits workspaces of publishable npm packages.
- **Bad**, because applications and libraries are mixed, which scales poorly for an application-centric repository.

### Domain-first folders

- **Good**, because all code for one domain sits together.
- **Bad**, because it deviates from Nx defaults and makes it harder to see what is deployable.
- **Bad**, because it is premature for a workspace with a single application.

---

## Implementation Guidelines / Next Steps

1. Generate applications into `apps/`, e.g.:
   ```sh
   npx nx g @nx/angular:application apps/<name>
   ```
2. Generate libraries into `libs/<scope>/<type>-<name>`, e.g.:
   ```sh
   npx nx g @nx/angular:library libs/events/feature-list
   ```
3. Applications must not import from other applications; shared code goes into a library.
4. Next step: tag projects with `scope:*` and `type:*` and enforce allowed dependencies via `@nx/enforce-module-boundaries` `depConstraints` once the first libraries exist.
