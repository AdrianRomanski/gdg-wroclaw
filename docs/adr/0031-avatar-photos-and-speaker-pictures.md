# ADR-0031: Avatar Photos and DevFest Speaker Pictures

- **Status**: Accepted
- **Date**: 2026-11-02
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

## Context and Problem Statement

The Figma Avatar (ADR-0028) shows only initials. Now that the DevFest pages show the real programme (ADR-0030), the marketing team has a picture of every person on it: 34 people across speakers, workshop trainers, panels and keynotes. Some files are large originals (up to 3053×4580, 6 MB), some are not square, and some are GDE badge graphics with a small face. All of them are used for the event's own promotion.

## Decision Drivers

- Faces make the agenda and the speaker directory recognisable; the people agreed to promotion of the event.
- Avatars render at 40, 64 and 112 px, so the full originals are wasted bytes.
- The Avatar is a design-system primitive; keep it small and keep the initials as the default.

## Considered Options

- An image input on the Avatar, with the initials as the fallback.
- A separate Photo avatar component.
- Load the photos from the community platform's CDN.

## Decision Outcome

Chosen option: "an image input on the Avatar", because every place that shows a person already renders an Avatar, and the ring, sizes and accessibility rules stay the same.

- **Design system**: `Avatar` takes an optional `src`. The photo fills the circle inside the ring (`object-fit: cover`). It has an empty `alt`, because the host is either decorative or named by `label`. It is lazy-loaded with the size of its circle. If the photo fails to load, the initials come back.
- **UI**: `SessionPerson` gains `photo`, and the Speaker card, Presentation card, Keynote card, Discussion panel host and Panelist pass it to their Avatar.
- **Photos**: they are in `apps/events/public/speakers/<slug>.jpg`, named after the person (`Jarosław Żołnowski` → `jaroslaw-zolnowski`). Each is cropped to a 256 px square (2× the M avatar) and saved as 82% JPEG, about 400 KB for all 34. Badge graphics and wide shots are cropped to the face. Tarun Jain's headshot comes from the event page, because the marketing file is a distant stage photo. The content attaches `photoOf(name)` to every person, and a test checks that everyone has one.
- **Not the CDN**: the files are ours, they are reviewed in pull requests, and the site does not depend on another host.

### Positive Consequences

- Every person on the DevFest pages has a recognisable photo; the agenda and directory need no other change.
- The Avatar still works without a photo, and with a broken one.

### Negative Consequences

- New people need a photo file named after them; otherwise the initials show only after a failed request.
- Photos are 256 px; an L avatar on a 3× screen is slightly soft.

## Implementation Guidelines / Next Steps

- Add new photos as square 256 px JPEGs under `public/speakers/`, named with `photoOf`'s slug.
- Consider WebP/AVIF and `srcset` if photos are used at larger sizes.
