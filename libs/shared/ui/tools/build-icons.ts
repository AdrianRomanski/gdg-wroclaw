/**
 * Builds the icon registry from the Phosphor icons listed in
 * `src/lib/icon/icons.json` into `src/lib/icon/generated/icons.ts`.
 * See ADR-0011. Run with `npx nx run shared-ui:generate-icons`.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const libRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const WEIGHT = 'regular';
const VIEW_BOX = '0 0 256 256';

export const ICONS_FILE = join(libRoot, 'src/lib/icon/generated/icons.ts');

/** Returns the inner markup of a Phosphor SVG (everything inside `<svg>`). */
function innerMarkup(name: string, svg: string): string {
  const match = /^<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/.exec(svg.trim());
  if (!match) {
    throw new Error(`Icon "${name}" is not a single <svg> element.`);
  }
  if (!match[1].includes(`viewBox="${VIEW_BOX}"`)) {
    throw new Error(`Icon "${name}" does not use viewBox "${VIEW_BOX}".`);
  }
  return match[2].trim();
}

/** Renders the contents of the generated `icons.ts`. */
export async function renderIcons(): Promise<string> {
  const names = JSON.parse(
    await readFile(join(libRoot, 'src/lib/icon/icons.json'), 'utf8'),
  ) as string[];
  const entries = await Promise.all(
    [...names].sort().map(async (name) => {
      const file = require.resolve(
        `@phosphor-icons/core/assets/${WEIGHT}/${name}.svg`,
      );
      return [name, innerMarkup(name, await readFile(file, 'utf8'))];
    }),
  );
  return [
    '/**',
    ` * Do not edit directly: generated from @phosphor-icons/core (${WEIGHT}) for the icons`,
    ' * listed in src/lib/icon/icons.json by tools/build-icons.ts',
    ' * (npx nx run shared-ui:generate-icons).',
    ' */',
    `export const ICON_VIEW_BOX = '${VIEW_BOX}';`,
    '',
    `export const icons = ${JSON.stringify(Object.fromEntries(entries), null, 2)} as const;`,
    '',
    'export type IconName = keyof typeof icons;',
    '',
  ].join('\n');
}

/** Writes the generated icon registry. */
export async function buildIcons(outFile = ICONS_FILE): Promise<void> {
  await writeFile(outFile, await renderIcons());
}
