# ADR-0032: DevFest Design Review — Faces First

- **Status**: Accepted
- **Date**: 2026-11-02
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

## Context and Problem Statement

With real photos on the DevFest pages (ADR-0031), a design review at 1280px and 390px found that people were hard to recognise. Panelists used 40px avatars in columns about 200px wide, so a face was a few pixels across. Panel hosts and talk speakers also used 40px avatars, and the speaker directory used 64px. The review also found noise on day 2: each talk showed its time twice (beside the card and inside it), and a lone "Prezentacje" or "Warsztaty" room header repeated the format chip above it. We have no designer available, so we decide these gaps ourselves within the design system.

## Decision Drivers

- People come to see who is speaking: faces must read at a glance on both phones and desktops.
- Stay inside the design system: only the Figma Avatar sizes (S 40px, M 64px, L 112px), the existing tokens and the existing components.
- Remove repetition before adding anything.

## Considered Options

- Bigger avatars with the existing sizes, and layouts that give them room.
- A new, fluid Avatar size.
- Leave the Figma sizes and rely on the photos.

## Decision Outcome

Chosen option: "bigger avatars with the existing sizes", because the L and M sizes already exist and the layouts have the room for them.

- **Discussion panel**: the host avatar goes from S to M. Panelists use L, centered over their name. On mobile, panelists form a two-column grid of L avatars instead of the Figma inline list of S avatars, and an odd one out is centered. `Panelist` gains a `size` input (default S, as in Figma).
- **Presentation card**: speakers use M avatars, 16px before the name.
- **Keynote card**: the speaker uses an L avatar.
- **Speaker card**: an L avatar. The roles and the talk title are grouped 4px apart under the name, instead of each on a 16px row.
- **Parallel schedule**: a single room has no header row, because the format navigation already names it. Day 2 content leaves out the time inside the card, because the schedule shows it beside the card.

### Positive Consequences

- Every person on the DevFest pages is recognisable; the panels read as a line-up rather than a list.
- No new tokens, sizes or components; the design system stays as it is.

### Negative Consequences

- Panels and speaker cards are taller, especially on mobile.
- The mobile panel and the larger avatars differ from the Figma frames; this ADR records why.

## Implementation Guidelines / Next Steps

- Pass an avatar size from the composing component (`size="l"`) rather than overriding Avatar styles.
- Update the Figma DevFest frames to match when a designer is available.
