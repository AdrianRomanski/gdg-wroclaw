/**
 * GDG Wrocław design system — typography tokens.
 * Source of truth: Figma file, page "Typography" (node 1:147), Google Sans frames.
 * Mirrors src/styles/typography.css; use the CSS custom properties for styling
 * and these maps where typography is needed in TypeScript (e.g. Storybook).
 */

/** Font stacks. Self-hosted variable fonts first, then the Figma names, then system fallbacks. */
export const fontFamilies = {
  sans: "'Google Sans Variable', 'Google Sans', system-ui, sans-serif",
  mono: "'Google Sans Code Variable', 'Google Sans Mono', ui-monospace, monospace",
} as const;

export const fontWeights = {
  regular: 400,
  bold: 700,
} as const;

/** Type scale in px, shared by headings, paragraphs and mono text (1 = largest). */
export const typeScale = {
  1: { fontSize: 36, lineHeight: 46 },
  2: { fontSize: 32, lineHeight: 42 },
  3: { fontSize: 28, lineHeight: 38 },
  4: { fontSize: 24, lineHeight: 34 },
  5: { fontSize: 20, lineHeight: 30 },
  6: { fontSize: 18, lineHeight: 28 },
  7: { fontSize: 16, lineHeight: 26 },
  8: { fontSize: 14, lineHeight: 24 },
  9: { fontSize: 12, lineHeight: 16 },
} as const;

export type FontFamily = keyof typeof fontFamilies;
export type FontWeight = keyof typeof fontWeights;
export type TypeScaleStep = keyof typeof typeScale;

export interface TextStyle {
  family: FontFamily;
  weight: FontWeight;
  step: TypeScaleStep;
}

const steps = Object.keys(typeScale).map(Number) as TypeScaleStep[];

function stylesFor(
  prefix: string,
  family: FontFamily,
  weight: FontWeight,
  suffix = '',
): Record<string, TextStyle> {
  return Object.fromEntries(
    steps.map((step) => [
      `${prefix}-${step}${suffix}`,
      { family, weight, step },
    ]),
  );
}

/** Text styles from Figma: Heading (Bold/Regular), Paragraph (Regular), Mono (Regular/Bold). */
export const textStyles = {
  ...stylesFor('heading', 'sans', 'bold'),
  ...stylesFor('heading', 'sans', 'regular', '-regular'),
  ...stylesFor('paragraph', 'sans', 'regular'),
  ...stylesFor('mono', 'mono', 'regular'),
  ...stylesFor('mono', 'mono', 'bold', '-bold'),
} satisfies Record<string, TextStyle>;

export type TextStyleToken = keyof typeof textStyles;

/** Converts px to rem (16px root). */
export function rem(px: number): string {
  return `${px / 16}rem`;
}

/** Returns a `var()` reference to the `font` shorthand of a text style, e.g. `font: var(--gdg-font-heading-1)`. */
export function fontVar(style: TextStyleToken): string {
  return `var(--gdg-font-${style})`;
}
