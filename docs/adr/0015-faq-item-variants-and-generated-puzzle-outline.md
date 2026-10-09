# ADR-0015: FAQ Item Variants and a Generated Puzzle Outline

- **Status**: Accepted
- **Date**: 2026-10-09
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

The Figma **FAQs** page holds an FAQ item component set (`Component 9`, node `181:6547`). It has two properties:

- `Border puzzle`:
  - `True`: a puzzle-piece outline, with a slot cut into the top edge, a tab hanging from the bottom edge and a notch in the left edge.
  - `False`: a plain 2px stroke with the 16px radius.
- `Color`: Blue, Green, Yellow or Red, drawn in the brand secondary (halftone) shades.

Two `FAQ / 11 /` sections use them: `181:6549` with puzzle items and `181:6770` with plain items. Each section has a title ("FAQs", a description and an "Ask a question" button) to the left of the questions. Puzzle items overlap by 8px, so each tab nests into the next item's slot.

Figma exports the puzzle outline as one fixed-size SVG (667 × 228). Real FAQ items vary in height (answer length, open or closed) and in width (viewport). A stretched SVG would distort the corners, the slot and the notch. Figma also shows every item expanded with a close icon, but defines no collapsed state.

## Decision Drivers

- Both Figma variants, in all four colors, at any content size.
- ADR-0013 layers: an FAQ item is composed product UI, so it lives in `ui` (the library's README already lists it).
- Native, accessible disclosure behavior.
- Tokens over raw values (ADR-0008, ADR-0010).

## Considered Options

- **Puzzle outline**:
  - a path generated from the item's measured size (chosen)
  - the Figma SVG stretched with `preserveAspectRatio="none"`
  - a 9-slice `border-image`
  - `clip-path` or `mask` (these can clip but cannot draw a stroke)
- **Disclosure**:
  - native `<details>` / `<summary>` (chosen)
  - a custom button with `aria-expanded`
  - always expanded, as in Figma

## Decision Outcome

### `FaqItem` (`ui`, `<gdg-faq-item>`)

- Inputs:
  - `question` (required)
  - `variant: 'puzzle' | 'plain'` (default `puzzle`)
  - `color: 'blue' | 'green' | 'yellow' | 'red'` (default `green`)
  - `open` (initial state)
- The answer is projected content.
- **Plain** is a 2px `--_stroke` border with `--gdg-radius-16`.
- **Puzzle** is an absolutely positioned SVG path from `puzzleOutline(width, height)` (`puzzle-outline.ts`):
  - A `ResizeObserver` (started in `afterNextRender`, so it is SSR-safe) feeds the item's size into a signal, and the path is a `computed`.
  - Depths and radii stay fixed: a 28px slot and tab, a 24px notch, 12px convex corners and 8px concave corners.
  - The slot and tab positions scale with the width. The notch scales with the body height and is dropped when it no longer fits.
  - The positions are fractions measured on the Figma artwork. Unit tests cover the geometry.
- **Disclosure** uses native `<details>`, so keyboard support, focus and the expanded state are announced by the browser.
  - The question is the `<summary>`. The default marker is hidden, and the Phosphor `x` icon is shown rotated 45° (a plus) while closed and unrotated (Figma's close icon) when open.
  - Phosphor `x` is added to the icon registry.
- Typography: the question uses `font.heading-6` (Figma H6) and the answer `font.paragraph-7` (P7). Padding is 20px block and 24px inline, as in Figma.

### `FaqSection` (`ui`, `<gdg-faq-section>`)

- Inputs:
  - `heading` (default "FAQs")
  - `description`
  - `entries: FaqEntry[]` (`{ question, answer, open? }`)
  - `variant`
  - `color`
  - `askHref` (the link is hidden without it)
  - `askLabel`
- Layout:
  - Section paddings and the 1280px container (ADR-0014).
  - Figma's 500px and 763px columns become a 2 : 3 grid with a 64px gap (Figma uses a raw 60px).
  - The layout stacks into one column below 64rem, with smaller paddings below 48rem.
  - Puzzle items overlap by 8px; plain items sit 12px apart.
- "Ask a question" is a `gdg-button` link in the section color. Its text is black, not Figma's white (ADR-0012).

### Tokens

- `radius.16` (Figma variable `radius-16`).
- `spacing.32`, the gap between the title block and the button. It is not yet a Figma variable.

### Positive Consequences

- One component covers all eight Figma variants and any answer length or viewport width.
- The puzzle shape stays sharp: no stretching, and a constant 2px stroke.
- Accessible disclosure without custom ARIA state.

### Negative Consequences / Trade-offs

- The puzzle outline is drawn after first render, because it needs measuring. Server-rendered HTML shows the content without the outline until hydration.
- The outline geometry lives in code. If the designers change the Figma shape, update the constants in `puzzle-outline.ts`.
- The collapsed state, plus icon and responsive layout are not in Figma and need designer confirmation.

## Pros and Cons of the Options

### Generated path

- Good, because it gives exact corners at any size and the stroke follows design-token colors.
- Bad, because it needs a `ResizeObserver` and a small amount of geometry code.

### Stretched Figma SVG

- Good, because it has no code.
- Bad, because the corners, slot and notch distort as soon as the height changes.

### `border-image` 9-slice

- Good, because it is pure CSS.
- Bad, because the slot and tab sit in the stretched middle of the edges, so they distort horizontally.

## Implementation Guidelines / Next Steps

- The puzzle outline can move to `design-system-components` if Team or Partner cards adopt the same shape.
- Ask the designers to confirm the collapsed state, the plus/close toggle and the stacked mobile layout, and to add `spacing-32` as a Figma variable.
