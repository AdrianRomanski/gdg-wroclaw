# ADR-0006: CI without Nx Cloud, and Storybook Smoke Tests

- **Status**: Accepted
- **Date**: 2026-10-07
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Maintainers
- **Informed**: All project contributors

---

## Context and Problem Statement

Two problems surfaced after the design-system foundations (ADR-0003 to ADR-0005) were merged:

1. **CI depended on Nx Cloud, which is not connected.** The generated workflow ran `nx start-ci-run --distribute-on=…`, `nx record` and `nx fix-ci`, which require an Nx Cloud workspace. The repository has no `nxCloudId`, so these steps cannot work.
2. **The Storybook dev server rendered blank pages while CI stayed green.**
   - The `tsConfig` option of the `@analogjs/storybook-angular` executors is resolved relative to the project root, so `libs/shared/ui/tsconfig.storybook.json` became `libs/shared/ui/libs/shared/ui/…`. The Angular Vite plugin ran without a tsconfig and served raw TypeScript (`SyntaxError: Unexpected token '{'`).
   - In dev mode the plugin compiles every `.ts` file through its TypeScript program. Files of `@org/shared-ui-tokens` (consumed from source by the docs pages) belong to a composite project reference and were emitted as **empty modules**.
   - The static build uses a different pipeline and worked, and CI only ran `build-storybook`, so nothing caught it.

---

## Decision Drivers

- CI must work with the infrastructure we actually have.
- The developer-facing Storybook (dev server) must be tested, not only the static build.
- Keep tooling minimal and free for an open-source community project.

---

## Considered Options

### CI

1. **Plain GitHub Actions with Nx's local cache persisted via `actions/cache`**
2. **Connect Nx Cloud** (remote cache, distributed execution, self-healing CI)

### Storybook verification

A. **Playwright smoke test over every Storybook index entry, against both the dev server and the static build**
B. **`@storybook/test-runner`**
C. **`@storybook/addon-vitest`**

---

## Decision Outcome

Chosen options: **plain GitHub Actions with a cached `.nx/cache`** (Nx Cloud may be revisited later in its own ADR), and **a Playwright smoke test over all entries in both Storybook modes**.

- CI (`.github/workflows/ci.yml`): `npm ci` → restore `.nx/cache` → `nx format:check` → `nx run-many -t lint test build typecheck build-storybook` → `nx run-many -t test-storybook`. All Nx Cloud steps were removed, along with the Nx Cloud sections in the README.
- `shared-ui:test-storybook` (`nx:run-commands`, depends on `build-storybook`) runs `libs/shared/ui/playwright.config.ts`:
  - It reads `dist/storybook/shared-ui/index.json` and visits **every story and MDX docs page**.
  - Each page is checked in two Playwright projects: `dev` (`nx run shared-ui:storybook --ci` on port 4400) and `static` (`vite preview` of the build on port 4410).
  - A page fails on uncaught errors, console errors, an empty root, Storybook's error display, or missing design tokens (`--gdg-color-blue-500`).
  - It uses the system Google Chrome (`channel: 'chrome'`), which is preinstalled on GitHub's `ubuntu-latest` runners, so no browser download is needed.
- The Storybook compile fix:
  - The executors no longer pass `tsConfig`, so the Analog preset falls back to `libs/shared/ui/.storybook/tsconfig.json`.
  - That file is a **non-composite** tsconfig used only by the Storybook plugin. It includes the `shared-ui` sources and the `ui-tokens` sources, so workspace libraries consumed from source are compiled and emitted.
  - Type checking still uses `tsconfig.storybook.json`, which stays part of the project-references build.
- New dev dependency: `@playwright/test`.

The smoke test was verified to fail against the previous configuration: both docs pages failed in `dev` and passed in `static`, which reproduces the bug.

### Positive Consequences

- CI runs with no external service; the Nx cache still speeds up repeat runs.
- Blank or crashing Storybook pages fail the PR, in both modes contributors and reviewers use.
- Every new story or docs page is covered automatically.

### Negative Consequences / Trade-offs

- No distributed task execution or remote cache sharing between machines.
  - _Mitigation_: the workspace is small; revisit Nx Cloud when CI time grows.
- The smoke test depends on Google Chrome being installed (locally and in CI).
- The non-composite Storybook tsconfig must list workspace libraries that stories consume from source.
  - _Mitigation_: Phase 1 of the roadmap moves token data to JSON (W3C Design Tokens format), so docs pages no longer import TypeScript from `ui-tokens`.

---

## Pros and Cons of the Options

### Plain GitHub Actions + `actions/cache`

- **Good**, because it is free, simple, and needs no account.
- **Bad**, because the cache is per-repository and tasks are not distributed.

### Nx Cloud

- **Good**, because of remote caching, distribution and flaky-task detection.
- **Bad**, because it needs an account and setup, which is not wanted for now.

### Playwright smoke test (both modes)

- **Good**, because it covers MDX docs pages and the dev server, where the bug occurred.
- **Bad**, because it is a custom test (about 60 lines) that we maintain ourselves.

### `@storybook/test-runner`

- **Good**, because it is official and runs `play` functions.
- **Bad**, because it targets stories, not MDX docs pages, and runs against one URL.

### `@storybook/addon-vitest`

- **Good**, because it integrates with Vitest and suits interaction tests.
- **Bad**, because it does not render MDX docs pages or exercise the dev server's compile path.

---

## Implementation Guidelines / Next Steps

1. Run `npx nx test-storybook shared-ui` before pushing Storybook changes.
2. When components with `play` functions arrive, add `@storybook/addon-vitest` for interaction tests; keep this smoke test for docs pages and both build modes.
3. Revisit Nx Cloud in a dedicated ADR if CI duration becomes a problem.
