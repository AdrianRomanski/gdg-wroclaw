# ADR-0033: XL Avatar for Panelists

- **Status**: Accepted
- **Date**: 2026-11-02
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

## Context and Problem Statement

ADR-0032 moved discussion panelists to the largest Figma Avatar size, L (112px). Reviewing the result, the core team asked for the panel faces to be about twice as large: the panels are the main stage of day 1, and the people are what attendees come for. The Figma Avatar stops at L, and a fixed 224px circle does not fit five panelists side by side on a desktop panel (columns of about 180px). We have no designer available, so we decide this ourselves within the design system.

## Decision Drivers

- Panel faces about twice the L size wherever there is room.
- Stay consistent with the Avatar's look: the same circle, ring, raised fallback and initials.
- No horizontal overflow at any width.

## Considered Options

- A new Avatar size, XL (224px), that shrinks to fit its container.
- A fixed 224px avatar, with panelists wrapping onto more rows.
- Size the panel avatars with CSS in `libs/ui`, outside the Avatar.

## Decision Outcome

Chosen option: "a new XL size that shrinks to fit", because it keeps every Avatar size inside the design system component, and it lets five panelists stay in one row on desktop.

- **Avatar** (`libs/design-system/components`): `size="xl"` is 224px, `min(224px, 100%)` of its container, and stays round (`aspect-ratio: 1`). The initials use Heading 1, and the ring is 2px so it keeps its weight next to the larger circle. S, M and L are unchanged.
- **Discussion panel**: panelists use XL, and the host goes from M to L. Measured at a device scale factor of 2: about 179px per face on a 1280px desktop (five in a row), 224px on a tablet, and about 153px on a 390px phone (two columns, with an odd one out centered at the same width).
- **Photos**: the speaker photos are re-exported at 400px (the size of most sources), instead of 256px, so the larger circles stay sharp on high-density screens. All photos together grow from about 400 KB to about 770 KB, and they are lazy-loaded.

### Positive Consequences

- Panelists are recognisable at a glance on every screen size.
- Other components can use the larger size without new CSS.

### Negative Consequences

- XL is not in the Figma Avatar component (9024:27); Figma should get the size when a designer is available.
- Panels are taller, especially on phones.
- A few source photos are only 200px or smaller (for example Dominika Zajac's face crop), so they look soft at XL until we get larger originals.

## Implementation Guidelines / Next Steps

- Ask the speakers with small source photos for larger originals.
- Add the XL size to the Figma Avatar component.
