/**
 * GDG Wrocław design system — color tokens.
 * Source of truth: Figma file, page "Colors" (node 0:1).
 * Mirrors src/styles/colors.css; use the CSS custom properties for styling
 * and this map where colors are needed in TypeScript (e.g. Storybook, charts).
 */
export const colors = {
  'blue-500': '#4285f4',
  'green-500': '#34a853',
  'yellow-600': '#f9ab00',
  'red-500': '#ea4335',

  'halftone-blue': '#57caff',
  'halftone-green': '#5cdb6d',
  'halftone-yellow': '#ffd427',
  'halftone-red': '#ff7daf',

  'pastel-blue': '#c3ecf6',
  'pastel-green': '#ccf6c5',
  'pastel-yellow': '#ffe7a5',
  'pastel-red': '#f8d8d8',

  'off-white': '#f0f0f0',
  'black-02': '#1e1e1e',

  'off-white-alpha-40': '#f0f0f066',
  'off-white-alpha-20': '#f0f0f033',
  'off-white-alpha-10': '#f0f0f01a',
  'black-02-alpha-40': '#1e1e1e66',
  'black-02-alpha-20': '#1e1e1e33',
  'black-02-alpha-10': '#1e1e1e1a',
} as const;

export type ColorToken = keyof typeof colors;

/** Returns a `var()` reference to the CSS custom property of a color token. */
export function colorVar(token: ColorToken): string {
  return `var(--gdg-color-${token})`;
}
