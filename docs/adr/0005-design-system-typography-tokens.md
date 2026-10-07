# ADR-0005: Typography Tokens with Self-hosted Google Sans

- **Status**: Accepted
- **Date**: 2026-10-07
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

After colors (ADR-0003) and Storybook (ADR-0004), the next design-system foundation is typography. The Figma **Typography** page (node `1:147`) contains:

1. **Google Sans / Google Sans Mono frames**: the GDG brand type system. One 9-step scale shared by all styles:

   | Step | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   |
   | :--- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
   | Size | 36  | 32  | 28  | 24  | 20  | 18  | 16  | 14  | 12  |
   | LH   | 46  | 42  | 38  | 34  | 30  | 28  | 26  | 24  | 16  |

   Styles: Headings Bold and Regular (Google Sans), Paragraphs Regular (Google Sans), Mono Regular and Bold (Google Sans Mono).

2. **A Roboto "Typography" frame** (H1–H6 at 56/48/40/32/24/20 plus Text Large…Tiny) built from a third-party template (it still contains a "Company Logo" placeholder).

We need to decide which system is authoritative, how fonts are loaded, and how typography tokens are exposed.

---

## Decision Drivers

- **Brand consistency**: GDG materials use Google Sans.
- **Privacy (GDPR)**: the site serves an EU community; loading fonts from Google's CDN transmits visitor IP addresses to a third party.
- **Performance**: avoid a third-party connection on first paint; load only the glyph subsets a page needs.
- **Ergonomics**: applying a text style should be one declaration, not four.
- **Consistency with ADR-0003**: CSS custom properties in `@org/shared-ui-tokens`, mirrored in TypeScript and verified by tests.

---

## Considered Options

### Source of truth

1. **Google Sans frames**
2. **Roboto frame**

### Font loading

A. **Self-host via Fontsource npm packages** (`@fontsource-variable/google-sans`, `@fontsource-variable/google-sans-code`)
B. **Google Fonts CDN** (`<link href="https://fonts.googleapis.com/...">`)

### Token shape

X. **Primitives + `font` shorthand tokens per text style**
Y. **Primitives only**
Z. **Utility classes** (e.g. `.gdg-heading-1`)

---

## Decision Outcome

Chosen options: **Google Sans frames**, **self-hosted Fontsource variable fonts**, and **primitives plus `font` shorthand tokens**.

- Fonts: `@fontsource-variable/google-sans` and `@fontsource-variable/google-sans-code` (OFL-1.1), imported by `libs/shared/ui-tokens/src/styles/typography.css`. Variable fonts cover every weight in one file per subset, and `unicode-range` makes browsers download only the subsets in use (Latin and Latin Extended for Polish).
- **Google Sans Mono** (used in Figma) is not publicly distributed. **Google Sans Code**, its open-source counterpart, is used instead, with `'Google Sans Mono'` kept in the font stack for machines that have it installed.
- Primitive tokens: `--gdg-font-family-sans|mono`, `--gdg-font-weight-regular|bold`, `--gdg-font-size-1…9`, `--gdg-line-height-1…9` (in `rem`, 16px root, so text respects user font-size settings).
- 45 text-style tokens, each a complete `font` shorthand: `--gdg-font-heading-{1…9}` (bold), `--gdg-font-heading-{1…9}-regular`, `--gdg-font-paragraph-{1…9}`, `--gdg-font-mono-{1…9}`, `--gdg-font-mono-{1…9}-bold`. Usage: `font: var(--gdg-font-heading-3);`.
- TypeScript mirror (`fontFamilies`, `fontWeights`, `typeScale`, `textStyles`, `fontVar()`) with a unit test that regenerates the expected CSS tokens from it and compares them with `typography.css`.
- The `events` app sets `body { font: var(--gdg-font-paragraph-7); }` (16/26) as the default text style.
- Storybook gets a **Design System/Foundations/Typography** docs page rendering every style.

### Positive Consequences

- Brand-correct typography everywhere, with one declaration per text style.
- No third-party font requests: GDPR-friendly and no extra connection on first paint.
- Fonts are versioned with the code and available offline in Storybook and tests.

### Negative Consequences / Trade-offs

- The mono font differs slightly from Figma (Google Sans Code vs Google Sans Mono).
  - _Mitigation_: designers are informed; the Figma file can switch to Google Sans Code.
- The Google Sans package is large on disk (~14 MB, all scripts); only used subsets are downloaded by browsers, but all subset files are copied into the build output.
- Figma has one inconsistency: the variable `Headings Bold/H1` has line height `100` while the documented spec says 36/46. The documented spec is used.
- The Roboto frame is not implemented.
  - _Mitigation_: if designers intend it for some screens, it will be added in a follow-up ADR. Ideally the frame is removed from the Figma file to avoid confusion.

---

## Pros and Cons of the Options

### Google Sans frames

- **Good**, because they match GDG branding and define a complete scale including mono.
- **Bad**, because the mono font is not publicly available.

### Roboto frame

- **Good**, because Roboto is freely available, and the frame defines Figma variables.
- **Bad**, because it comes from a generic template and does not match GDG branding.

### Self-hosting via Fontsource

- **Good**, because there are no third-party requests, it is versioned via npm, and it works offline.
- **Bad**, because it adds dependencies and build assets.

### Google Fonts CDN

- **Good**, because it needs no dependencies and Google's cache may be shared across sites.
- **Bad**, because it sends visitor IPs to Google (EU courts have ruled this a GDPR violation without consent), and browsers no longer share caches across sites.

### Primitives + `font` shorthand tokens

- **Good**, because one declaration applies a full style, while primitives remain for one-offs.
- **Bad**, because there are 45 composite tokens (generated and verified by tests).

### Primitives only

- **Good**, because there are fewer tokens.
- **Bad**, because every usage needs four declarations, which invites drift.

### Utility classes

- **Good**, because they are easy to apply in templates.
- **Bad**, because they do not work inside component styles without `@extend`/mixins, and they couple markup to styling.

---

## Implementation Guidelines / Next Steps

1. Apply text styles with `font: var(--gdg-font-…)`; never hard-code font sizes or families.
2. When Figma typography changes, update `typography.ts` first, then `typography.css`; the unit test enforces they match.
3. Responsive typography (mobile scale) is not defined in Figma yet; add it when designs specify it.
4. Next: Button / Nav Button components in `libs/shared/ui`, using these tokens and Figma's semantic color variables (`Content`, `Content-Disabled`, `Brand-*-Primary|Secondary`).
