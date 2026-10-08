import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildTokens } from '../../tools/build-tokens.ts';
import { tokens } from '../generated/tokens.js';
import { cssVar, remToPx } from './css-var.js';

const generatedDir = join(import.meta.dirname, '../generated');

describe('generated tokens', () => {
  it.each(['tokens.css', 'tokens.ts'])(
    '%s is up to date with tokens/*.tokens.json (run `nx run shared-ui-tokens:generate-tokens`)',
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
    expect(tokens['color.content.on-brand'].aliasOf).toBe('color.off-white');
  });

  it('builds var() references', () => {
    expect(cssVar('color.content.default')).toBe(
      'var(--gdg-color-content-default)',
    );
  });
});
