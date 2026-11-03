# ADR-0036: Large Speaker Photos on Talks and Workshops

- **Status**: Accepted
- **Date**: 2026-11-03
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

## Context and Problem Statement

After ADR-0034 the panels and keynotes show each person's whole photo at XL size, but the day 2 talks and workshops (Presentation card) still show M (64px) round avatars and the speaker directory (Speaker card) L (112px) ones, and several talk, workshop and keynote speakers' photos were tight crops or small exports. The core team asked for bigger, high-quality photos on the talks and workshops, with the whole picture, not cropped. We have no designer available, so we decide this ourselves within the design system.

## Decision Drivers

- The same face size and treatment across the panels, keynotes, talks and workshops.
- The whole photo, never cropped.
- No horizontal overflow, including two speakers on a narrow card.

## Considered Options

- Reuse the Panelist (XL square avatar, name under it) for the Presentation card speakers.
- Make the existing avatar-and-name row larger (L or XL square beside the name).

## Decision Outcome

Chosen option: "reuse the Panelist", because it is already the stacked XL square with the name that the panels use, so talks, workshops and panels look alike.

- **Presentation card**: each speaker is a `Panelist` with an XL square avatar in the track color (up to 224px), in a grid of columns at least 9rem and at most 14rem wide, so two speakers sit side by side and shrink on narrow cards.
- **Speaker card** (speaker directory): the whole photo in an XL square (up to 224px) in the track color, with the track tag under it instead of beside it.
- **Photos**: the talk, workshop and keynote speakers who are not on a panel are re-exported from the marketing team's originals (Speakers, Workshops and Keynotes folders, 2026-11-03), the largest one per person, uncropped, as in ADR-0034: square originals at their own size up to 800px, non-square ones contained whole on a blurred fill. The panel photos stay as exported in ADR-0034.

### Positive Consequences

- Speakers are recognisable at a glance on every DevFest session.
- One component for a person on a session, with one look.

### Negative Consequences

- Talk and workshop cards are taller.
- Przemysław Nowak's (280px) and Tomasz Flis's (200px) originals are small, so their photos stay soft until we get larger ones.
- XL square speakers on the Presentation card are not in Figma.

## Implementation Guidelines / Next Steps

- Ask Przemysław Nowak and Tomasz Flis for larger photos.
