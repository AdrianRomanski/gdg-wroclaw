# ADR-0037: Sponsors Section with Tiers on the Landing Page

- **Status**: Accepted
- **Date**: 2026-11-13
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

## Context and Problem Statement

GDG Wrocław and DevFest 2026 have tiered sponsors (Platinum: PushBased and Wroclaw University of Economics; Gold: Synergy Codes) whose logos are already in `apps/events/public/sponsors`, but nothing shows them. The Landing page (ADR-0022) only has the Partners carousel (ADR-0019), which treats every supporter the same. There is no Figma frame for sponsors, so we design the section ourselves within the design system.

## Decision Drivers

- Sponsors must be visibly distinct from community partners, and higher tiers more prominent.
- Reuse existing components and tokens; no new tokens or Figma work.
- Keep the DevFest pages focused on the agenda.
- Colour must never be the only signal of a tier, and logos must stay legible in both themes (ADR-0027).

## Considered Options

- A `tiers` layout on `PartnersSection`
- A separate `SponsorsSection` reusing `PartnerCard`
- Tier colours: a brand colour per tier; red section accent weighted by tier; metallic colours; neutral tiles with pastel badges per tier; neutral tiles with a pastel red pill; neutral tiles with an underlined label

## Decision Outcome

Chosen option: a separate **`SponsorsSection`** in `libs/ui`, placed on the Landing page **between Team and Partners**, because it keeps `PartnersSection` simple and gives sponsors their own structure.

- **Model**: `Sponsor` (`Partner` plus `tier: 'platinum' | 'gold' | 'silver'`) and the ordered `SPONSOR_TIERS` live in `libs/ui`; the app's `SPONSORS` content uses them.
- **Layout**: a centered title, then one `<section>` per non-empty tier, labelled by an `<h3>` naming the tier, of `PartnerCard` tiles: Platinum two per row, Gold three, Silver four (fewer on narrow screens).
- **Colour**: red is the section accent (its call to action defaults to red), completing the Landing rhythm of yellow Team, blue Partners and green FAQ. Tiles stay neutral, like the Partners tiles, so logos stay legible; hierarchy comes from tile size and order. The tier label is **uppercase and letter-spaced, with a thin pastel red underline**.
- **Review**: chosen after comparing options in Storybook. Red tile frames and per-tier pastel badges (red, yellow, blue) looked off for Platinum and Gold, and a pastel red pill was heavier than the underlined label.
- **Navigation**: the app Navbar links to `/#sponsors`, between Team and Partners.
- Not on the DevFest pages for now.

### Positive Consequences

- Sponsors get a clear hierarchy with existing tokens, and the tier name is always text.
- A quiet, single-colour label keeps attention on the sponsor logos.

### Negative Consequences / Trade-offs

- Red can read as an error state, so it stays in small accents (the underline and the button), never large fills.

## Pros and Cons of the Options

### A `tiers` layout on `PartnersSection`

- Good, because there are fewer files.
- Bad, because it adds tier grouping and colouring to a component that already has two layouts.

### A separate `SponsorsSection`

- Good, because each section stays focused and sponsors can evolve on their own.
- Bad, because the title and call to action markup is duplicated from `PartnersSection`.

### Metallic tier colours

- Good, because gold and silver read naturally.
- Bad, because they are off the Google brand palette and would need new tokens for both themes.

## Implementation Guidelines / Next Steps

- The tier label keeps the default text colour; the pastel red underline is decorative.
- Add new tiers to `SPONSOR_TIERS` in display order.
