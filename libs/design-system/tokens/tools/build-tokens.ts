/**
 * Builds the design tokens from the W3C Design Tokens (DTCG) sources in
 * `tokens/` into `src/generated/` (CSS custom properties + typed metadata),
 * plus one stylesheet per theme in `themes/` (ADR-0027).
 * See ADR-0008. Run with `npx nx run design-system-tokens:generate-tokens`.
 */
import StyleDictionary from 'style-dictionary';
import type {
  Dictionary,
  File,
  PlatformConfig,
  TransformedToken,
} from 'style-dictionary/types';
import {
  fileHeader,
  formattedVariables,
  resolveReferences,
  usesReferences,
} from 'style-dictionary/utils';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES } from './themes.ts';

const libRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT_FONT_SIZE_PX = 16;
const HEADER = [
  'Do not edit directly: generated from libs/design-system/tokens/{tokens,themes}/',
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

StyleDictionary.registerFormat({
  name: 'gdg/css-theme',
  format: async ({ dictionary, file, options }) => {
    // Only the theme's own tokens. References resolve against all tokens, so
    // they stay var() references to the base tokens instead of being flagged
    // as filtered out.
    const theme = {
      ...dictionary,
      allTokens: dictionary.allTokens.filter((token) => token.isSource),
    };
    const variables = formattedVariables({
      format: 'css',
      dictionary: theme,
      outputReferences: true,
      usesDtcg: true,
      // The base descriptions are written for the default theme.
      formatting: { commentStyle: 'none' },
    });
    return `${await fileHeader({ file })}${options.selector} {\n${variables}\n}\n`;
  },
});

const BASE_SOURCES = join(libRoot, 'tokens/**/*.tokens.json');

function webPlatform(outDir: string, files: File[]): PlatformConfig {
  return {
    prefix: 'gdg',
    buildPath: `${outDir}/`,
    transforms: [
      'name/kebab',
      'fontFamily/css',
      'gdg/dimension/px-to-rem',
      'typography/css/shorthand',
    ],
    files,
  };
}

/** Builds all token outputs into `outDir` (defaults to `src/generated`). */
export async function buildTokens(
  outDir = join(libRoot, 'src/generated'),
): Promise<void> {
  const log = { verbosity: 'silent', warnings: 'error' } as const;
  const sd = new StyleDictionary({
    source: [BASE_SOURCES],
    usesDtcg: true,
    log,
    platforms: {
      web: webPlatform(outDir, [
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
      ]),
    },
  });
  await sd.buildAllPlatforms();

  for (const [name, theme] of Object.entries(THEMES)) {
    // The base tokens are included (not sources), so `isSource` marks the
    // theme's own tokens.
    const themeSd = new StyleDictionary({
      include: [BASE_SOURCES],
      source: [join(libRoot, theme.source)],
      usesDtcg: true,
      log,
      platforms: {
        web: webPlatform(outDir, [
          {
            destination: `tokens.${name}.css`,
            format: 'gdg/css-theme',
            options: { fileHeader: 'gdg/header', selector: theme.selector },
          },
        ]),
      },
    });
    await themeSd.buildAllPlatforms();
  }
}
