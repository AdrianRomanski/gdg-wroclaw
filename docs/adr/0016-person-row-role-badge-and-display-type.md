# ADR-0016: Person Row, Role Badge, Social Links and a Display Type Size

- **Status**: Accepted (amends the heading size in [ADR-0014](0014-contact-form-and-form-control-primitives.md))
- **Date**: 2026-10-09
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

The Figma **Workshop Page** (`Event Header / 1 /`, node `143:5973`) has, from top to bottom:

- a banner image
- the workshop topic and description
- a **Trainers** list

Each trainer row (`Card`, `143:6008`) combines:

- a 160px photo
- a 55px **role badge** (an instance of the Badge set on the Team/Partners page, `180:2682`)
- name, job title and bio
- **social icons** (LinkedIn, X, Dribbble)

The Team page reuses the badge, the social icons and the same person data in its Person cards (`180:3087`).

The Workshop page is split into two PRs. This ADR covers the first one: the reusable building blocks and the tokens they need. The page sections follow in the next ADR.

Open questions:

1. **Display size.**
   - The topic heading is 48px, from the Figma variable `Text Sizes/Heading 2`.
   - Our type scale (ADR-0005) tops out at `Headings Bold/H1`, 36px.
   - ADR-0014 used 36px for the Contact heading for that reason. The same variable now appears again, so 48px is part of the design rather than a one-off.
2. **Badge artwork.**
   - Figma builds the badge from several layers: a shadow, a disc, an optional white ring, the GDG logo, a role icon, and a masked group for the Member icon.
   - There are three roles (Member, Organizer, Speaker) and a `Stroke` (ring) on/off property.
3. **Person data.** Workshop trainers and Team members show the same facts. They need one shared shape.
4. **Sample photos.** The Figma photos have to come from somewhere for the stories.

## Decision Drivers

- Reuse across the Workshop and Team pages.
- Tokens follow Figma variables (ADR-0008).
- ADR-0013 layers: GDG-specific UI lives in `ui`; only generic primitives go in the design system.
- Accessibility: badges and icon links need accessible names.

## Considered Options

- **48px headings**:
  - a `font.display-1` token, also used for the Contact heading (chosen)
  - a display token used on the Workshop page only
  - keep H1 (36px)
- **Badge**:
  - one inline SVG per role, assembled from the Figma layers, with the disc and ring drawn by the component (chosen)
  - six exported SVG files, one per Figma variant
  - `<img>` tags pointing at Figma exports
- **Badge location**:
  - `ui` (chosen)
  - `design-system-components`
- **Social icons**:
  - Phosphor logos from the existing registry (chosen)
  - the Figma SVGs

## Decision Outcome

### Tokens and icons

- `font.display-1`: 48px bold with a 1.2 line height (57.6px), from Figma `Text Sizes/Heading 2`.
  - The 9-step scale stays unchanged. `display-*` is a separate group above it.
  - The Foundations Typography page shows it.
  - The **Contact form heading now uses it** (48px, as in Figma). This amends ADR-0014.
- `color.border.default`: off-white, from Figma `Border/Border`, for 1px list dividers.
- New Phosphor icons: `linkedin-logo`, `x-logo`, `dribbble-logo`, `github-logo`, `globe`.

### `Person` (`ui`)

```ts
interface Person {
  name: string;
  jobTitle?: string;
  bio?: string;
  photo?: { src: string; alt?: string };
  role?: 'member' | 'organizer' | 'speaker';
  socials?: {
    network: 'linkedin' | 'x' | 'github' | 'dribbble' | 'website';
    url: string;
  }[];
}
```

This is the data contract for trainers now, and for speakers, organizers and members on the Team page later. A future `data-access` library maps API data to it.

### `RoleBadge` (`ui`, `<gdg-role-badge>`)

- Inputs:
  - `role` (required)
  - `ring` (Figma `Stroke`, default `true`)
  - `size` in px (default 55)
  - `label`
- The artwork lives in `role-badge-artwork.ts`. Each role's GDG logo and icon were assembled once from the Figma layer SVGs, at their Figma positions in a 483 × 483 viewBox.
  - The Member icon's mask becomes a circular `clipPath`. Each instance gets its own id, so several badges on one page don't clash.
  - The blurred drop shadow is left out: at 20% opacity it is invisible on the dark page.
- The component draws the disc (`--gdg-color-background-default`) and the ring (`--gdg-color-content-default`) itself, so one artwork serves both Figma `Stroke` variants.
- The logo and icon colors stay as in the artwork. They are brand illustration, not UI color.
- It is GDG-specific, so it lives in `ui`.
- It is an image (`role="img"`) named after the role ("Speaker", or `label` for translations). The role is often not written next to it.

### `SocialLinks` (`ui`, `<gdg-social-links>`)

- Inputs: `links: SocialLink[]` and an optional `owner`.
- A list of 24px Phosphor icon links. Each is named after its owner and network ("Ada Lovelace on LinkedIn").
- Links open in a new tab with `rel="noopener noreferrer"`.
- The gap is 16px instead of Figma's raw 14px, to stay on the spacing scale.
- Phosphor's regular weight is used. Figma's LinkedIn mark is filled; this keeps one consistent icon style (ADR-0011).

### `PersonRow` (`ui`, `<gdg-person-row>`)

- Takes a `person` input.
- Layout as in Figma:
  - a 1px `border.default` divider above, with 32px block padding
  - a 160px photo with the 12px radius, 32px from the content
  - the badge next to the name (H4) and job title (P8), then the bio (P7)
  - social links at the bottom end
- The name is an `<h3>`, sitting under the section's `<h2>`. The photo has empty `alt` by default, because the name is right next to it.
- Optional parts are left out when missing. Without a photo, the row shows the person's initials.
- Below 40rem it stacks, with a 120px photo.

### Storybook sample photos

- `apps/storybook/public/people/trainer-{1,2,3}.jpg` are the three photos from the Figma Workshop page.
  - They are cropped to Figma's framing and saved at 320px (2× the display size), about 50 KB in total.
  - They are served through Storybook `staticDirs` and are not shipped with any library.
- Their source and licence are unknown (they came with the Figma file). Replace them with photos of GDG Wrocław people before anything public is built from Storybook.

### Positive Consequences

- The Team page can reuse `Person`, `RoleBadge` and `SocialLinks` directly.
- Headings now match Figma's 48px where the design uses it.
- The badges are sharp at any size, with no image requests and no clashing SVG ids.

### Negative Consequences / Trade-offs

- The badge artwork is a snapshot of Figma. If the designers change it, re-export it.
- Sample photos of unknown origin sit in the repository. This is flagged above for replacement.
- Small visual differences from Figma: the outline LinkedIn icon and the 16px icon gap.

## Implementation Guidelines / Next Steps

- PR 2: `EventBanner`, `WorkshopDetails` and the `WorkshopPage` template (next ADR).
- The Team page: a vertical Person card (with the puzzle-shaped photo frame) built on `Person`, `RoleBadge` and `SocialLinks`.
- Replace the sample photos with consented photos of GDG Wrocław organizers.
