# ADR-0028: DevFest Components: Tag, Avatar, Segmented Control and the Session Cards

- **Status**: Accepted
- **Date**: 2026-11-02
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

---

## Context and Problem Statement

The Figma file has a new **DevFest components** page (`9024:2`) with 14 component sets for the DevFest conference site. Like the Event page ([ADR-0025](0025-event-page-template.md)), it is AI-generated: the designer is away long term, so the team settles its open questions. The components are:

| Figma component           | Node                   | What it is                                                                               |
| :------------------------ | :--------------------- | :--------------------------------------------------------------------------------------- |
| Tag                       | `9024:20`              | Pill with a track dot (AI, Web, Mobile, Cloud, Robotyka) or none (Neutral: rooms, times) |
| Avatar                    | `9024:27`              | Initials in a circle: S 40px, M 64px, L 112px                                            |
| Time marker               | `9024:28`              | Agenda time slot with a connector line                                                   |
| Presentation card         | `9025:192`             | A talk: track × abstract collapsed/expanded                                              |
| Schedule event            | `9027:147`             | Agenda entry for all rooms: Shared (opening) or Break, desktop and mobile                |
| Toggle                    | `9037:1840`            | Two options sharing the full width (e.g. Day 1 / Day 2)                                  |
| Segment                   | `9040:251`             | One option of a multi-option switcher (e.g. All / Keynote / Hosts)                       |
| Speaker card              | `9040:373`             | Speaker directory card, per track                                                        |
| Keynote card              | `9040:511`             | A keynote on brand blue                                                                  |
| Panelist                  | `9041:272`             | Avatar and name, stacked or inline                                                       |
| Discussion panel          | `9041:602`             | A panel: tags, title, host and panelists, per track, desktop and mobile                  |
| Section heading           | `9041:607`             | Centered overline, title and description, desktop and mobile                             |
| Site header / Site footer | `9041:646`, `9041:676` | "As on the Landing Page": logo, navigation, Register / Contact us; socials, legal links  |

The page binds Figma variables we already have, plus two we do not: `color/background/card` (`#303030`) and `color/brand/yellow/secondary-subtle` (`#ffd42726`). Its icons (flag, utensils) come from another icon set. The time and room on a Presentation card are brand blue primary on the card surface, which is only 3.7:1.

## Decision Drivers

- Respect the layering of [ADR-0013](0013-design-system-and-ui-library-architecture.md): generic primitives in `design-system-components`, GDG/DevFest content in `ui`.
- Reuse what exists: `Button`, `Icon`, `Navbar`, `Footer`, the `initials()` helper.
- Tokens only (no raw hex in component CSS), Phosphor icons (ADR-0011), WCAG AA text contrast.
- One component that adapts to its width instead of separate Desktop and Mobile components.

## Considered Options

1. **Copy each Figma component set 1:1 into `ui`**, including Desktop and Mobile variants as inputs and Site header/footer as new components.
2. **Primitives in the design system, session cards in `ui`, responsive layouts, and reuse of Navbar/Footer** for Site header/footer.

## Decision Outcome

Chosen option 2.

### Design-system primitives (`libs/design-system/components`)

- **`Accent`**: `'red' | 'yellow' | 'green' | 'blue' | 'contrast'`. The design system knows colors, not tracks.
- **`Tag`** (`<gdg-tag accent="red">AI</gdg-tag>`): an optional decorative dot. No accent means the Neutral tag.
- **`Avatar`** (`<gdg-avatar initials="OT" size="m" accent="red" />`): an accent draws the 1.5px track ring. Decorative (`aria-hidden`) unless given a `label`.
- **`SegmentedControl`** (`<gdg-segmented-control label="Dzień" [options] [(value)] fullWidth />`): covers both **Toggle** (`fullWidth`) and **Segment**.
  - It is a WAI-ARIA radio group: one tab stop, the arrow keys (wrapping) and Home/End move and select.
  - It is not built on `NavButton`, because that marks the current page with `aria-current`.

### DevFest components (`libs/ui`)

