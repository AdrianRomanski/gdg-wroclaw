# ADR-0018: Person Card with Circle and Puzzle Frames, and the Team Section

- **Status**: Accepted
- **Date**: 2026-10-10
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

The Figma **Team/Partners** page holds the team building blocks. [ADR-0016](0016-person-row-role-badge-and-display-type.md) already added the `Person` data shape, `RoleBadge` and `SocialLinks` for them. This ADR covers the rest of the team part. The partners part follows in its own ADR and PR.

- **`Person` component set** (`180:3087`). Its 12 variants combine three properties:
  - `Badge`: on, a 60px role badge (no ring) sits next to the name and the role is the subtitle ("Organizer"). Off, the name and the job title are centered.
  - `Role`: Organizer, Speaker or Member.
  - `Color border`: off, the photo is a circle. On, the photo sits in a **puzzle-piece frame** (a slot in the top edge, a notch in the left edge, a slot in the bottom edge) with a 3px stroke outside the shape in the role's primary color: green, yellow, blue.
- Below the photo: the name (20px Medium), the subtitle (18px), the bio (16px) and the social icons, all centered.
- **`Team / 2 /`** has two frames, `181:5312` with circles and `181:4620` with puzzle frames:
  - a centered title: "Our team" (48px) and a description (18px), max 768px wide
  - 8 cards, four per row, 40px apart, with rows 64px apart
  - a call to action: "We're hiring!" (32px), a line of text and a "Contact us" button
  - blocks 80px apart, with the large section padding and the global page padding

Figma exports the puzzle frame as a bitmap with the sample photo baked in (`Subtract`, a boolean operation), so it can't be reused for real photos.

## Decision Drivers

- All 12 Figma variants from one component, for any photo.
- Keep the puzzle frame sharp at any card width, with the stroke in token colors.
- ADR-0013 layers: the card and the section are composed product UI, so they live in `ui`.
- Reuse the shared `Person` shape, `RoleBadge` and `SocialLinks` (ADR-0016).

## Considered Options

- **Puzzle frame**:
  - a fixed inline SVG path in a 296 × 296 viewBox, with the photo clipped to it (chosen)
  - the size-driven generated path of the FAQ item (ADR-0015)
  - the Figma bitmap
  - CSS `clip-path: path()` plus a separate outline
- **Card layout in the section**:
  - a wrapping flex row that centers an incomplete last row (chosen)
  - CSS grid `auto-fill`

## Decision Outcome

### `PersonCard` (`ui`, `<gdg-person-card [person] [frame] [badge]>`)

- Inputs:
  - `person: Person` (required)
  - `frame: 'circle' | 'puzzle'` (Figma `Color border`, default `circle`)
  - `badge` (Figma `Badge`, default on)
- **The badge needs `person.role`.** With the badge on, the subtitle is the role ("Speaker") and the job title is not shown, as in Figma. With the badge off, or without a role, the subtitle is the job title.
- **Circle**: an `<img>` with `object-fit: cover` and `--gdg-radius-full`.
- **Puzzle**: an inline SVG, defined in `puzzle-frame.ts`.
  - The card is always square, so one fixed path in the Figma size (296 × 296) scales without distortion. The generated path of ADR-0015 isn't needed.
  - Positions were measured on the Figma render. Every corner has an 8px radius.
  - The photo is an SVG `<image>` (`slice`, i.e. cover) clipped to the path, with a clip-path id unique to each instance.
  - The stroke is drawn under the photo: 6px wide, centered on the edge, with `vector-effect: non-scaling-stroke`, so 3px shows outside the shape as in Figma.
  - Stroke colors: organizer `brand.green.primary`, speaker `brand.yellow.primary`, member `brand.blue.primary`. Without a role it is `border.default`.
- **Accessibility**:
  - The photo is decorative by default (`alt` is empty, since the name is right below it). With `photo.alt`, the puzzle SVG becomes `role="img"` with that label.
  - The name is an `<h3>`, below the section's `<h2>`.
- **Without a photo**, the card shows the initials on a translucent fill, as `PersonRow` does. The initials helper moves to `person/initials.ts` and both components use it. In the puzzle frame, an opaque backdrop keeps the inner half of the stroke hidden.
- Typography:
  - name: 20px Medium (`font.size-5` with the medium weight), line height 1.5
  - subtitle: `font.paragraph-6`
  - bio: `font.paragraph-7`
- The social links are pinned to the bottom of the card, so they line up across a row when bios differ in length. Figma gives every card the same fixed height instead.
- `RoleBadge` now exports `PERSON_ROLE_LABELS`, the English role names. They are the badge's default accessible name and the card subtitle.

### `TeamSection` (`ui`, `<gdg-team-section>`)

- Inputs:
  - `heading` (default "Our team")
  - `description`
  - `members: Person[]` (required)
  - `frame`
  - `badges`
  - `ctaHeading`, `ctaText`, `ctaHref`, `ctaLabel` (default "Contact us")
- The call to action is left out when it has neither a heading nor a link. The button is shown only with `ctaHref`.
- Structure: an `<h2>` title in `font.display-1`, the cards as a `<ul>`, and the call to action as an `<h3>` (`font.heading-2`), its text and a primary blue `gdg-button` link. The button text is black, not Figma's white (ADR-0012).
- Layout:
  - Section paddings and the 1280px container (ADR-0014), blocks `spacing.80` apart.
  - Cards in a wrapping flex row, so an incomplete last row is centered. There are 4 columns, then 3 below 75rem, 2 below 56rem (24px gap) and 1 below 36rem (at most 20rem wide).
  - Below 48rem: smaller paddings, a 64px block gap, and `font.heading-1` for the title.

### Story data

- `team.stories-data.ts` holds the eight Figma cards in Figma order. They reuse the Workshop sample photos in `apps/storybook/public/people` (the same Figma images), and the file is excluded from the library build (ADR-0017).

### Positive Consequences

- One component covers all 12 Figma `Person` variants, and the section covers both `Team / 2 /` frames.
- The puzzle frame stays sharp at any width, with a constant 3px stroke in token colors. No bitmap is shipped.
- Real photos of any aspect ratio work, cropped to cover.

### Negative Consequences / Trade-offs

- The frame geometry lives in code. If the designers change the shape, update `puzzle-frame.ts`.
- With the badge on, the job title is hidden. Teams that need both must turn the badge off.
- The column breakpoints and the bottom-pinned social links are not in Figma and need designer confirmation.

## Implementation Guidelines / Next Steps

- Partners: a `PartnerCard` and a `PartnersSection` (grid and carousel), in a separate ADR and PR.
- A Team page template in `Pages/*` once the Navbar and Footer exist (ADR-0017).
- Ask the designers to confirm the responsive columns and how the badge and the job title combine.
