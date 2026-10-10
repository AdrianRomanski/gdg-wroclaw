# ADR-0020: Navbar, Footer and the GDG Logo

- **Status**: Accepted
- **Date**: 2026-10-10
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

The Figma **Landing Page** (`143:2897`) is split into three PRs: the Navbar and Footer (this ADR), the Events section, and the Landing page template. [ADR-0017](0017-workshop-page-template.md) left the Navbar and Footer as the next step, because every page needs them.

- **Navbar** (`Container`, `143:2899`):
  - the GDG logo (`Group`, 68.8 × 40 vector) and the wordmark "Google Developer Groups" (36px Regular), 24px apart
  - five Nav Buttons (Agenda, Speakers, Organizers, Q&A, About us), then 24px, then two 40px buttons 8px apart: "Register" (filled) and "Contact us" (outlined)
  - global page padding at the sides, 8px block padding
- **Footer** (`Footer / 4 /`, `143:3117`):
  - the medium section padding (80px, Figma variable `Section Padding/padding-section-medium`) and the 1280px container
  - a main row, 32px gaps: the logo, the five Nav Buttons in the center, and five social icons (Facebook, Instagram, X, LinkedIn, YouTube)
  - 80px below, a divider and then the legal links (Privacy Policy, Terms of Service, Cookies Settings): 14px Roboto, underlined, 24px apart
- Figma defines no mobile Navbar or Footer.

## Decision Drivers

- One Navbar and one Footer for every page, presentational (ADR-0013).
- Reuse `NavButton`, `Button`, `SocialLinks` and the icon registry.
- Landmarks and names that work with screen readers.
- A usable phone layout, which Figma lacks.

## Considered Options

- **Logo**:
  - the Figma vector in a `GdgLogo` component template (chosen)
  - an SVG file that every app has to copy into its assets
  - an image URL input
- **Links**:
  - plain `href`s through a `NavLink` shape (chosen)
  - `routerLink` inside `ui`
- **Phone navigation**:
  - a disclosure menu behind a menu button (chosen)
  - a horizontally scrolling link row
  - hiding the links

## Decision Outcome

### `GdgLogo` (`<gdg-logo [height] [label]>`)

- The Figma vector, copied unchanged into the template except for the layer ids. Those would repeat when the logo appears twice on a page.
- Like the role badge artwork (ADR-0016), it ships inside the library, so apps don't have to set up assets.
- It is decorative by default, because it always sits next to the wordmark or inside a named link. With `label`, it becomes `role="img"`.
- `height` defaults to 40px, and the width follows the 68.8 : 40 ratio.

### `NavLink` and `NavAction`

```ts
interface NavLink {
  label: string;
  href: string;
  current?: boolean;
}
interface NavAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}
```

- `current` renders `aria-current="page"` (the `NavButton` active style).
- Links are plain `href`s. An app using the router either passes URLs or wraps the components. `ui` stays router-free (ADR-0013).

### `Navbar` (`<gdg-navbar [links] [actions]>`)

- Inputs: `brand` (default "Google Developer Groups"), `homeHref`, `links`, `actions`, and `navLabel`/`menuLabel` for translations.
- Structure:
  - The home link contains the logo and the wordmark. The wordmark is the link's accessible name.
  - `<nav aria-label="Main">` lists the links as `gdg-nav-button` anchors.
  - The actions are `gdg-button` links, size `m` (40px), primary or secondary blue.
- Typography: the wordmark uses `font.heading-1-regular` (36px) with a 1.5 line height, `font.heading-4-regular` below 80rem, and `font.paragraph-7` below 40rem.
- **Below 64rem** (not in Figma):
  - The links and actions move into a panel below the bar, opened by an icon-only menu button (Phosphor `list`, which turns into `x` when open).
  - The button carries `aria-expanded` and `aria-controls`.
  - Escape or choosing a link closes the panel.
- The Navbar is not sticky. That is left to the app shell.

### `Footer` (`<gdg-footer [links] [socials] [legalLinks]>`)

- Inputs:
  - `homeHref`, and `homeLabel` (default "Google Developer Groups Wrocław, home")
  - `links`
  - `socials: SocialLink[]` with `owner` (default "GDG Wrocław", so a link reads "GDG Wrocław on YouTube")
  - `legalLinks`
  - `navLabel` ("Footer") and `legalLabel` ("Legal")
- Layout:
  - The main row has equal outer columns, so the links stay centered.
  - The credits have a 1px `border.default` divider and 32px padding.
  - The legal links use `font.paragraph-8` (Figma's Roboto mapped to Google Sans), underlined.
  - Below 64rem everything stacks, centered. Below 48rem the paddings are smaller.
- `SocialNetwork` gains `facebook`, `instagram` and `youtube`. Phosphor `facebook-logo`, `instagram-logo` and `youtube-logo` are added to the icon registry, along with `list` for the menu button.
  - Figma draws these icons filled. The registry uses the regular (outline) weight, consistent with the existing social icons (ADR-0016).

### Tokens

- `layout.padding-section-medium` (80px, Figma `Section Padding/padding-section-medium`).

### Positive Consequences

- Every page and app shell can use the same Navbar and Footer, with no asset setup.
- Landmarks are named (Main, Footer, Legal), and the current page is announced.
- Phones get a working menu.

### Negative Consequences / Trade-offs

- The phone menu, the wordmark scaling and the outline social icons are not in Figma and need designer confirmation.
- Router integration (active link detection) is the consumer's job.

## Implementation Guidelines / Next Steps

- The Events section (event card, date filters), then the Landing page template that combines all the sections.
- An app shell in `apps/events` with the Navbar, `<main>` and the Footer.