- **Shared model** (`devfest-session.ts`):
  - `Track` (`ai | web | mobile | cloud | robotics | generic`) and `SessionPerson` (name, optional initials).
  - `DevfestTalk`, `DevfestKeynote`, `DevfestPanel`, `DevfestSpeaker`, `DevfestScheduleItem`.
  - The maps `TRACK_LABELS`, `TRACK_ACCENTS` and `TRACK_BUTTON_COLORS`.
  - Initials come from the name unless given.
- **Track colors**: AI red, Web yellow, Mobile green, Cloud blue and Robotyka the default content color (off-white). **Generic** uses the subtle border, has no dot or ring, and shows no tag unless the session has a `trackLabel`. Figma draws the Generic ring almost black; we use the subtle border, which stays visible.
- **Buttons**: the abstract button is our `Button` (secondary, size `m`) in the track color, and brand blue for Robotyka and Generic, as in Figma.
- **`PresentationCard`**:
  - The abstract is a disclosure: `aria-expanded` and `aria-controls`, with a two-way `expanded`.
  - The labels default to the Figma copy ("Rozwiń abstrakt", "Zwiń abstrakt", "Abstrakt") and can be overridden.
  - Speakers are a list, so a talk can have several.
- **`SpeakerCard`, `KeynoteCard`, `Panelist`, `DiscussionPanel`, `ScheduleEvent`, `TimeMarker`, `SectionHeading`**: card titles are `<h3>` and the section heading is an `<h2>`. Times are `<time datetime>`, and separators and connectors are `aria-hidden`.
- **Discussion panel**: the panelist list is labelled by "Paneliści / N osób", with the Polish plural (`defaultPanelistsLabel`), and the label can be overridden.
- **Responsive instead of `Layout`/`Size` variants**:
  - `ScheduleEvent` (40rem), `DiscussionPanel` (48rem) and `KeynoteCard` (40rem) switch on **container queries**, so they adapt to the column they sit in.
  - `SectionHeading` switches on a 48rem media query, like `SectionIntro`.
  - The Keynote card has no mobile design in Figma; ours uses 20px padding and a Heading 3 title.
- **`SectionHeading` vs `SectionIntro`**: the DevFest heading is centered with a yellow overline and a description that is not muted, so it is a separate component rather than a variant of the start-aligned Event-page intro.
- **Site header / Site footer**: Figma describes them as the Landing-page header and footer, so they map to the existing **`Navbar`** and **`Footer`** (ADR-0020) and no new components are added. On mobile Figma shows the links wrapped; we keep the Navbar's disclosure menu from ADR-0020.

### Tokens

- New primitives:
  - `color.gray-800` (`#303030`)
  - `color.halftone-yellow-alpha-15` (`#ffd42726`)
- New semantic tokens, named after the Figma variables:
  - `color.background.card`: default content 11.6:1, muted 6.9:1.
  - `color.brand.yellow.secondary-subtle`: brand yellow on it 5.9:1.
- Both are code-only in the light theme, like `background.raised` ([ADR-0027](0027-light-theme-from-figma-light-mode.md)).
- **Contrast deviation**: the Presentation card's time and room use `brand.blue.secondary` (7.1:1 on the card) instead of Figma's brand blue primary (3.7:1).

### Icons

The Phosphor `flag` and `fork-knife` stand in for the Figma flag and utensils icons in `ScheduleEvent`.

### Positive Consequences

- The three primitives are reusable outside DevFest, for example as day filters.
- Every DevFest component has stories for its Figma variants, unit tests and Storybook smoke tests.
- Track colors live in one place: the TS maps, plus `track.css` for borders and rules.

### Negative Consequences / Trade-offs

- The decisions on Generic colors, the Keynote narrow layout, the Robotyka ring, the blue meta text and the Navbar's mobile menu need designer confirmation.
- `background.card` and `brand.yellow.secondary-subtle` have no light-theme values yet.
- Avatars show initials only. Photos will need an `src` input later.

## Implementation Guidelines / Next Steps

- An agenda section composing `SegmentedControl` (days), `TimeMarker`, `ScheduleEvent`, `PresentationCard`, `KeynoteCard` and `DiscussionPanel`.
- A speakers section with `SpeakerCard` and a `SegmentedControl` filter.
- Add the two new colors as Figma variables to the GDG-ds library so the token sync (ADR-0026) covers them.
