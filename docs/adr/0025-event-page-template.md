# ADR-0025: Event Page Template, Section Components and Event Surface Tokens

- **Status**: Accepted
- **Date**: 2026-10-10
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

---

## Context and Problem Statement

The Figma file now has an **Event** page (`8925:1588`) with one frame, **DevFest • Event detail** (`8927:6018`, 1440 × 5702). It is an AI-generated design: the designer is unavailable for a long time (see the Landing page ADR, [ADR-0022](0022-landing-page-template.md)), so its open questions are decided by the team. From top to bottom:

1. **Shared navigation** (`8927:6019`): our Navbar ([ADR-0020](0020-navbar-footer-and-gdg-logo.md)).
2. **Event overview** (`8927:6046`): a breadcrumb back to all events; the hero (a label pill, a 72px two-line title, a summary, Primary and Secondary buttons with a note) next to a **community graphic** (code tile, wireframe globe, accent circles, the motto "Build. Share. Connect."); and three **essentials** (date, time, location) with icons, between dividers.
3. **Speakers and talks** (`8927:6097`): a section introduction (eyebrow, 48px heading, description), then each speaker as a Person card (`180:3087`, [ADR-0018](0018-person-card-and-team-section.md)) above a card with the talk.
4. **Event schedule** (`8927:6232`): the introduction with a timezone pill and a note, next to the agenda (start and length, title and details, a type pill that is blue for talks and workshops).
5. **Event location** (`8927:6314`): on a raised band, the venue photo next to the name, address, arrival instructions, access and travel notes, and a Secondary button.
6. **Event organizers** (`8927:6332`): the introduction, Person cards and a contact block.
7. **Event partners and sponsors** (`8927:6405`): groups ("Partners", "Sponsors") of Partner cards (`181:8570`, card variant, [ADR-0019](0019-partner-card-and-partners-section.md)) with each one's contribution.
8. **Registration callout** (`8927:6451`): a blue-tinted band with the invitation and a Primary button.
9. **Shared footer** (`8927:6460`): our Footer (ADR-0020).

It also contains sample disclaimers ("Sample event · GDG London", "Speaker names and sessions are illustrative…") that only make sense for the sample.

Unlike the rest of the file, the page is not built only from our tokens and text styles:

- Text is set in **Inter** at sizes outside our scale (12px body copy, a 26px motto, a 72px title).
- It uses four colors that are not in the Colors page palette: `#b6bcc5` (muted text), `#25272a` (raised surfaces), `#243653` (blue-tinted surfaces) and `#56585c` (subtle dividers).
- Its icons (`calendar-days`, `clock`, `map-pin`, `arrow-left`, `accessibility`, `train-front`) are from another icon set.

The first real event, the AI & Cloud Stream Meetup, was shown with the Workshop page template ([ADR-0017](0017-workshop-page-template.md)) at `/workshops/ai-cloud-stream-meetup`, which has no RSVP button, schedule or venue.

## Decision Drivers

- One presentational template that the app feeds with data (ADR-0013), like `WorkshopPage` and `LandingPage`.
- Reuse the Person card, Partner card, Button and Icon instead of rebuilding them.
- Stay inside the design system: Google Sans, Phosphor icons, semantic tokens.
- A page must work before all its content exists (no speakers or venue yet).
- Keep each component's styles under the 4 kB budget (`anyComponentStyle`).
- Keep links that are already shared working.

## Considered Options

### Structure

1. **One `EventPage` component** with every section in its template and stylesheet.
2. **One component per section**, composed by `EventPage`, with a shared `SectionIntro`.

### Off-system typography and colors

1. **Copy Figma literally**: Inter, the hex colors and pixel sizes in component CSS.
2. **Map to the design system**: Google Sans text styles, the closest type tokens, new **semantic color tokens** for the four colors.

### Icons

1. Add the Figma icon set.
2. Use the **Phosphor** equivalents from our registry (ADR-0011).

### URL of the meetup

1. Keep it under `/workshops/`.
2. Move it to **`/events/:slug`** and redirect the old URL.

## Decision Outcome

Chosen: **one component per section**, **map to the design system** with four new semantic tokens, **Phosphor icons**, and **`/events/:slug` with a redirect**.

### Components (`libs/ui`)

