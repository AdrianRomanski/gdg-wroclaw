import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildTokens } from '../../tools/build-tokens.ts';
import { tokens } from '../generated/tokens.js';
import { cssVar, remToPx } from './css-var.js';

const generatedDir = join(import.meta.dirname, '../generated');

describe('generated tokens', () => {
  it.each(['tokens.css', 'tokens.ts'])(
    '%s is up to date with tokens/*.tokens.json (run `nx run design-system-tokens:generate-tokens`)',
    async (file) => {
      const outDir = await mkdtemp(join(tmpdir(), 'gdg-tokens-'));
      try {
        await buildTokens(outDir);
        const fresh = await readFile(join(outDir, file), 'utf8');
        const committed = await readFile(join(generatedDir, file), 'utf8');
        expect(committed).toBe(fresh);
      } finally {
        await rm(outDir, { recursive: true, force: true });
      }
    },
  );

  it('keeps the Figma palette values', () => {
    expect(tokens['color.blue-500'].value).toBe('#4285f4');
    expect(tokens['color.blue-500'].figma).toMatchObject({ name: 'Blue 500' });
    expect(tokens['color.black-02-alpha-40'].value).toBe('#1e1e1e66');
  });

  it('maps semantic tokens to palette tokens', () => {
    expect(tokens['color.content.default'].aliasOf).toBe('color.off-white');
    expect(tokens['color.brand.blue.secondary'].aliasOf).toBe(
      'color.halftone-blue',
    );
  });

  it('defines the 9-step type scale in rem (36/46 … 12/16 px)', () => {
    const heading1 = tokens['font.heading-1'].parts;
    expect(remToPx(heading1.fontSize)).toBe(36);
    expect(remToPx(heading1.lineHeight)).toBe(46);
    expect(remToPx(tokens['font.mono-9'].parts.fontSize)).toBe(12);
  });

  it('defines the Figma spacing and radius scales in rem', () => {
    expect(remToPx(tokens['spacing.12'].value)).toBe(12);
    expect(remToPx(tokens['spacing.64'].value)).toBe(64);
    expect(tokens['spacing.24'].figma).toMatchObject({ name: 'spacing-24' });
    expect(remToPx(tokens['radius.12'].value)).toBe(12);
    expect(remToPx(tokens['radius.full'].value)).toBe(9999);
  });

  it('adds the medium weight and on-brand content color for buttons', () => {
    expect(tokens['font.weight.medium'].value).toBe(500);
    expect(tokens['color.content.on-brand'].aliasOf).toBe(
      'color.neutral-darkest',
    );
  });

  describe('WCAG AA text contrast (4.5:1, ADR-0012)', () => {
    /** WCAG 2.1 relative luminance of an opaque `#rrggbb` color. */
    const luminance = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contrast = (a: string, b: string) => {
      const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (light + 0.05) / (dark + 0.05);
    };

    it.each(
      (['blue', 'green', 'yellow', 'red'] as const).flatMap((color) =>
        (['primary', 'secondary'] as const).map(
          (state) => `color.brand.${color}.${state}` as const,
        ),
      ),
    )('content.on-brand on %s', (fill) => {
      expect(
        contrast(tokens['color.content.on-brand'].value, tokens[fill].value),
      ).toBeGreaterThanOrEqual(4.5);
    });

    it('content.default on background.default', () => {
      expect(
        contrast(
          tokens['color.content.default'].value,
          tokens['color.background.default'].value,
        ),
      ).toBeGreaterThanOrEqual(4.5);
    });
  });

  it('builds var() references', () => {
    expect(cssVar('color.content.default')).toBe(
      'var(--gdg-color-content-default)',
    );
  });
});
