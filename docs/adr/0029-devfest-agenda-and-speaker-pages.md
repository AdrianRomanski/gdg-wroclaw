# ADR-0029: DevFest Agenda and Speaker Pages

- **Status**: Accepted
- **Date**: 2026-11-02
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

---

## Context and Problem Statement

The Figma **DevFest** page (`8929:4507`) composes the DevFest components ([ADR-0028](0028-devfest-components.md)) into six frames. Like the components, it is AI-generated, and the designer is away long term, so the team settles its open questions.

| Frame                                | Node        | Content                                                                 |
| :----------------------------------- | :---------- | :---------------------------------------------------------------------- |
| Day 1 desktop — Main stage           | `9043:2020` | Hero with a caption and "Zarejestruj się", the agenda: keynotes, panels |
| Day 1 mobile — Main stage            | `9043:2442` | The same at 390px: time above each card                                 |
| Day 2 desktop — Presentations        | `9028:1211` | The agenda in two rooms (Sala A / Sala B), breaks, a format navigation  |
| Day 2 mobile — Presentations         | `9042:1641` | Stacked toggles, a Room toggle, grouped times in a yellow box           |
| Speaker directory — Desktop / Mobile | `9044:2755` | Role navigation, track chips, the keynote, hosts, panelists, presenters |
|                                      | `9044:3192` | and an empty workshop-trainers note                                     |

The frames add pieces that ADR-0028 did not cover:

- **Filters**:
  - the Category filters ("Wszystkie" as a Nav Button, the tracks as Tags);
  - the Format navigation ("Prezentacje", "Warsztaty") as Nav Buttons;
  - the speaker Track browsing (Tags after a "Ścieżki" label).
- **Room headers** over the day 2 columns, a **Grouped session block** (two time ranges in one row), an **Empty room**.
- The **DevFest hero** artwork (a raster image), and the **Trainer list note**. The note uses a `code-xml` icon from another icon set.

The Day 1 and Day 2 frames are two states of the same page: they share the hero and the section heading, and differ in the selected Day toggle option.

## Decision Drivers

- Keep the layering of [ADR-0013](0013-design-system-and-ui-library-architecture.md): generic controls in the design system, DevFest composition in `ui`, content in the app.
- Reuse the ADR-0028 components and `SegmentedControl` instead of new variants.
- Interactive where Figma draws controls: the toggles and chips must filter, not only look selected.
- One responsive component per section, as in ADR-0028.
- Keep every component's styles under the 4 kB budget.

## Considered Options

1. **Two static pages per day**, one route each, as drawn.
2. **One agenda page with a Day toggle**, plus a speakers page, built from small sections that filter client-side.

## Decision Outcome

Chosen option 2.

### Design system (`libs/design-system/components`)

- **`FilterChips`** (`<gdg-filter-chips label="Ścieżka" [chips] [(value)] />`):
  - a labelled `role="group"` of toggle buttons (`aria-pressed`); one is selected at most;
  - each chip is a `pill` (the Nav Button look) or a `tag` (the Tag look, with an optional accent dot);
  - the selected chip gets the Nav Button active background, and a selected tag also gets a default-content border;
  - `allowEmpty` lets the selected chip be pressed again to clear it (the speaker Track browsing has no "all" chip).
  - It is not built on `NavButton` (that marks the current page with `aria-current`) or on `SegmentedControl` (a radio group with one tab stop and a filled selection).
- **`SegmentedControl`**: options now wrap to new rows when their labels do not fit, so the Day, Room and Role toggles stack on phones as in the mobile frames.
- **Icons**: Phosphor `code` stands in for the Figma `code-xml` icon.

### DevFest components (`libs/ui`)

| Component             | Figma                             | Notes                                                                                                        |
| :-------------------- | :-------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| `DevfestHero`         | `Hero` (9043:2046)                | The artwork at 1280 : 719.75, 24px radius (16px on phones). An optional caption and Primary button below.    |
| `MainStageTimeline`   | `Main stage timeline` (9043:2083) | `<ol>` of keynotes and panels behind time markers. Below 48rem (container query): the time above the card.   |
| `ParallelSchedule`    | `Schedule` (9029:1260)            | A grid with a time column and a column per room, plus opening and break rows.                                |
| `DevfestAgenda`       | `Agenda` (9043:2054, 9028:1245)   | Section heading, Day toggle, Format chips (day 2), track chips, then the timeline, the schedule or the note. |
| `DevfestSpeakers`     | `Speaker directory` (9044:2755)   | Role toggle with the total count ("Wszyscy (29)"), track chips, the keynote, then the groups.                |
| `DevfestNote`         | `Trainer list note` (9044:3152)   | Icon in a raised circle and a muted line, for content still to come.                                         |
| `DevfestAgendaPage`   | Day 1 / Day 2 frames              | Template: a hidden `<h1>`, the hero and the agenda (`#agenda`). `day` selects the frame.                     |
| `DevfestSpeakersPage` | Speaker directory frames          | Template: a hidden `<h1>`, the hero and the directory.                                                       |

