# ADR-0030: DevFest Real Content and the Workshop Agenda

- **Status**: Accepted
- **Date**: 2026-11-02
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

## Context and Problem Statement

The DevFest pages (ADR-0029) carried the Figma placeholder copy: "Topic: TBA" talks, free panel slots, keynotes to be announced, a guessed panel order, two parallel talk rooms and a note instead of the workshop agenda. The real programme is now published on the GDG community event page (https://gdg.community.dev/e/m8h9cm/, event 128481): 13–14 November 2026 at Uniwersytet Ekonomiczny we Wrocławiu, four panels with four keynotes on Friday, and on Saturday a single sequence of talks next to a single sequence of workshops.

The real day 2 does not fit the Figma layout: the talks are not split across Sala A and Sala B, and the workshops (45 min) run on their own clock beside the talks (20–30 min), so they cannot share rows of one schedule. The agenda model has no place for a workshop schedule at all.

## Decision Drivers

- Show the programme attendees will actually get, with the abstracts the speakers wrote.
- Keep the Figma components and filters; change the UI library only where the real data needs it.
- Keep `libs/ui` presentational: the content stays in the events app (ADR-0013, ADR-0023).

## Considered Options

- Put talks and workshops in two columns of one parallel schedule.
- Give day 2 a separate workshop schedule under the existing Format navigation (Talks / Workshops), each with one room.
- Load the programme from the community platform API at runtime.

## Decision Outcome

Chosen option: "a separate workshop schedule under the Format navigation", because the two streams have different slot lengths, and the Format chips from Figma already split talks from workshops; only the workshop agenda was missing.

- **UI**: `DevfestParallelDay` gains `workshops` (entries in the same shape as the talks) and `workshopRooms`. With workshops, the Workshops format renders a `ParallelSchedule` of them, and the track chips stay available; `workshopsNote` remains the fallback before an agenda is published. A single room hides the Room toggle, as before.
- **Content** (`apps/events/src/app/content/devfest.ts`): the real panel order (Web, Cloud, Mobile, AI) and times, the four keynotes, both day 2 schedules with full `<time datetime>` values, the RSVP link to the event page, and a speaker directory of 34 people. People keep one card with every role (panelist, presenter, trainer, keynote). Topics not yet announced stay "TBA". Names follow the event page.
- **Abstracts** live in `devfest-abstracts.ts`, keyed by session title, copied from the event page; a test checks that every abstract is used by a session, so a renamed title fails the build instead of silently losing its abstract.
- **Bios**: `DevfestSpeaker` gains `bio` (one string per paragraph). The Speaker card shows it behind a "Pokaż bio" disclosure button, styled like the Presentation card abstract, so the directory grid stays compact. Bios live in `devfest-bios.ts`, keyed by name, from the speakers' submissions and the event page. A test checks that every bio is on a card. Submissions are edited down to their professional content before publishing.
- **Static content, not the API**: the community platform API is undocumented and outside our control; the programme changes rarely, and a copy in the repo is reviewed in pull requests.

### Positive Consequences

- The site shows the real programme, including all ten workshops.
- The workshop agenda reuses the talk cards, time markers and track filter.

### Negative Consequences

- The content must be updated by hand when the event page changes (remaining TBA topics, the Synergy Codes keynote speaker).
- Speaker photos and companies from the event page are not shown yet; the Avatar has no image support.
- An expanded bio makes its card taller than the others in the row.

## Implementation Guidelines / Next Steps

- When the event page changes, update `devfest.ts` and the abstracts in the same pull request.
- Consider photo support in the Avatar and a company line on the Speaker card, so the speaker directory can use the photos and titles from the event page.
- The partners from the event page (Solvro, Machinekind, JS Poland, NG Poland, Synergy Codes, inQUBE, UEW, AI HUB @ UEW) could fill a partners section on the DevFest pages.
