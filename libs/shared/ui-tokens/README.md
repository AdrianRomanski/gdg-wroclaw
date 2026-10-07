# shared-ui-tokens

GDG Wrocław design tokens, sourced from the Figma design file. See [ADR-0003](../../../docs/adr/0003-design-system-color-tokens.md).

## Usage

Import the tokens once in an application's global stylesheet:

```css
@import '@org/shared-ui-tokens/tokens.css';
```

Then use the CSS custom properties anywhere:

```css
.button {
  background: var(--gdg-color-blue-500);
  color: var(--gdg-color-off-white);
}
```

In TypeScript (e.g. Storybook, charts):

```ts
import { colors, colorVar } from '@org/shared-ui-tokens';

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
