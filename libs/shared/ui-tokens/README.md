# shared-ui-tokens

GDG Wrocław design tokens, sourced from the Figma design file. See [ADR-0003](../../../docs/adr/0003-design-system-color-tokens.md) (colors) and [ADR-0005](../../../docs/adr/0005-design-system-typography-tokens.md) (typography).

## Usage

Import the tokens once in an application's global stylesheet:

```css
@import '@gdg-wroclaw/shared-ui-tokens/tokens.css';
```

Then use the CSS custom properties anywhere:

```css
.button {
  background: var(--gdg-color-blue-500);
  color: var(--gdg-color-off-white);
  font: var(--gdg-font-heading-7);
}
```

In TypeScript (e.g. Storybook, charts):

```ts
import { colors, colorVar } from '@gdg-wroclaw/shared-ui-tokens';

colors['blue-500']; // '#4285f4'
colorVar('blue-500'); // 'var(--gdg-color-blue-500)'
```

## Colors

| Group     | Tokens                                                               |
| :-------- | :------------------------------------------------------------------- |
| Core      | `blue-500`, `green-500`, `yellow-600`, `red-500`                     |
| Halftones | `halftone-blue`, `halftone-green`, `halftone-yellow`, `halftone-red` |
| Pastels   | `pastel-blue`, `pastel-green`, `pastel-yellow`, `pastel-red`         |
| Grayscale | `off-white`, `black-02`                                              |
| Alpha     | `off-white-alpha-{40,20,10}`, `black-02-alpha-{40,20,10}`            |

All tokens are exposed as `--gdg-color-<token>`. When Figma changes, update `src/styles/colors.css` and `src/lib/colors.ts` together; `nx test shared-ui-tokens` checks they match.

## Typography

Fonts (Google Sans, Google Sans Code) are self-hosted via Fontsource and loaded by `tokens.css`.

Apply a text style with one declaration: `font: var(--gdg-font-<style>)`.

| Style              | Tokens                                    | Weight  | Family |
| :----------------- | :---------------------------------------- | :------ | :----- |
| Headings           | `heading-1` … `heading-9`                 | Bold    | Sans   |
| Headings (regular) | `heading-1-regular` … `heading-9-regular` | Regular | Sans   |
| Paragraphs         | `paragraph-1` … `paragraph-9`             | Regular | Sans   |
| Mono               | `mono-1` … `mono-9`                       | Regular | Mono   |
| Mono (bold)        | `mono-1-bold` … `mono-9-bold`             | Bold    | Mono   |

Scale (px, size / line height): 1 = 36/46, 2 = 32/42, 3 = 28/38, 4 = 24/34, 5 = 20/30, 6 = 18/28, 7 = 16/26, 8 = 14/24, 9 = 12/16.

Primitives: `--gdg-font-family-sans|mono`, `--gdg-font-weight-regular|bold`, `--gdg-font-size-1…9`, `--gdg-line-height-1…9`. Update `src/lib/typography.ts` and `src/styles/typography.css` together; `nx test shared-ui-tokens` checks they match.
