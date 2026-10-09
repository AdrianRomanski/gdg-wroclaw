# ui

Composed GDG Wrocław product UI, built from the design system. See
[ADR-0013](../../docs/adr/0013-design-system-and-ui-library-architecture.md).

## What belongs here

| Belongs in `@gdg-wroclaw/ui`                                     | Belongs elsewhere                                                                                                   |
| :--------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| Navbar, Footer, EventCard, FAQ item, sections of the Figma pages | Figma primitives (Button, Nav Button, Icon, …): [`design-system-components`](../design-system/components/README.md) |
| Layout and composition of design-system components               | Colors, typography, spacing, radius: [`design-system-tokens`](../design-system/tokens/README.md)                    |
| GDG-specific content structure (inputs/outputs only)             | Data fetching, state, routing logic: future `feature-*` / `data-access-*` libraries                                 |

Rules:

- Components are **presentational**: standalone, `OnPush`, signal `input()`/`output()`. No `HttpClient`, stores or
  router navigation; take data through inputs and report user intent through outputs.
- Build from design-system components and tokens (`var(--gdg-…)`), never raw colors or lengths.
- May import only `@gdg-wroclaw/design-system-components` and `@gdg-wroclaw/design-system-tokens` (enforced by
  `@nx/enforce-module-boundaries`); the design system must never import from here.

## Components

| Component     | Usage                                                                                     | Figma                      | ADR                                                                         |
| :------------ | :---------------------------------------------------------------------------------------- | :------------------------- | :-------------------------------------------------------------------------- |
| `ContactForm` | `<gdg-contact-form termsUrl="/terms" [pending]="sending()" (submitted)="send($event)" />` | Contact / 3 / (`181:9133`) | [ADR-0014](../../docs/adr/0014-contact-form-and-form-control-primitives.md) |

## Storybook

Co-locate stories (`src/lib/<component>/<component>.stories.ts`) titled `UI/<Component>`. They are rendered by the
workspace Storybook in [`apps/storybook`](../../apps/storybook/README.md) (`npx nx storybook storybook`).

## Running unit tests

Run `npx nx test ui` to execute the unit tests via [Vitest](https://vitest.dev/).
