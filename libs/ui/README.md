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

| Component         | Usage                                                                                                | Figma                                           | ADR                                                                               |
| :---------------- | :--------------------------------------------------------------------------------------------------- | :---------------------------------------------- | :-------------------------------------------------------------------------------- |
| `ContactForm`     | `<gdg-contact-form termsUrl="/terms" [pending]="sending()" (submitted)="send($event)" />`            | Contact / 3 / (`181:9133`)                      | [ADR-0014](../../docs/adr/0014-contact-form-and-form-control-primitives.md)       |
| `FaqItem`         | `<gdg-faq-item question="Is it free?" variant="plain" color="blue">Yes.</gdg-faq-item>`              | FAQ item (`181:6547`)                           | [ADR-0015](../../docs/adr/0015-faq-item-variants-and-generated-puzzle-outline.md) |
| `FaqSection`      | `<gdg-faq-section [entries]="faqs" variant="puzzle" askHref="/contact" />`                           | FAQ / 11 / (`181:6549`, `181:6770`)             | [ADR-0015](../../docs/adr/0015-faq-item-variants-and-generated-puzzle-outline.md) |
| `Footer`          | `<gdg-footer [links]="nav" [socials]="socials" [legalLinks]="legal" />`                              | Footer / 4 / (`143:3117`)                       | [ADR-0020](../../docs/adr/0020-navbar-footer-and-gdg-logo.md)                     |
| `GdgLogo`         | `<gdg-logo [height]="40" />`                                                                         | Group (`143:2901`)                              | [ADR-0020](../../docs/adr/0020-navbar-footer-and-gdg-logo.md)                     |
| `Navbar`          | `<gdg-navbar [links]="nav" [actions]="actions" />`                                                   | Navbar Container (`143:2899`)                   | [ADR-0020](../../docs/adr/0020-navbar-footer-and-gdg-logo.md)                     |
| `PartnerCard`     | `<gdg-partner-card [partner]="partner" variant="card" />`                                            | Partners (`181:8588`)                           | [ADR-0019](../../docs/adr/0019-partner-card-and-partners-section.md)              |
| `PartnersSection` | `<gdg-partners-section [partners]="partners" layout="carousel" ctaHref="/contact" />`                | Partners (`181:5975`), Team / 10 / (`181:7330`) | [ADR-0019](../../docs/adr/0019-partner-card-and-partners-section.md)              |
| `PersonCard`      | `<gdg-person-card [person]="member" frame="puzzle" />`                                               | Person (`180:3087`)                             | [ADR-0018](../../docs/adr/0018-person-card-and-team-section.md)                   |
| `PersonRow`       | `<gdg-person-row [person]="trainer" />`                                                              | Workshop trainer Card (`143:6008`)              | [ADR-0016](../../docs/adr/0016-person-row-role-badge-and-display-type.md)         |
| `RoleBadge`       | `<gdg-role-badge role="speaker" [ring]="false" />`                                                   | Badge (`180:2682`)                              | [ADR-0016](../../docs/adr/0016-person-row-role-badge-and-display-type.md)         |
| `SocialLinks`     | `<gdg-social-links [links]="person.socials" [owner]="person.name" />`                                | Social Icons (`143:6016`)                       | [ADR-0016](../../docs/adr/0016-person-row-role-badge-and-display-type.md)         |
| `TeamSection`     | `<gdg-team-section [members]="team" frame="circle" ctaHeading="We’re hiring!" ctaHref="/contact" />` | Team / 2 / (`181:5312`, `181:4620`)             | [ADR-0018](../../docs/adr/0018-person-card-and-team-section.md)                   |
| `EventBanner`     | `<gdg-event-banner [src]="event.bannerUrl" />`                                                       | Banner (`143:5974`)                             | [ADR-0017](../../docs/adr/0017-workshop-page-template.md)                         |
| `WorkshopDetails` | `<gdg-workshop-details [topic]="w.topic" [description]="w.description" [trainers]="w.trainers" />`   | Container (`143:5975`)                          | [ADR-0017](../../docs/adr/0017-workshop-page-template.md)                         |
| `WorkshopPage`    | `<gdg-workshop-page [workshop]="workshop" />` (page template, Storybook `Pages/Workshop`)            | Event Header / 1 / (`143:5973`)                 | [ADR-0017](../../docs/adr/0017-workshop-page-template.md)                         |

## Storybook

Co-locate stories (`src/lib/<component>/<component>.stories.ts`) titled `UI/<Component>`, or `Pages/<Page>` for page
templates. Shared story fixtures go in `*.stories-data.ts`, which the library build excludes (ADR-0017). They are rendered by the
workspace Storybook in [`apps/storybook`](../../apps/storybook/README.md) (`npx nx storybook storybook`).

## Running unit tests

Run `npx nx test ui` to execute the unit tests via [Vitest](https://vitest.dev/).
