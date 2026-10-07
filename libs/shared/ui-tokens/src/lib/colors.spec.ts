import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { colors, colorVar } from './colors.js';

const css = readFileSync(join(__dirname, '../styles/colors.css'), 'utf8');

function parseCssColors(source: string): Record<string, string> {
  const matches = source.matchAll(/--gdg-color-([\w-]+):\s*([^;]+);/g);
  return Object.fromEntries(
    [...matches].map(([, name, value]) => [name, value.trim()]),
  );
}

describe('colors', () => {
  it('matches the CSS custom properties in colors.css', () => {
    expect(parseCssColors(css)).toEqual(colors);
  });

  it('builds a var() reference for a token', () => {
    expect(colorVar('blue-500')).toBe('var(--gdg-color-blue-500)');
  });
});
