# ADR-0008: Design Tokens Pipeline (W3C DTCG + Style Dictionary) with Semantic Tokens

- **Status**: Accepted (supersedes the token representation of ADR-0003 and ADR-0005)
- **Date**: 2026-10-07
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Frontend Working Group, Designers
- **Informed**: All project contributors

---

## Context and Problem Statement

ADR-0003 (colors) and ADR-0005 (typography) defined tokens **twice by hand**: once in CSS and once in TypeScript, kept in sync by tests. That approach has four problems:

- It does not scale to more foundations (spacing, radii, motion, …) or themes.
- It has no place for metadata, such as the Figma name, Figma node, or the role of a token.
- It only has palette tokens. Figma's variables already define **semantic** roles: `Content/Content`, `Content/Content-Disabled`, `Border/Border-Disabled`, `Background/Background-Disabled`, and `Colors/Brand-*-Primary|Secondary`. The designs also show the product is **dark** by default, with Black 02 surfaces and OFF White content.
- Figma sync and theming need one machine-readable source of truth.

---

## Decision Drivers

- **One source of truth**, readable by tools (Figma plugins, Style Dictionary, docs).
- An **industry standard format** rather than a custom one.
- **Semantic tokens** so components express intent (`content-default`), not palette values.
- **Stable public CSS names**, so existing consumers do not break.
- **Generated code that cannot drift** from the source.

---

## Considered Options

1. **W3C Design Tokens (DTCG) JSON + Style Dictionary 5**, with outputs committed and a drift test
2. **Hand-written CSS + TypeScript** (status quo)
3. **Tokens Studio JSON format + Style Dictionary**
4. **DTCG + Style Dictionary, with outputs generated at build time only (not committed)**

---

## Decision Outcome

Chosen option: **W3C DTCG JSON + Style Dictionary 5, with committed outputs and a drift test**.

- **Sources** (`libs/shared/ui-tokens/tokens/`), in the [DTCG format](https://www.designtokens.org/) (`$value`, `$type`, `$description`, `$extensions`):
  - `color/primitive.tokens.json`: the 20 palette colors. Each records its Figma name, group and node in `$extensions["gdg.figma"]`.
  - `color/semantic.tokens.json`: aliases of palette tokens:
    - `color.background.default` → Black 02
    - `color.background.disabled` → OFF White 20%
    - `color.content.default` → OFF White
    - `color.content.disabled` → OFF White 40%
    - `color.border.disabled` → OFF White 40%
    - `color.brand.{blue|green|yellow|red}.primary` → core color (resting state)
    - `color.brand.{…}.secondary` → halftone (hover state)

    The names follow Figma's variables. **Dark is the default and only theme for now.**

  - `typography.tokens.json`: font families, weights, the 9-step size and line-height scale (authored in px), and 45 `typography` composite tokens.
- **Build**: `libs/shared/ui-tokens/tools/build-tokens.ts` (Style Dictionary 5, `usesDtcg`, `prefix: gdg`) generates:
  - `src/generated/tokens.css`: CSS custom properties on `:root`. Semantic tokens keep **live references** (`--gdg-color-content-default: var(--gdg-color-off-white)`), so a future theme only overrides the semantic layer. px dimensions become `rem`, and typography composites become `font` shorthands.
  - `src/generated/tokens.ts`: `tokens` metadata typed `as const` (`id`, `cssVariable`, `type`, `value`, `aliasOf`, `parts`, `description`, `figma`), plus `TokenId` and `Token` types. Helpers `cssVar(id)` and `remToPx(value)` live in `src/lib/css-var.ts`.
- `npx nx run shared-ui-tokens:generate-tokens` regenerates the outputs. Generated files are committed (consumers and the Storybook dev server import them as plain source) and excluded from Prettier. A unit test rebuilds the tokens into a temporary directory and fails if the committed files differ.
- **All 87 existing CSS custom properties keep their names.** 13 semantic properties are added.
- The **TypeScript API changes**: `colors`, `colorVar`, `fontFamilies`, `fontWeights`, `typeScale`, `textStyles` and `fontVar` are replaced by `tokens`, `cssVar` and `remToPx`. The only consumers were the Storybook docs pages, which are updated. The Colors page now shows Figma names and a semantic section.
- New dev dependency: `style-dictionary` (~5.6). The build script is TypeScript run directly by Node (type stripping, Node ≥ 22.18; CI uses Node 24).

### Positive Consequences

- One source of truth in a standard format; Figma names and nodes are kept with each token.
- Semantic layer ready for components (buttons use `brand-*-primary|secondary`, `content-disabled`, …) and for future themes.
- Adding a foundation means adding JSON, not writing CSS and TypeScript by hand.
- Outputs can never silently drift from the source.

### Negative Consequences / Trade-offs

- A build step: contributors must run `generate-tokens` after editing JSON (the test tells them).
- Generated files are committed, so diffs show both source and output.
- Typography composites are resolved, not live references, so overriding `--gdg-font-size-1` does not change `--gdg-font-heading-1`.
- The Storybook dev server must be restarted after new TypeScript files are added (its TypeScript program is created at startup).

---

## Pros and Cons of the Options

### DTCG + Style Dictionary, committed outputs

- **Good**, because it is a standard format, with tooling, metadata and themes.
- **Good**, because consumers import plain files and need no build ordering.
- **Bad**, because generated files live in the repository.

### Hand-written CSS + TypeScript

- **Good**, because it needs no tooling.
- **Bad**, because values are duplicated, there is no metadata, and it does not scale.

### Tokens Studio format

- **Good**, because it integrates directly with the Tokens Studio Figma plugin.
- **Bad**, because it is a vendor format; Tokens Studio can export DTCG anyway.

### Generated at build time only

- **Good**, because there are no generated files in git.
- **Bad**, because every consumer (app build, tests, IDE, Storybook dev server) depends on generation having run first, which is fragile with non-buildable libraries.

---

## Implementation Guidelines / Next Steps

1. Components use **semantic** tokens; palette tokens only when no semantic token fits.
2. To change tokens, edit `tokens/*.tokens.json`, run `npx nx run shared-ui-tokens:generate-tokens`, and commit both source and output.
3. Ask designers to turn the Figma swatches into **Figma Variables** that mirror these names. Then automate export (Figma Variables API or Tokens Studio → DTCG) and drift detection.
4. Next foundations: spacing, radii (pill buttons), elevation, breakpoints, motion, and a mobile type scale.
5. A light theme, if wanted, overrides only `color.background.*`, `color.content.*` and `color.border.*` under a theme selector (separate ADR).