Details of `ParallelSchedule` below 48rem:

- The room headers become a Room toggle (a `SegmentedControl`) that shows one room.
- The time moves above the talks.
- A grouped block shows its two ranges in a yellow-bordered box.

Shared model additions (`devfest-session.ts`):

- `DevfestSessionSlot`: a row of talks with an optional `groupedTime`/`groupedNote`, one talk or `null` per room.
- `DevfestParallelEntry`: a slot, or a `DevfestScheduleItem`.
- `DevfestStageSession`: a keynote or a panel.
- `FILTER_TRACKS`: AI, Web, Mobile, Cloud and Robotyka, in the Figma order.
- `DevfestSpeaker.role` also accepts a list, one line per role, for people with a panel and a talk ("obie role na jednej karcie").

Page content types live in `devfest-page/devfest-content.ts`.

### Filtering rules

- **Track**: only sessions or people of that track stay. Rows and groups left empty are removed.
- Keynotes, openings and breaks have no track and always stay, because they are for everyone.
- **Role** (speakers): "Wszyscy" shows every group; another option shows only that group.
- **Format** (day 2): "Warsztaty" replaces the schedule with a note until the workshop agenda exists.

### App (`apps/events`)

| Path                | Page                                                                          |
| :------------------ | :---------------------------------------------------------------------------- |
| `/devfest`          | `DevfestAgendaRoute`: the agenda; `?day=2` opens on day 2 so it can be linked |
| `/devfest/speakers` | `DevfestSpeakersRoute`: the speaker directory                                 |

- `content/devfest.ts` holds the Figma copy: both days, all 29 people, and the "TBA" placeholders for topics not announced yet.
- The Navbar gets "DevFest" and "Speakers" before the Landing page links.
- The hero artwork comes from the Figma file and is self-hosted as `public/banners/devfest-2026.jpg`. It is not under `public/devfest/`, because a folder there would shadow the `/devfest` route on a static host.

### Deviations from Figma

- **The Room toggle filters**: the mobile frame shows a selected "Sala A" and still lists both rooms. We show only the selected room; otherwise the toggle would do nothing.
- **The hero caption and "Zarejestruj się"** show on both days and on phones. Figma draws them only in the Day 1 desktop frame. A hidden primary action on some screens would be worse.
- **The Format navigation stays as chips on phones**; Figma draws it as a stacked toggle there.
- **Abstract buttons only where there is an abstract**: Figma shows "Rozwiń abstrakt" on every card, including the TBA ones that have nothing to expand.
- **Navbar links**: Figma's DevFest header shows "Agenda, Speakers, Organizers, Q&A, About us". The shell keeps one site-wide Navbar (ADR-0023) with "DevFest" and "Speakers" added.
- **Michał Jabłoński's "GDG Warszawa"** sits in the Speaker card's blue line, which the model calls `talk`. The model has no affiliation field yet.

### Positive Consequences

- The whole DevFest page is live, and every Figma control works: day, format, track, room and role.
- `FilterChips` and the wrapping `SegmentedControl` are reusable outside DevFest.
- Content changes (announced topics, more trainers) touch only `content/devfest.ts`.

### Negative Consequences / Trade-offs

- Filter state is not in the URL, except the day. A shared link with a track filter opens unfiltered.
- The deviations above need designer confirmation.
- The hero is a 1300 × 731 JPEG, which is soft on large high-density screens. Ask for a 2× export or an SVG.

## Implementation Guidelines / Next Steps

- Replace the TBA talks, keynotes and free panel slots as they are announced; add the workshop agenda and trainers.
- Consider keeping track and room filters in query parameters.
- Add an affiliation field to `DevfestSpeaker` when more speakers have one.
