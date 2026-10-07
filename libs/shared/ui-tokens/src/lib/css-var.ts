import { tokens, type TokenId } from '../generated/tokens.js';

/** Returns a `var()` reference to a token's CSS custom property, e.g. `cssVar('color.blue-500')`. */
export function cssVar(id: TokenId): string {
  return `var(${tokens[id].cssVariable})`;
}

/** Converts a `rem` token value to pixels (16px root font size). */
export function remToPx(value: string): number {
  return parseFloat(value) * 16;
}
