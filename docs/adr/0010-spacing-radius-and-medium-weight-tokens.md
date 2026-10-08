# ADR-0010: Spacing, Radius and Medium Weight Tokens

- **Status**: Accepted
- **Date**: 2026-10-08
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

The Button component (ADR-0011) needs layout values that the token pipeline (ADR-0008) does not have yet:

- **Spacing.** Paddings and gaps use the Figma variables `spacing-8`, `spacing-12`, `spacing-16`, `spacing-20` and `spacing-24`.
- **Radius.** The pill shape is a 24px radius, which is the same visual result as the Figma `radius-full` variable.
- **Font weight.** Labels use **Google Sans Medium (500)**. Only `regular` (400) and `bold` (700) existed.

The Figma file defines more of these variables than the Button uses: `spacing-0/4/40/64` and `radius-12/40/full`. Page and section layouts use them. Without tokens, components would hard-code `rem` values, and those would drift from Figma.

---

## Decision Drivers

- **One source of truth.** Values come from the Figma variables, and their names are kept as metadata.
- **Complete scales.** Adding the whole scale now avoids a stream of one-token follow-ups.
- **Consistency with ADR-0008.** Use the same DTCG format, px authoring, rem output and drift test.

---

## Considered Options

1. **The full Figma spacing and radius scales, plus `font.weight.medium`**, with a Foundations docs page
2. **Only the values the Button uses**
3. **No tokens**: raw `rem` values in component CSS

---

## Decision Outcome

Chosen option: **the full Figma scales plus `font.weight.medium`**.

- `tokens/spacing.tokens.json`:
  - Tokens: `spacing.0, 4, 8, 12, 16, 20, 24, 40, 64` (`dimension`, authored in px).
  - Generated CSS: `--gdg-spacing-N` in `rem`.
  - Figma name in `$extensions["gdg.figma"].name` (`spacing-N`).
- `tokens/radius.tokens.json`:
  - Tokens: `radius.12`, `radius.40`, `radius.full` (9999px, for pills and circles).
  - Generated CSS: `--gdg-radius-*`.
- `typography.tokens.json`: adds `font.weight.medium` (500). The self-hosted Google Sans variable font already covers weights 400–700, so no new font files are needed.
- A new Storybook page, **Design System/Foundations/Spacing & Radius**, lists both scales. Its bars and swatches come from the generated `tokens` metadata.
- Not added yet: other Figma layout variables (`Container/*`, `Page Padding/*`, `Section Padding/*`, `Max Width/*`). They will be added with the first page layout that uses them.

### Positive Consequences

- Components and pages use Figma's spacing vocabulary (`var(--gdg-spacing-24)`).
- Every value is documented, typed (`TokenId`) and guarded by the drift test.

### Negative Consequences / Trade-offs

- `radius.full` is emitted as `624.9375rem`, because every dimension token is converted from px to rem. It renders the same as `9999px`.
- Some tokens (`spacing.0`, `radius.40`) have no users yet.

## Implementation Guidelines / Next Steps

- In component CSS, use `--gdg-spacing-*` and `--gdg-radius-*` instead of raw lengths.
- When Figma adds a spacing or radius variable, add it to the JSON and run `nx run shared-ui-tokens:generate-tokens`.
