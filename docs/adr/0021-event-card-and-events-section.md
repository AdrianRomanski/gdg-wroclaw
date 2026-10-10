# ADR-0021: Event Card and the Events Section with Day Tabs

- **Status**: Accepted
- **Date**: 2026-10-10
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

This is part 2 of the Figma **Landing Page**: the events block (`Container`, `143:2918`). Part 1 was the Navbar and Footer ([ADR-0020](0020-navbar-footer-and-gdg-logo.md)). Part 3 is the page template.

- **Title**: "Event" (48px) and a description (18px), centered, max 768px, 80px above the content.
- **Content**: 950px wide.
  - Six date **filters** ("29.06" … "04.07"): 40px pills 4px apart in the Nav Button style, with the selected one on the active background.
  - 48px below, the **event cards**. Each card is a row with a 1px divider above it and 32px block padding, and one more divider closes the list.
    - On the left: the title (24px Bold), an optional **tag** next to it ("Sold out": 14px Bold on 50% brand blue), then the start time and location in brand blue (16px), separated by a bullet 8px apart, and 16px below them the description (16px).
    - On the right, 32px away: a 40px outlined "Read more" button.
- Figma shows the filters but not how they behave, and has no state for a day without events.

## Decision Drivers

- Reusable for any schedule. The data comes from the consumer (ADR-0013).
- Filters that are accessible and keyboard friendly.
- Reuse `Button` and the Nav Button styling tokens.

## Considered Options

- **Filters**:
  - WAI-ARIA tabs: one tab per day, controlling a single panel (chosen)
  - toggle buttons with `aria-pressed`
  - `gdg-nav-button` elements (they mark the current item with `aria-current="page"`, which is wrong for a filter)
- **Data shape**:
  - days that each hold their events (chosen)
  - a flat list of events with dates, grouped in the component, which would need date parsing and time zones in `ui`

## Decision Outcome

### `GdgEvent` and `EventCard` (`<gdg-event-card [event]>`)

```ts
interface GdgEvent {
  title: string;
  time?: string; // as shown, e.g. "18:00"
  dateTime?: string; // for <time datetime>, e.g. "2026-06-29T18:00"
  location?: string;
  description?: string;
  tag?: string; // e.g. "Sold out"
  href?: string; // shows "Read more"
}
```

- The title is an `<h3>`, below the section's `<h2>`.
- The time is a `<time>` element, and the bullet separator is `aria-hidden`. Missing parts are left out.
- "Read more" is a secondary blue `gdg-button` link, size `m`. Its `aria-describedby` points to the title, so screen readers hear which event it is for. The label can be translated with `readMoreLabel`.
- Typography:
  - title: `font.heading-4`
  - tag: `font.heading-8` on `color-mix(brand.blue.primary 50%, transparent)`
  - meta: `font.paragraph-7` in `brand.blue.primary` (4.5:1 on the background)
  - description: `font.paragraph-7`
- Below 40rem the button moves under the content.

### `EventsSection` (`<gdg-events-section [days] (dayChange)>`)

```ts
interface EventDay {
  label: string;
  ariaLabel?: string;
  events: GdgEvent[];
}
```

- Inputs:
  - `heading` (default "Event")
  - `description`
  - `days` (required)
  - `initialDay`
  - `filtersLabel` ("Event days")
  - `emptyText` ("No events on this day.")
  - `readMoreLabel`
- Output: `dayChange`, the index of the selected day.
- **Tabs**:
  - `role="tablist"` with one `role="tab"` button per day. `aria-selected` marks the selected day, and only that tab is in the tab order (`tabindex` 0, the others -1).
  - The arrow keys move between days (wrapping around), and Home and End jump to the first and last.
  - One `role="tabpanel"` is labelled by the selected tab.
  - `ariaLabel` gives a full date to screen readers when the label is short ("29.06" → "29 June 2026").
- Filter style: the Nav Button look (40px, 16px inline padding, fully rounded, `background.nav-button-hover` and `-active`), restyled on a native `<button>`.
- The selected day's events are a `<ul>` of `EventCard`s, with a divider closing the list. A day without events shows `emptyText` between dividers.
- Section paddings, `spacing.80` between the title and the content, and `spacing.48` between the filters and the list. Below 48rem: smaller paddings, `font.heading-1` for the title, and tighter gaps.

### Tokens

- `layout.max-width-xlarge` (950px), the width of the event list. It is not yet a Figma variable.

### Positive Consequences

- Any schedule renders without date logic in `ui`. The app formats the labels and times.
- The filters are fully keyboard and screen-reader accessible.

### Negative Consequences / Trade-offs

- The app groups the events by day before passing them in.
- The filter behavior, the empty state and the stacked phone card are not in Figma and need designer confirmation.
- `max-width-xlarge` exists only in code until it is added as a Figma variable.

## Implementation Guidelines / Next Steps

- The Landing page template: the Navbar, the hero, `EventsSection`, `TeamSection`, `PartnersSection` (carousel), `FaqSection` and the Footer.
- A `data-access` library that maps the events source to `EventDay[]`.
