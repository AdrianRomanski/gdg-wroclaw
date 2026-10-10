# ADR-0022: Landing Page Template

- **Status**: Accepted
- **Date**: 2026-10-10
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

---

## Context and Problem Statement

This is part 3 of the Figma **Landing Page** (`143:2897`). It combines the building blocks from [ADR-0018](0018-person-card-and-team-section.md) to [ADR-0021](0021-event-card-and-events-section.md) with the FAQ from [ADR-0015](0015-faq-item-variants-and-generated-puzzle-outline.md). From top to bottom:

1. **Navbar** (ADR-0020)
2. **Hero** (`143:2917`): the GDG brand-kit header image "Join our community" (1440 × 500 artwork shown at 1312 wide), 80px below the Navbar and inside the global page padding. Like the Workshop banner (ADR-0017), it still says "Editable Location Name".
3. **Events** (ADR-0021), 80px below the hero
4. **Team** (`179:2052`): circle frames with badges, and a **yellow** "Contact us" button
5. **Partners** (`181:8643`): the carousel layout, with a blue "Contact" button
6. **FAQ** (`181:6865`): green puzzle items, with "Ask a question"
7. **Footer** (ADR-0020)

The visible page title ("Join our community") is part of the hero image, so Figma has no text heading for the page.

The designer is unavailable for a long time, so the open design questions in this ADR are decided by the team.

## Decision Drivers

- One presentational template that the app feeds with content (ADR-0013), like `WorkshopPage` (ADR-0017).
- The page should work before all content exists.
- Correct document structure: one `<h1>`, then an `<h2>` per section.
- In-page navigation from the Navbar.

## Considered Options

- **Navbar and Footer**:
  - in the app shell, as with `WorkshopPage` (chosen)
  - inside the template
- **Page heading**:
  - a visually hidden `<h1>` (chosen)
  - an `<h1>` built from the hero image's `alt`
  - no `<h1>`
- **Content API**:
  - one `LandingPageContent` object with an optional entry per section (chosen)
  - one input per section

## Decision Outcome

### `LandingPage` (`<gdg-landing-page [content]>`) and `LandingPageContent`

```ts
interface LandingPageContent {
  heading: string;                           // visually hidden <h1>
  hero?: { src: string; alt?: string };
  events?: { heading?; description?; days: EventDay[] };
  team?: { heading?; description?; members: Person[]; cta… };
  partners?: { heading?; description?; partners: Partner[]; cta… };
  faq?: { heading?; description?; entries: FaqEntry[]; askHref?; askLabel? };
}
```

- **Every section is optional** and is left out when it's missing, so the site can launch with only, say, events and the FAQ.
- The template fixes the Landing variants from Figma:
  - Team with circle frames and a yellow call to action
  - Partners as the carousel
  - FAQ as green puzzle items
- The Team and Partners colors can be overridden through `ctaColor`, a new input on `TeamSection` and `PartnersSection` (default `blue`).
- **Hero**:
  - An `<img>` at the brand-kit ratio (1440 : 500), `object-fit: cover`, with `fetchpriority="high"` because it is the largest image at the top of the page.
  - Decorative by default; set `alt` when it carries text, as "Join our community" does.
  - No brand image is committed. Storybook uses `apps/storybook/public/banners/landing-placeholder.svg`.
- **Heading**: a visually hidden `<h1>` from `heading`, e.g. "Google Developer Groups Wrocław: join our community". Each section then contributes its own `<h2>`.
- **Anchors**: the sections get the ids in `LANDING_SECTION_IDS` (`events`, `team`, `partners`, `faq`), so Navbar links like `#team` work. `scroll-margin-block-start` (80px) keeps a sticky Navbar from covering the target.
- **Spacing**:
  - The hero sits 80px below the top and the Events section 80px below the hero, as in Figma.
  - The other sections keep their own large section padding.
  - Below 48rem the hero gap shrinks to 24px and the gap above Events to 48px.
- The default headings follow Figma, except Events: the default is "Events". The Storybook sample passes Figma's "Event".
- Storybook: `Pages/Landing` wraps the template in the Navbar, `<main>` and the Footer to show the whole Figma page.

### Positive Consequences

- The app needs only a route that maps its data to `LandingPageContent`.
- The page has a correct heading outline and landmarks (with the app shell), and anchor navigation.
- Partial content renders cleanly.

### Negative Consequences / Trade-offs

- The page title lives in the hero image. The visually hidden `<h1>` and the image `alt` have to be kept in sync with the artwork.
- The Landing variants are fixed in the template. Another arrangement needs a new template or direct use of the sections.

## Implementation Guidelines / Next Steps

- An app shell and a landing route in `apps/events`: the Navbar (sticky, if wanted) with section links, `<main>`, the Footer, and content from a `data-access` library.
- Commit the GDG Wrocław brand-kit hero and banner once they are exported with the chapter name.
