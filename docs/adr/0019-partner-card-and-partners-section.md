# ADR-0019: Partner Card and the Partners Section (Grid and Carousel)

- **Status**: Accepted
- **Date**: 2026-10-10
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

This ADR covers the partners part of the Figma **Team/Partners** page. The team part is [ADR-0018](0018-person-card-and-team-section.md).

- **`Partners` component set** (`181:8588`) has two variants, each a square image above a 20px name:
  - `Property 1=Partner`: the image has an 8px radius (Figma variable `radius-8`) and the name is centered (Google Sans Medium).
  - `Property 1=Card`: square corners, and the name is start-aligned in **Roboto** SemiBold, a font the design system does not use (ADR-0005).
- **`Partners`** (`181:5975`), a grid:
  - a centered title: "Partners" (48px) and a description (18px)
  - 8 `Partner` tiles, four per row, 40px apart, with rows 64px apart
- **`Team / 10 /`** (`181:7330`), a carousel:
  - a start-aligned title
  - a controls row 48px above the cards: 8px slider dots on the left, and two 48px outlined round buttons (caret left and right) on the right
  - a row of 7 `Card` partners, three visible, 48px apart, with the fourth running past the container edge
  - a start-aligned "Join us!" call to action (32px) with a "Contact" button
- In Figma the image is a generic placeholder. Real partner logos come in every aspect ratio, often on transparent backgrounds.

## Decision Drivers

- Both Figma layouts from one section component, and both card variants from one card.
- Logos must not be cropped.
- An accessible, keyboard-usable carousel without a third-party library.
- Tokens over raw values (ADR-0008, ADR-0010). Stay presentational (ADR-0013).

## Considered Options

- **Carousel**:
  - native horizontal scrolling with CSS scroll snap, plus previous/next buttons that scroll by one card (chosen)
  - a transform-based slider with its own state
  - a carousel library
- **Logo fit**:
  - `contain` on a light tile with padding (chosen)
  - `cover`, as the Figma placeholder does
- **Card name font**:
  - Google Sans `font.heading-5` (20px Bold) (chosen)
  - loading Roboto SemiBold

## Decision Outcome

### `Partner` and `PartnerCard` (`ui`, `<gdg-partner-card [partner] [variant]>`)

```ts
interface Partner {
  name: string;
  logo?: { src: string; alt?: string };
  url?: string;
}
```

- `variant: 'tile' | 'card'` (Figma `Partner` and `Card`, default `tile`).
- **The logo is shown whole**: `object-fit: contain` with 24px padding on an `off-white` square. Tiles get `--gdg-radius-8`; cards keep square corners.
- `alt` is empty by default, because the name is shown below the logo.
- Without a logo, the tile shows the name's first letter.
- With a `url`, the whole card is a single link to the partner's site. It opens in a new tab (`noopener noreferrer`), like `SocialLinks`. Its accessible name is the partner name.
- Name typography:
  - tile: 20px Medium, centered
  - card: `font.heading-5`, start-aligned. Figma's Roboto SemiBold maps to the closest Google Sans style.

### `PartnersSection` (`ui`, `<gdg-partners-section>`)

- Inputs:
  - `heading` (default "Partners")
  - `description`
  - `partners: Partner[]` (required)
  - `layout: 'grid' | 'carousel'` (default `grid`)
  - `ctaHeading`, `ctaText`, `ctaHref`, `ctaLabel` (default "Contact")
  - `previousLabel`, `nextLabel`
- **Grid**: a centered title and `tile` cards in a wrapping flex row (an incomplete last row is centered), the same layout as the Team section. There are 4 columns, then 3 below 75rem and 2 below 48rem.
- **Carousel**:
  - A start-aligned title.
  - The cards are a `<ul>` inside a scrollable `role="region"` viewport, named after the heading and focusable (`tabindex="0"`), so it scrolls with the keyboard. The scrollbar is hidden, and `scroll-snap-type: x mandatory` snaps each card to the start.
  - 3 cards are visible, then 2 below 64rem, then 1.25 below 40rem (one card and a peek at the next).
  - **Buttons**: secondary icon-only `gdg-button`s with Phosphor `caret-left` and `caret-right`, named "Previous partners" and "Next partners". They have `aria-controls` pointing to the viewport, scroll by one card (smooth unless reduced motion is preferred), and are disabled at either end.
  - **Dots**: one per scroll position (cards − visible + 1), with the current one highlighted. They are `aria-hidden`: the buttons and the scrollable region already convey position. They are indicators, not controls.
  - The viewport size, the visible count and the position are measured in the browser after render (`afterNextRender` with a scroll listener and a `ResizeObserver`), so the section is SSR-safe.
  - Within the container: Figma lets the fourth card bleed past it, but this needs the viewport width and is left out.
- Call to action (both layouts): an `<h3>` in `font.heading-2`, P6 text and a primary blue `gdg-button` link (black text, ADR-0012). It is centered in the grid and start-aligned in the carousel, and left out when it has neither a heading nor a link.
- Section paddings, the 1280px container and `spacing.80` between blocks are shared with the Team section. Below 48rem: smaller paddings and `font.heading-1` for the title.

### Tokens and icons

- `radius.8` (Figma variable `radius-8`).
- Phosphor `caret-left` added to the icon registry.

### Story data

- `partners.stories-data.ts`, with a neutral placeholder logo in `apps/storybook/public/partners/placeholder.svg`, standing in for the Figma image placeholder. It is excluded from the library build (ADR-0017).

### Positive Consequences

- One section covers both Figma partner layouts, and one card covers both variants.
- Logos of any shape show uncropped.
- The carousel is native scrolling: touch, trackpad and keyboard work, and it needs no dependency.

### Negative Consequences / Trade-offs

- The light logo tile, the padding and the bold Google Sans name in the card variant differ from Figma.
- No edge bleed in the carousel.
- The dots are not clickable.
- The breakpoints, the disabled button state and the mobile peek are not in Figma and need designer confirmation.

## Implementation Guidelines / Next Steps

- A Team/Partners page template in `Pages/*`, combining `TeamSection` and `PartnersSection`, once the Navbar and Footer exist (ADR-0017).
- Ask the designers to confirm the logo treatment, the card name font, and the carousel's responsive and disabled states.
