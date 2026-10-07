import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  fontFamilies,
  fontVar,
  fontWeights,
  rem,
  textStyles,
  typeScale,
} from './typography.js';

const css = readFileSync(join(__dirname, '../styles/typography.css'), 'utf8');

function parseCssTokens(source: string): Record<string, string> {
  const matches = source.matchAll(
    /--gdg-(font-[\w-]+|line-height-\d+):\s*([^;]+);/g,
  );
  return Object.fromEntries(
    [...matches].map(([, name, value]) => [
      name,
      value.replace(/\s+/g, ' ').trim(),
    ]),
  );
}

function expectedTokens(): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const [name, value] of Object.entries(fontFamilies)) {
    tokens[`font-family-${name}`] = value;
  }
  for (const [name, value] of Object.entries(fontWeights)) {
    tokens[`font-weight-${name}`] = String(value);
  }
  for (const [step, { fontSize, lineHeight }] of Object.entries(typeScale)) {
    tokens[`font-size-${step}`] = rem(fontSize);
    tokens[`line-height-${step}`] = rem(lineHeight);
  }
  for (const [name, { family, weight, step }] of Object.entries(textStyles)) {
    tokens[`font-${name}`] =
      `var(--gdg-font-weight-${weight}) var(--gdg-font-size-${step}) / ` +
      `var(--gdg-line-height-${step}) var(--gdg-font-family-${family})`;
  }
  return tokens;
}

describe('typography', () => {
  it('matches the CSS custom properties in typography.css', () => {
    expect(parseCssTokens(css)).toEqual(expectedTokens());
  });

  it('defines 45 text styles (heading, heading regular, paragraph, mono, mono bold × 9)', () => {
    expect(Object.keys(textStyles)).toHaveLength(45);
  });

  it('builds a var() reference for a text style', () => {
    expect(fontVar('heading-1')).toBe('var(--gdg-font-heading-1)');
  });
});
