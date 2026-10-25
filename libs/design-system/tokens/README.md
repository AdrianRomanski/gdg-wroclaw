# design-system-tokens

GDG Wrocław design tokens, sourced from Figma and authored in the [W3C Design Tokens (DTCG)](https://www.designtokens.org/) format. See [ADR-0008](../../../docs/adr/0008-design-tokens-pipeline-dtcg-style-dictionary.md) (pipeline), [ADR-0003](../../../docs/adr/0003-design-system-color-tokens.md) (colors) and [ADR-0005](../../../docs/adr/0005-design-system-typography-tokens.md) (typography).

This is the base of the architecture ([ADR-0013](../../../docs/adr/0013-design-system-and-ui-library-architecture.md)): it depends on no other workspace library. The Storybook **Design System/Foundations** pages live in [`docs/`](docs) and are rendered by [`apps/storybook`](../../../apps/storybook/README.md).

## Structure

```
tokens/                         # DTCG sources, linked to Figma where Figma has the value
  color/primitive.tokens.json   # Figma palette (Colors Primitives)
  color/semantic.tokens.json    # roles: background, content, border, brand primary/secondary
  spacing.tokens.json, radius.tokens.json, layout.tokens.json
  typography.tokens.json        # families, weights, 9-step scale, 45 text styles
themes/light.tokens.json        # light theme overrides, written by the sync (ADR-0027)
figma/gdg-ds.figma.json         # Figma snapshot, written by the sync (do not edit)
figma/sync.config.json          # Figma file key, modes, import rules, ignore list
figma-plugin/                   # GDG Tokens Export, the Figma development plugin
tools/build-tokens.ts           # Style Dictionary 5 build
tools/sync-figma.ts             # Figma sync (ADR-0026)
src/generated/                  # generated: tokens.css, tokens.light.css, tokens.ts (do not edit)
src/tokens.css                  # entry point: fonts + generated tokens
```

After editing token sources by hand:

```sh
npx nx run design-system-tokens:generate-tokens
```

Commit both the JSON and `src/generated/`. `npx nx test design-system-tokens` fails if they are out of sync. Restart a running Storybook dev server after the first generation of new files.

## Figma sync

Tokens with a `variable` or `style` id in `$extensions["gdg.figma"]` follow the **GDG-ds** Figma file ([ADR-0026](../../../docs/adr/0026-figma-variables-export-and-token-sync.md)). **Change those in Figma first**, then export and sync. All other tokens are code-owned: edit them by hand.

1. In the Figma desktop app, import the plugin once: Plugins → Development → Import plugin from manifest… → `libs/design-system/tokens/figma-plugin/manifest.json`.
2. Start the receiver:

   ```sh
   npx nx run design-system-tokens:sync-figma --receive
   ```

3. In GDG-ds, run Plugins → Development → **GDG Tokens Export** → **Send to repo**.

The sync saves the snapshot, updates the linked tokens (and the light theme), regenerates `src/generated/` and prints a report:

- **✗ error** – fixed by the sync, or needs a person (a deleted variable, a changed text style, a new variable without a token).
- **! warning** – drift in a value from a linked library; it doesn't fail CI.
- **· info** – code-owned tokens, roles without a light value, library values without a token.

Without the receiver, use **Copy JSON** in the plugin, save the clipboard to a file and run `sync-figma --from=<file>` (path relative to the repository root). `sync-figma --check` only reports and saves nothing, also with `--from` or `--receive`. A snapshot of another Figma file is never saved, and the receiver refuses requests that carry a web page's origin. A sandboxed iframe on any page can still reach it, so run the receiver only while exporting. New `spacing-*` and `radius-*` variables become tokens automatically (an existing code-owned token with that name is linked only if its value matches); for any other new variable, add a token with the `gdg.figma` link the report prints, or add the variable to `ignore` in `figma/sync.config.json`.

CI runs the drift test in `src/lib/figma-sync.spec.ts`: it fails when the tokens don't match the committed snapshot.

## Usage

Import once in an application's global stylesheet:

```css
@import '@gdg-wroclaw/design-system-tokens/tokens.css';
```

Prefer **semantic** tokens in components:

```css
.button {
  background: var(--gdg-color-brand-blue-primary);
  color: var(--gdg-color-content-default);
  font: var(--gdg-font-heading-7);
}

.button:hover {
  background: var(--gdg-color-brand-blue-secondary);
}
```

In TypeScript (Storybook, charts):

```ts
import { cssVar, tokens } from '@gdg-wroclaw/design-system-tokens';

tokens['color.blue-500'].value; // '#4285f4'
tokens['color.blue-500'].figma; // { variable: 'VariableID:1:131', name: 'Core Colors/Blue 500', group: 'Core colors', node: '1:37' }
cssVar('color.content.default'); // 'var(--gdg-color-content-default)'
```

## Tokens

| Group                | CSS custom properties                                                                                                                                                                                                                                      |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Palette              | `--gdg-color-{blue-500,green-500,yellow-600,red-500}`, `halftone-*`, `pastel-*`, `off-white`, `black-02`, `*-alpha-{40,20,10}`                                                                                                                             |
| Semantic (dark)      | `--gdg-color-background-{default,disabled,nav-button-hover,nav-button-active,raised,brand-subtle}`, `content-{default,disabled,on-brand,error,muted}`, `border-{default,disabled,error,subtle,input}`, `brand-{blue,green,yellow,red}-{primary,secondary}` |
| Font primitives      | `--gdg-font-family-{sans,mono}`, `--gdg-font-weight-{regular,bold}`, `--gdg-font-size-1…9`, `--gdg-line-height-1…9`                                                                                                                                        |
| Text styles (`font`) | `--gdg-font-heading-{1…9}`, `heading-{1…9}-regular`, `paragraph-{1…9}`, `mono-{1…9}`, `mono-{1…9}-bold`                                                                                                                                                    |

Type scale (px, size / line height): 1 = 36/46, 2 = 32/42, 3 = 28/38, 4 = 24/34, 5 = 20/30, 6 = 18/28, 7 = 16/26, 8 = 14/24, 9 = 12/16.

Spacing (`--gdg-spacing-N`, px): 0, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 36, 40, 48, 64, 80. Radius (`--gdg-radius-*`): none, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, full.

## Light theme

`tokens.css` includes an opt-in light theme from the Figma Light mode ([ADR-0027](../../../docs/adr/0027-light-theme-from-figma-light-mode.md)): set `data-theme="light"` on `<html>` (or any element). It is **partial**: the code-only roles (`content.error`, `content.muted`, `content.on-brand`, `background.raised`, `background.brand-subtle`, `border.error`, `border.subtle`) keep their dark values until Figma defines them. Preview it with the **Theme** toolbar in Storybook.

Fonts (Google Sans, Google Sans Code) are self-hosted via Fontsource and loaded by `tokens.css`.
