# ADR-0027: An Opt-in Light Theme from the Figma Light Mode

- **Status**: Accepted
- **Date**: 2026-10-20
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Designers, Frontend Working Group
- **Informed**: All project contributors

---

## Context and Problem Statement

The product is dark: `background.default` is Black 02 and `content.default` is OFF White ([ADR-0008](0008-design-tokens-pipeline-dtcg-style-dictionary.md)). ADR-0008 kept theming for a separate ADR: a light theme would override only the semantic colors under a theme selector.

The semantic `tokens` collection in GDG-ds has a **Light mode** and a **Dark mode**. The token sync ([ADR-0026](0026-figma-variables-export-and-token-sync.md)) reads Dark mode, and we decided to export Light mode as well.

Figma's Light mode covers the 16 `tokens` variables. Eight of them differ from Dark mode: background default, disabled and the two Nav Button states; content default and disabled; border default and disabled. The brand colors are the same in both modes. The roles that exist only in code have no Light value:

- `content.on-brand`, `content.error`, `content.muted`;
- `border.error`, `border.subtle`;
- `background.raised`, `background.brand-subtle`.

On a light background, those dark values fail. `content.error` (Halftone Red) gets 2.1:1 on OFF White, and `content.muted` gets 1.7:1. Raised cards stay dark (`#25272a`), with light-theme text (Black 02) on them at 1.1:1.

## Decision Drivers

- Figma stays the source of the values: no colors invented in code.
- Don't break the live site, which is dark by design.
- Standard DTCG sources and Style Dictionary, as in ADR-0008.
- The theme must be easy to preview while the designers complete it (#9).

## Considered Options

1. **Export only Dark mode** and keep Light in the snapshot.
2. **A DTCG theme source** (`themes/light.tokens.json`) with only the differing tokens, built into its own stylesheet under an attribute selector, **opt-in**.
3. Store the Light values in each token's `$extensions` and build them with a custom preprocessor.
4. Option 2, switched automatically by `prefers-color-scheme: light`.

## Decision Outcome

Chosen: **option 2**, a theme source and an opt-in stylesheet.

- The sync writes `themes/light.tokens.json` for linked tokens whose Light value differs from the default. It removes entries that stop differing, and keeps entries it didn't write (code-owned overrides). The values stay references to the palette (`{color.off-white}`).
- `tools/themes.ts` lists the themes. `build-tokens.ts` builds each one with the base tokens as `include` and the theme as `source`. A `gdg/css-theme` format writes only the theme's own tokens (`isSource`) as `var()` references, without the default theme's descriptions. The output is `src/generated/tokens.light.css`, and the drift test covers it.
- The selector is `:root[data-theme='light'], [data-theme='light']`. On `<html>` it is more specific than `:root`, so it wins whatever the import order; on any other element it themes that subtree.
- `tokens.css` imports the theme. Nothing sets `data-theme` yet, so the site is unchanged.
- Storybook gets a **Theme** toolbar (Dark, Light), which sets `data-theme` on the preview's `<html>`. The default stays Dark, so the accessibility checks in CI are unchanged.
- The token tests check that the Light surfaces come from Figma, and that default content on the default background reaches 4.5:1 (14.6:1).

### Positive Consequences

- The light theme comes from Figma and stays in sync with every export.
- Components keep using the same semantic custom properties; a theme only overrides values.
- Designers can preview the theme in Storybook and see what is missing.

### Negative Consequences / Trade-offs

- The theme is **partial**: the seven code-only roles keep their dark values, so pages with error text, muted text or raised surfaces are not usable in it yet.
- One more generated stylesheet, which every consumer downloads.

## Pros and Cons of the Options

### Dark only

- **Good**, because nothing changes.
- **Bad**, because the Figma Light mode is designed but unused, and nobody can see it.

### Theme source and opt-in stylesheet

- **Good**, because it is the layering Style Dictionary supports (`include` and `source`), and each theme file shows exactly what changes.
- **Bad**, because the theme lives in a second file.

### Values in `$extensions`

- **Good**, because each token's values sit together.
- **Bad**, because it is a custom format that other DTCG tools ignore, and it needs a custom build step.

### Automatic `prefers-color-scheme`

- **Good**, because visitors would get their preferred theme.
- **Bad**, because visitors with a light OS setting would get unreadable text on the live site while the theme is partial.

## Implementation Guidelines / Next Steps

1. Designers add the missing roles to the `tokens` collection with both modes (#9): error, muted, on-brand, raised, brand-subtle, subtle. Then link the code tokens to them, and the sync fills in their Light values.
2. Once every semantic role has a Light value, decide in a separate ADR whether the site offers a theme switch or follows `prefers-color-scheme`.
3. Components must not hard-code dark colors; use the semantic tokens, so a theme can change them.
