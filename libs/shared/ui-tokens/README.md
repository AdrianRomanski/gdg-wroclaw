# shared-ui-tokens

GDG Wrocław design tokens, sourced from Figma and authored in the [W3C Design Tokens (DTCG)](https://www.designtokens.org/) format. See [ADR-0008](../../../docs/adr/0008-design-tokens-pipeline-dtcg-style-dictionary.md) (pipeline), [ADR-0003](../../../docs/adr/0003-design-system-color-tokens.md) (colors) and [ADR-0005](../../../docs/adr/0005-design-system-typography-tokens.md) (typography).

## Structure

```
tokens/                         # source of truth (edit these)
  color/primitive.tokens.json   # Figma palette (with Figma names/nodes)
  color/semantic.tokens.json    # roles: background, content, border, brand primary/secondary
  typography.tokens.json        # families, weights, 9-step scale, 45 text styles
tools/build-tokens.ts           # Style Dictionary 5 build
src/generated/                  # generated: tokens.css + tokens.ts (do not edit)
src/tokens.css                  # entry point: fonts + generated tokens
```

After editing `tokens/*.tokens.json`:

```sh
npx nx run shared-ui-tokens:generate-tokens
```

Commit both the JSON and `src/generated/`. `npx nx test shared-ui-tokens` fails if they are out of sync. Restart a running Storybook dev server after the first generation of new files.

## Usage

Import once in an application's global stylesheet:

```css
@import '@gdg-wroclaw/shared-ui-tokens/tokens.css';
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
import { cssVar, tokens } from '@gdg-wroclaw/shared-ui-tokens';

tokens['color.blue-500'].value; // '#4285f4'
tokens['color.blue-500'].figma; // { name: 'Blue 500', group: 'Core colors', node: '1:37' }
cssVar('color.content.default'); // 'var(--gdg-color-content-default)'
```

## Tokens

| Group                | CSS custom properties                                                                                                                             |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| Palette              | `--gdg-color-{blue-500,green-500,yellow-600,red-500}`, `halftone-*`, `pastel-*`, `off-white`, `black-02`, `*-alpha-{40,20,10}`                    |
| Semantic (dark)      | `--gdg-color-background-{default,disabled}`, `content-{default,disabled}`, `border-disabled`, `brand-{blue,green,yellow,red}-{primary,secondary}` |
| Font primitives      | `--gdg-font-family-{sans,mono}`, `--gdg-font-weight-{regular,bold}`, `--gdg-font-size-1…9`, `--gdg-line-height-1…9`                               |
| Text styles (`font`) | `--gdg-font-heading-{1…9}`, `heading-{1…9}-regular`, `paragraph-{1…9}`, `mono-{1…9}`, `mono-{1…9}-bold`                                           |

Type scale (px, size / line height): 1 = 36/46, 2 = 32/42, 3 = 28/38, 4 = 24/34, 5 = 20/30, 6 = 18/28, 7 = 16/26, 8 = 14/24, 9 = 12/16.

Fonts (Google Sans, Google Sans Code) are self-hosted via Fontsource and loaded by `tokens.css`.