| Component           | Figma                                     | Notes                                                                                                                           |
| :------------------ | :---------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `EventPage`         | `8927:6018`                               | Takes an `EventDetail`; sections without data are left out. Section anchors in `EVENT_SECTION_IDS` (`#schedule`, `#register`…). |
| `EventOverview`     | `8927:6046`                               | Breadcrumb (`nav` + `ol`, `aria-current="page"`), `<h1>` title with an optional tagline line, essentials as a `<dl>`.           |
| `EventGraphic`      | `8927:6067`                               | Decorative (`aria-hidden`). The Figma SVG shapes inlined; scales as one piece with container units at 536 : 400.                |
| `EventSpeakers`     | `8927:6097`                               | `PersonCard` per speaker and a talk card (`<h4>` title); the talk cards line up even when profiles differ in height.            |
| `EventSchedule`     | `8927:6232`                               | Agenda as an `<ol>`; `<time datetime>`; `highlight` turns the type pill blue.                                                   |
| `EventVenue`        | `8927:6314`                               | Without a photo the details take the full width.                                                                                |
| `EventOrganizers`   | `8927:6332`                               | `PersonCard`s; the contact block sits beside them, or below once the cards fill the row.                                        |
| `EventSupporters`   | `8927:6405`                               | `PartnerCard` (card variant), up to 292px wide, with the contribution below.                                                    |
| `EventRegistration` | `8927:6451`                               | Blue-tinted band with the RSVP button.                                                                                          |
| `SectionIntro`      | `Section introduction` (e.g. `8927:6098`) | Eyebrow (upper case), `<h2>` (Display 1) and description (P6); used by five sections.                                           |

Every section is a `<section>` labelled by its `<h2>`. The Navbar and Footer stay in the app shell; the Figma Navbar's five links and the Footer's legal links are content decisions for the shell, not part of this template.

### Typography mapping (Inter → Google Sans tokens)

| Figma (Inter)              | Ours                                                                           |
| :------------------------- | :----------------------------------------------------------------------------- |
| Title 72px bold, 1.08      | `700 4.5rem/1.08` built from the family and weight tokens; Display 1 on phones |
| Section headings 48px bold | Display 1 (48px, 1.2)                                                          |
| Descriptions 18px, 1.5     | P6 (18px)                                                                      |
| Eyebrows 14px              | P8 (14px)                                                                      |
| Body copy 12px             | P9 (12px), line height 1.5 for paragraphs                                      |
| Motto 26px, `{ }` 105px    | Google Sans at the Figma sizes, scaled with the graphic                        |

The 12px body copy is kept as designed. It is small for paragraphs; if it reads poorly on real devices, raise it to P8 in one place per component.

### New color tokens

| Semantic token            | Primitive            | Use                                                   | Contrast                                                                |
| :------------------------ | :------------------- | :---------------------------------------------------- | :---------------------------------------------------------------------- |
| `content.muted`           | `gray-300` `#b6bcc5` | Descriptions, details, notes                          | 8.7:1 on the default background, 7.8:1 on raised, 6.4:1 on brand-subtle |
| `background.raised`       | `gray-850` `#25272a` | Talk cards, pills, the venue band                     | Default content 13.1:1                                                  |
| `background.brand-subtle` | `navy-800` `#243653` | Label pill, highlighted type pills, registration band | Default content 10.7:1; Halftone Blue 6.5:1                             |
| `border.subtle`           | `gray-600` `#56585c` | Dividers                                              | Decorative (2.3:1), not a control boundary                              |

All text pairs pass WCAG AA. The primitives record their source as the Event page, since they are not on the Colors page; if the designer adds them there, update the Figma metadata.

### Icons

`arrow-left`, `calendar-dots`, `clock`, `map-pin`, `wheelchair` and `train` are added to the Phosphor registry. Shapes differ slightly from the Figma icons; sizes (24px, 18px for the breadcrumb) and colors (Halftone Blue) follow Figma.

### Deviations from Figma

- **Partner tiles stay light** (ADR-0019) so real logos read well; the Figma sample tiles are dark.
- **Sample disclaimers** are not part of the template; a page can add notes in its own copy (e.g. `actionNote`).
- **No venue photo** for the meetup: the venue section shows the details at full width.

### App (`apps/events`)

- `content/events.ts` holds the AI & Cloud Stream Meetup as an `EventDetail`, from its gdg.community.dev page: date, time, agenda, speakers and talks, the venue with a Google Maps link, the four organizers, Capgemini as Main sponsor and venue host (its logo from capgemini.com, self-hosted in `public/partners`), and RSVP buttons.
- `/events/:slug` renders `EventPage`, or Not found. `/workshops/ai-cloud-stream-meetup` redirects there, because that URL was already live; the landing event card links to the new URL.
- The Workshop route and template stay for workshops; `WORKSHOPS` is empty for now.

### Positive Consequences

- Events get a real page with RSVP, schedule and venue, built from existing cards and buttons.
- Each section is usable on its own, and each stylesheet stays under the style budget.
- The four new semantic tokens are available to other pages instead of hex values in components.

### Negative Consequences / Trade-offs

- The page looks close to Figma but not identical: Google Sans instead of Inter, Phosphor instead of the Figma icons, light partner tiles.
- The 72px title is the only text size built outside the text styles.
- Ten new components to maintain; a change to the section introduction touches five sections.
