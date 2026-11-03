# ADR-0034: Whole Photos and Bios on DevFest Sessions

- **Status**: Accepted
- **Date**: 2026-11-03
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group
- **Informed**: All project contributors

## Context and Problem Statement

Reviewing the DevFest agenda after ADR-0033, the core team asked for three things:

- The panel host should be as large as the panelists (the host was an L avatar, the panelists XL).
- The circle crops the speakers' photos (faces, hair and shoulders are cut away); show the whole picture for everyone, the keynote speakers included, at the same size.
- A "see bio" button for the people on the panels and keynotes; when someone has no bio yet, the button stays and says the bio is coming soon.
- Beside the host, a description of the panel: what it is about and what will be discussed, grounded in what is new in each area.
- The DevFest pages in English, like the rest of the site (they were in Polish).

The bios already exist for the speaker directory (ADR-0030), behind a disclosure in the Speaker card. We have no designer available, so we decide this ourselves within the design system.

## Decision Drivers

- The same face size for the host, the panelists and the keynote speakers.
- Photos shown whole (they are square, 400px, ADR-0033).
- Every person gets the same bio button, whether or not the bio is written yet.
- Accessible: keyboard, screen readers, focus handling.

## Considered Options

- **Photos**: an Avatar `shape="square"` (rounded square) vs. `object-fit: contain` inside the circle (letterboxed) vs. CSS overrides in `libs/ui`.
- **Bios**: a modal dialog per person vs. an inline disclosure under each name, as in the Speaker card.

## Decision Outcome

Chosen options: a square Avatar shape and a modal bio dialog.

- **Avatar** (`libs/design-system/components`): `shape` is `circle` (default, Figma) or `square`, a rounded square (8 / 12 / 16 / 16px radius for S / M / L / XL) that shows the whole square photo. Sizes, rings and the initials fallback are unchanged.
- **PersonBio** (`libs/ui`, new): a "Show bio" secondary M button (the track color, or white `onBrand` on the Keynote card) that opens a native modal `<dialog>` named by the person (`<h2>`): the L square photo, the bio paragraphs, and "Close". Without a bio it says "Bio coming soon." Escape, the close button or a backdrop click closes it, and the browser returns focus to the button. A modal keeps the five-column panel even, where an inline disclosure would stretch one column.
- **SessionPerson** gets the optional `bio` (moved up from `DevfestSpeaker`); the events app fills it for every person from `DEVFEST_BIOS`.
- **Discussion panel**: the host is a `Panelist` like the others, XL and one panelist column wide (at most 224px), so host and panelists are the same size; everyone has a square photo and a bio button.
- **Panel description**: `DevfestPanel` gets an optional `description` and `topics`; the Discussion panel shows them beside the host, after the host tag, with a "What we will talk about" list marked by track-colored dashes. The events app keeps the copy in `devfest-panels.ts` (in English), written around the panelists' work and the 2026 news in each area (as of 2026-11-03): Angular 22 Signal Forms and the WebMCP origin trial in Chrome (Web); Cloud Run, GKE Agent Sandbox and Agent Compute Engine, agent IAM and FinOps (Cloud); Gemini Nano 4 in the AICore preview, AppFunctions, Flutter vs. Compose Multiplatform and Genkit Dart 1.0 (Mobile); agentic engineering, evaluations, MCP / A2A / WebMCP and the AI Act (AI).
- **English DevFest pages**: the agenda and speaker directory copy in the events app and the Polish defaults of the DevFest components in `libs/ui` (bio, abstract and filter labels, "Host", "Panelists / N people", track and room names) are translated to English, so the whole site speaks one language. Roles lose the Polish gendered forms ("Panelist · Web panel", "Speaker · AI talk", "Trainer · Cloud workshop"). People's and places' names stay as they are.
- **Keynote card**: the speaker's XL square photo is as wide as a panelist column of a five-person panel (two columns on mobile), with the name and the bio button beside it.

### Positive Consequences

- Faces are not cropped, and the host, panelists and keynote speakers read at the same size.
- Bios are reachable from the agenda, not only from the speaker directory.
- Missing bios are visible as "coming soon" rather than a missing button.

### Negative Consequences

- The square shape is not in the Figma Avatar (9024:27), and the bio dialog is not in Figma.
- Presentation cards and Speaker cards keep round avatars for now, so the agenda mixes both shapes.
- The keynote photo width assumes a five-person panel of the same width.

## Implementation Guidelines / Next Steps

- Add the square shape and the bio dialog to Figma when a designer is available.
- Decide whether the Presentation and Speaker cards switch to square photos too.
- Have each panel's host review the description and topics before the event, and refresh them if news lands before 13 November.
