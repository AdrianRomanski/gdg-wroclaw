/**
 * Builds the design tokens from the W3C Design Tokens (DTCG) sources in
 * `tokens/` into `src/generated/` (CSS custom properties + typed metadata).
 * See ADR-0008. Run with `npx nx run design-system-tokens:generate-tokens`.
 */
import StyleDictionary from 'style-dictionary';
import type { Dictionary, TransformedToken } from 'style-dictionary/types';
import { resolveReferences, usesReferences } from 'style-dictionary/utils';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const libRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT_FONT_SIZE_PX = 16;
const HEADER = [
  'Do not edit directly: generated from libs/design-system/tokens/tokens/*.tokens.json',
  'by tools/build-tokens.ts (npx nx run design-system-tokens:generate-tokens).',
];

StyleDictionary.registerTransform({
  name: 'gdg/dimension/px-to-rem',
  type: 'value',
  filter: (token) => token.$type === 'dimension',
  transform: (token) => `${parseFloat(token.$value) / ROOT_FONT_SIZE_PX}rem`,
});

StyleDictionary.registerFileHeader({
  name: 'gdg/header',
  fileHeader: () => HEADER,
});

function aliasOf(token: TransformedToken): string | null {
  const original = token.original.$value;
  return typeof original === 'string' && usesReferences(original)
    ? original.slice(1, -1)
    : null;
}

/** For composite tokens (typography), the transformed value of each part. */
function partsOf(
  token: TransformedToken,
  dictionary: Dictionary,
): Record<string, unknown> | null {
  const original = token.original.$value;
  if (
    typeof original !== 'object' ||
    original === null ||
    Array.isArray(original)
  ) {
    return null;
  }
  return Object.fromEntries(
    Object.entries(original).map(([key, value]) => [
      key,
      typeof value === 'string' && usesReferences(value)
        ? resolveReferences(value, dictionary.tokens, { usesDtcg: true })
        : value,
    ]),
  );
}

StyleDictionary.registerFormat({
  name: 'gdg/typescript-metadata',
  format: ({ dictionary }) => {
    const entries = dictionary.allTokens.map((token) => {
      const id = token.path.join('.');
      const figma = token.$extensions?.['gdg.figma'] ?? null;
      return [
        id,
        {
          id,
          cssVariable: `--${token.name}`,
          type: token.$type,
          value: token.$value,
          aliasOf: aliasOf(token),
          parts: partsOf(token, dictionary),
          description: token.$description ?? null,
          figma,
        },
      ];
    });
    const body = JSON.stringify(Object.fromEntries(entries), null, 2);
    return [
      ...HEADER.map((line, index) =>
        index === 0 ? `/**\n * ${line}` : ` * ${line}`,
      ),
      ' */',
      `export const tokens = ${body} as const;`,
      '',
      'export type TokenId = keyof typeof tokens;',
      'export type Token = (typeof tokens)[TokenId];',
      '',
    ].join('\n');
  },
});

/** Builds all token outputs into `outDir` (defaults to `src/generated`). */
export async function buildTokens(
  outDir = join(libRoot, 'src/generated'),
): Promise<void> {
  const sd = new StyleDictionary({
    source: [join(libRoot, 'tokens/**/*.tokens.json')],
    usesDtcg: true,
    log: { verbosity: 'silent', warnings: 'error' },
    platforms: {
      web: {
        prefix: 'gdg',
        buildPath: `${outDir}/`,
        transforms: [
          'name/kebab',
          'fontFamily/css',
          'gdg/dimension/px-to-rem',
          'typography/css/shorthand',
        ],
        files: [
          {
            destination: 'tokens.css',
            format: 'css/variables',
            options: {
              fileHeader: 'gdg/header',
              selector: ':root',
              // Semantic aliases stay live references; composites are resolved.
              outputReferences: (token) => token.$type !== 'typography',
            },
          },
          {
            destination: 'tokens.ts',
            format: 'gdg/typescript-metadata',
          },
        ],
      },
    },
  });
  await sd.buildAllPlatforms();
}
