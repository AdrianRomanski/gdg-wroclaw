/**
 * Themes layered over the base tokens (ADR-0027). Each source holds only the
 * tokens whose value differs from the default (dark) theme; the build emits
 * them as `src/generated/tokens.<theme>.css` under `selector`.
 */
export const THEMES = {
  light: {
    source: 'themes/light.tokens.json',
    selector: ":root[data-theme='light'],\n[data-theme='light']",
  },
} as const;

export type ThemeName = keyof typeof THEMES;
