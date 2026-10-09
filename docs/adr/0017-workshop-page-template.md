# ADR-0017: Workshop Page Template, Event Banner and Workshop Details

- **Status**: Accepted
- **Date**: 2026-10-09
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

[ADR-0016](0016-person-row-role-badge-and-display-type.md) added the building blocks of the Figma **Workshop Page** (`Event Header / 1 /`, node `143:5973`). This ADR covers the rest of the page.

- **Banner** (`143:5974`): a full-width 1440 × 449 image. In Figma it is a GDG brand-kit header PNG that still reads "Editable Location".
- **Container** (`143:5975`), 80px below the banner:
  - the topic (48px, Display 1) and a long description (24px)
  - 80px further down, "Trainers" (24px bold), then the trainer rows 48px below it
- The section has the large section padding at the bottom and the global page padding at the sides.

This is the first full **page** in `ui`. ADR-0013 keeps `ui` presentational: routing, data loading and the app shell (Navbar, Footer) belong elsewhere. Its Storybook conventions already reserve a `Pages/*` title group.

## Decision Drivers

- Match the Figma page while staying reusable for every workshop.
- Keep `ui` presentational (ADR-0013).
- Don't commit brand assets that still have placeholder text.
- Correct document structure: one `<h1>` per page.

## Considered Options

- **Banner**:
  - an image input, with a neutral placeholder in Storybook (chosen)
  - commit the Figma PNG as a default
  - rebuild the banner artwork in SVG/CSS
- **Page**:
  - a presentational `WorkshopPage` template in `ui` that takes a `Workshop` (chosen)
  - only sections in `ui`, composed in the app
- **Sample data**:
  - a `*.stories-data.ts` file excluded from the library build (chosen)
  - inline data in each story

## Decision Outcome

### `EventBanner` (`<gdg-event-banner [src] [alt]>`)

- A full-width `<img>` at Figma's 1440 : 449 ratio with `object-fit: cover`.
- It is decorative by default (`alt=""`), because the page heading follows. Set `alt` when the image carries information.
- No brand image is committed. Each event passes its own, for example the GDG brand-kit header with "Wrocław" filled in.
- Storybook uses `apps/storybook/public/banners/placeholder.svg`, a neutral placeholder.

### `WorkshopDetails` (`<gdg-workshop-details>`)

- Inputs:
  - `topic` (required)
  - `description` (plain text, with line breaks kept)
  - `trainers: Person[]`
  - `trainersHeading` (default "Trainers")
- Structure: the topic is the page's `<h1>` in `font.display-1`. The description uses `font.heading-4-regular` (24px). "Trainers" is an `<h2>` (`font.heading-4`) labelling its `<section>`, with a unique id per instance. Each trainer is a `PersonRow`, whose name is an `<h3>`.
- Spacing as in Figma: 24px between the topic and the description, 80px to the trainers, and 48px from the heading to the rows.
- Without trainers, the section is left out.
- Below 48rem: H1 (36px) for the topic, P6 (18px) for the description, and a 64px gap.

### `WorkshopPage` (`<gdg-workshop-page [workshop]>`) and `Workshop`

```ts
interface Workshop {
  topic: string;
  description?: string;
  banner?: { src: string; alt?: string };
  trainers?: readonly Person[];
}
```

- The page is an `<article>`: the banner, then `WorkshopDetails` in the 1280px container.
  - The container sits 80px below the banner, or the large section padding when there is no banner.
  - It is inside the global page padding, with the large section padding at the bottom.
- Below 48rem the paddings shrink to 20px at the sides and 40–64px vertically.
- The page has no routing, data loading or app shell. The events app (or a future `feature-workshops` library) resolves the route, loads the `Workshop` and renders the template inside its layout with the Navbar and Footer.
- Storybook: `Pages/Workshop`, the first entry in the `Pages/*` group reserved by ADR-0013.

### Tokens

- `spacing.80`, the gap between the banner and the content and between page blocks. It is not yet a Figma variable.

### Story data

- `workshop.stories-data.ts` holds the Figma sample workshop. It is used by the Workshop Details and Workshop page stories, and excluded from the library build (`tsconfig.lib.json`) and the public API.
- The `*.stories-data.ts` pattern is for shared story fixtures. It does not match Storybook's `*.stories.ts` glob.

### Positive Consequences

- One template renders any workshop. The app only maps its data to `Workshop`.
- No brand placeholder ("Editable Location") ships, and the real banner stays a content decision.
- Correct heading structure for the page: `h1` topic, `h2` Trainers, `h3` names.

### Negative Consequences / Trade-offs

- The page template assumes the app shell provides `<main>`, the Navbar and the Footer.
- Storybook shows a placeholder banner instead of the Figma artwork.
- `spacing.80` exists only in code until it is added as a Figma variable.

## Implementation Guidelines / Next Steps

- Add the Navbar and Footer (Landing page) to `ui`, then an app shell in `apps/events`.
- Add a workshop route in `apps/events` that maps the data source to `Workshop` (a `data-access` library once there is an API).
- Commit the final GDG Wrocław banner when the brand-kit export is ready, if it should be a default.
