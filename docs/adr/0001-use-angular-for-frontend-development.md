# ADR-0001: Use Angular for Frontend Development

- **Status**: Accepted
- **Date**: 2026-08-26
- **Deciders**: GDG Wrocław Core Team, Frontend Working Group
- **Consulted**: Community Contributors, Maintainers
- **Informed**: All project contributors

---

## Context and Problem Statement

The GDG Wrocław organization requires a robust, scalable, and maintainable frontend framework to build modern web applications, event management tools, community portals, and shared UI component libraries within an Nx monorepo.

To enable diverse community members and maintainers to collaborate effectively, we need a frontend solution that provides:

1. Strong, opinionated architectural patterns that reduce boilerplate and fragmentation across repositories/packages.
2. First-class TypeScript support and end-to-end type safety.
3. Seamless integration with the Nx monorepo tooling ecosystem (generators, caching, module boundaries, and dependency graph).
4. Modern reactive primitives and high rendering performance.
5. Rich ecosystem support for component-driven UI development (e.g., Storybook, design systems).
6. Clear alignment with Google Developer Group's technology focus and community initiatives.

---

## Decision Drivers

- **Ecosystem & Community Alignment**: As a Google Developer Group (GDG), aligning with Angular connects directly with Google's web technology ecosystem, enabling practical demonstrations, workshops, and community contributions centered around Google technologies.
- **Monorepo & Nx Synergy**: Angular enjoys first-class support in Nx via `@nx/angular`, featuring automated migrations (`nx migrate`), code generators, project graph analysis, and boundary enforcement.
- **Modern Angular Features**: Recent iterations of Angular have modernized the developer experience with Standalone Components (eliminating `NgModule` complexity), Signals-based fine-grained reactivity, built-in control flow (`@if`, `@for`, `@switch`), deferrable views (`@defer`), and hydration/SSR capabilities.
- **Batteries-Included Architecture**: Built-in routing, dependency injection, reactive forms, HTTP client, and testing utilities reduce reliance on disparate third-party libraries and ensure consistent code style across contributors.
- **Maintainability & Stability**: Long-term predictability, formal deprecation cycles, and automated migration tooling minimize breaking changes over time.

---

## Considered Options

1. **Angular (Modern Standalone + Signals)**
2. **React (with Next.js / Vite)**
3. **Vue.js (v3 with Vite / Nuxt)**
4. **Svelte / SvelteKit**

---

## Decision Outcome

Chosen option: **Angular (Modern Standalone + Signals)**.

Angular delivers a cohesive, enterprise-ready architecture that pairs naturally with our Nx workspace and community mission. Modern Angular's paradigm shifts—specifically Standalone Components and Signals—provide an ergonomic developer experience while retaining the robust structure and dependency injection required for scalable monorepo development.

### Positive Consequences

- **Consistent Project Architecture**: Opinionated structure and conventions reduce bikeshedding and make it easy for new contributors to understand and navigate the codebase.
- **Built-in Tooling & Standards**: No need to independently evaluate and assemble routing, forms, or dependency injection solutions.
- **First-Class Nx Integration**: Scaffolding apps and libraries via Nx generators (`nx g @nx/angular:...`) enforces consistent library types (`ui`, `data-access`, `feature`, `util`).
- **Optimal Performance**: Angular Signals enable fine-grained reactivity, while deferrable views (`@defer`) simplify lazy loading for improved Core Web Vitals (LCP, INP).
- **Component-Driven Development**: Full compatibility with Storybook for building, testing, and documenting reusable UI components.
- **Community Showcase**: Serves as a reference implementation of modern Angular best practices for GDG Wrocław workshops and talks.

### Negative Consequences / Trade-offs

- **Learning Curve for Non-Angular Developers**: Contributors familiar only with JSX-based ecosystems may need a short onboarding ramp to learn Angular concepts (templates, signals, DI).
  - _Mitigation_: Emphasize modern Angular simplifications (Standalone Components, Signals, new template syntax) and maintain starter guides and Storybook documentation.
- **Build Times & Dependency Footprint**: Angular toolchains and monorepo configurations can be more substantial than minimal setups.
  - _Mitigation_: Nx computational caching, Vite/ESBuild-based application builders (`@angular-devkit/build-angular:application`), and task distribution mitigate build overhead.

---

## Pros and Cons of the Options

### Angular (Modern Standalone + Signals)

- **Good**, because it is fully batteries-included with standard solutions for routing, forms, DI, and HTTP.
- **Good**, because modern Standalone Components and Signals eliminate legacy `NgModule` boilerplate and offer reactive performance comparable to other modern reactive frameworks.
- **Good**, because Nx provides first-class support (`@nx/angular`) for generation, testing, building, and module boundary linting.
- **Good**, because it reinforces GDG Wrocław's alignment with Google's open-source web technologies.
- **Bad**, because it introduces a distinct template syntax and DI model that differs from JSX-based libraries.

### React (with Next.js / Vite)

- **Good**, because of wide community familiarity and a large ecosystem of third-party libraries.
- **Good**, because of flexible rendering strategies.
- **Bad**, because it lacks an official opinionated structure for state management, forms, routing (outside frameworks), or dependency injection, leading to potential inconsistency across monorepo packages.
- **Bad**, because it does not have the same direct alignment with Google's core web framework as Angular does for a GDG chapter.

### Vue.js (v3 with Vite / Nuxt)

- **Good**, because of gentle learning curve, clean Single-File Components (SFC), and reactive composition API.
- **Bad**, because Nx monorepo plugin support for Vue is less mature than for Angular/React.
- **Bad**, because team/community familiarity in the local chapter is more strongly centered around Angular and Google technologies.

### Svelte / SvelteKit

- **Good**, because of lightweight runtime, concise syntax, and reactive compiler approach.
- **Bad**, because enterprise tooling and Nx ecosystem support are relatively limited compared to Angular.
- **Bad**, because smaller talent pool and fewer enterprise-grade UI design libraries.

---

## Implementation Guidelines

All frontend development within this repository must adhere to the following conventions:

1. **Standalone Architecture**:
   - All components, directives, and pipes must be standalone.
   - Do not introduce `NgModule` definitions in new packages.

2. **Reactivity & State Management**:
   - Utilize Angular **Signals** (`signal()`, `computed()`, `effect()`, `input()`, `output()`, `model()`) for component inputs, outputs, and local reactive state.
   - Use RxJS primarily for asynchronous event streams, complex orchestration, and HTTP communication.

3. **Template Standards**:
   - Use the built-in control flow syntax (`@if`, `@for`, `@switch`) instead of legacy structural directives (`*ngIf`, `*ngFor`).
   - Use `@defer` blocks to optimize loading performance for heavy UI sections and below-the-fold components.

4. **Monorepo Structure (Nx)**:
   - Organize frontend packages by responsibility:
     - `feature-*`: Smart container components and route-level views.
     - `ui-*`: Presentational/dumb components documented in Storybook.
     - `data-access-*`: Services, state management, and API clients.
     - `util-*`: Helper functions, custom pipes, and validators.

5. **Design System & Documentation**:
   - UI components must include Storybook stories for visual testing and documentation.
   - Follow accessibility (a11y) standards across all components.
