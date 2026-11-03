# ADR-0035: Track-Colored Keynotes

- **Status**: Accepted
- **Date**: 2026-11-03
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

## Context and Problem Statement

The day 1 keynotes are now known: three on robotics (Grzegorz Piotrowski, Przemysław Nowak and Michal Pogoda Rosikon) and one on AI (Łukasz Jaźwa). The Figma Keynote card (9040:511) is always brand blue and has no track, so a visitor cannot tell a robotics keynote from an AI one, while every other DevFest session shows its track. The core team asked for robotics keynotes in white, the robotics track color, like the categories. We have no designer available, so we decide this ourselves within the design system.

## Decision Drivers

- Keynotes read as part of their track, like the talks and panels.
- Text on the card stays readable (WCAG AA) with the existing on-brand content color.
- Keynotes without a track keep the Figma look.

## Considered Options

- Color the whole card with the track color.
- Keep the card blue and only add a track tag.
- Keep the card blue and add a track-colored border or rule.

## Decision Outcome

Chosen option: "color the whole card", because it is what the team asked for and makes the track visible at a glance on the main stage timeline.

- `DevfestKeynote` takes an optional `track` (and `trackLabel`).
- **Keynote card**: with a track it gets `data-track` and a track tag after the type tag. AI cards are brand red, Robotics cards off-white (the robotics track color on the dark site); both keep the on-brand (black) content, which passes AA on both. Other tracks, and keynotes without a track, stay brand blue as in Figma.
- The bio button on the card is outlined in the card's text color, so it reads on every fill.
- **Content**: the 18:50 slot (Synergy Codes, to be announced) goes to Michal Pogoda Rosikon's "The World Is Your Next Runtime" (Robotics), and 19:50 to Łukasz Jaźwa's "The Road to Optimizing the AI Bill" (AI). RoboPies and "Who Let the Dogs Out?" are Robotics. The speaker directory lists both new keynotes.

### Positive Consequences

- The track of every main stage session is visible.
- Keynotes stand out from the panels while staying in their track's color.

### Negative Consequences

- Track-colored keynotes are not in Figma.
- Web, Mobile and Cloud keynotes would stay blue; if we get some, we need to decide their fills (yellow and green read with black text, Cloud would be indistinguishable from the default).

## Implementation Guidelines / Next Steps

- Add the track-colored Keynote card variants to Figma when a designer is available.
