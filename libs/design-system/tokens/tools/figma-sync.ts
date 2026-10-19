/**
 * Compares the DTCG token sources with the committed Figma snapshot and
 * proposes the edits that bring them in line (ADR-0026). `sync-figma.ts`
 * writes the edits; the drift test in `tokens.spec.ts` fails on errors.
 *
 * A token is linked to Figma when `$extensions["gdg.figma"]` holds a
 * `variable` or `style` id. Linked tokens follow Figma; every other token is
 * code-owned and never touched.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isAlias, readSnapshot } from './figma-snapshot.ts';
import type {
  FigmaCollection,
  FigmaColor,
  FigmaSnapshot,
  FigmaTextStyle,
  FigmaValue,
  FigmaVariable,
} from './figma-snapshot.ts';
import { THEMES } from './themes.ts';
import type { ThemeName } from './themes.ts';
import {
  TOKEN_SOURCES,
  flattenTokens,
  libRoot,
  readTokenFile,
  readTokenFiles,
} from './token-files.ts';
import type { DesignToken, TokenEdit, TokenEntry } from './token-files.ts';

export const FIGMA_EXTENSION = 'gdg.figma';
export const CONFIG_FILE = 'figma/sync.config.json';

export interface FigmaLink {
  /** Figma variable id. */
  variable?: string;
  /** Figma text style id. */
  style?: string;
  /** Figma variable or style name; the sync keeps it up to date. */
  name?: string;
  /** The variable lives in a linked library: drift is only a warning. */
  library?: boolean;
  [key: string]: unknown;
}

interface ImportRule {
  collection: string;
  /** Variable name pattern; its first group becomes the token key. */
  name: string;
  file: string;
  group: string[];
}

export interface SyncConfig {
  fileKey: string;
  snapshot: string;
  /** Mode to read, by collection name, for collections with several modes. */
  modes: Record<string, string>;
  /** Per theme: the mode to read instead, by collection name. */
  themes: Partial<Record<ThemeName, Record<string, string>>>;
  /** Figma collections whose new variables become tokens automatically. */
  import: ImportRule[];
  /** Local variables and text styles that deliberately have no token. */
  ignore: { id: string; name: string; reason: string }[];
}

export type IssueLevel = 'error' | 'warning' | 'info';

export interface SyncIssue {
  level: IssueLevel;
  message: string;
  /** The edits that resolve the issue; empty when a person has to decide. */
  edits: TokenEdit[];
}

/** Font style names (`fontName.style`) to CSS font weights. */
const FONT_WEIGHTS: Record<string, number> = {
  Thin: 100,
  ExtraLight: 200,
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
  Black: 900,
};

class SyncError extends Error {}

export async function readSyncConfig(): Promise<SyncConfig> {
  return JSON.parse(await readFile(join(libRoot, CONFIG_FILE), 'utf8'));
}

export function linkOf(entry: TokenEntry): FigmaLink | undefined {
  const link = entry.token.$extensions?.[FIGMA_EXTENSION] as
    FigmaLink | undefined;
  return link?.variable || link?.style ? link : undefined;
}

function referenceOf(value: unknown): string | null {
  return typeof value === 'string' && /^\{[^{}]+\}$/.test(value)
    ? value.slice(1, -1)
    : null;
}

function px(value: number): string {
  return `${Number(value.toFixed(4))}px`;
}

function parsePx(value: unknown): number | null {
  const match = typeof value === 'string' ? /^(-?[\d.]+)px$/.exec(value) : null;
  return match ? Number(match[1]) : null;
}

function figmaHex({ r, g, b, a }: FigmaColor): string {
  const hex = [r, g, b, a]
    .map((channel) =>
      Math.round(channel * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('');
  return `#${hex.endsWith('ff') ? hex.slice(0, 6) : hex}`;
}

function normalizeHex(value: unknown): string | null {
  const match =
    typeof value === 'string' ? /^#([\da-f]{3,8})$/i.exec(value) : null;
  if (!match || ![3, 4, 6, 8].includes(match[1].length)) {
    return null;
  }
  let hex = match[1].toLowerCase();
  if (hex.length <= 4) {
    hex = [...hex].map((digit) => digit + digit).join('');
  }
  return `#${hex.endsWith('ff') && hex.length === 8 ? hex.slice(0, 6) : hex}`;
}

function sameValue(a: unknown, b: unknown, type: string | undefined): boolean {
  if (type === 'color') {
    return normalizeHex(a) !== null && normalizeHex(a) === normalizeHex(b);
  }
  if (type === 'dimension') {
    const [x, y] = [parsePx(a), parsePx(b)];
    return x !== null && y !== null && Math.abs(x - y) < 1e-4;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Collapses unusual whitespace (e.g. a pasted U+2028 line separator). */
function cleanName(name: string): string {
  return name.replace(/\s+/gu, ' ').trim();
}

function withCleanNames<T extends { name: string }>(
  records: Record<string, T>,
  unclean: Set<string>,
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(records).map(([id, record]) => {
      const name = cleanName(record.name);
      if (name !== record.name) {
        unclean.add(name);
      }
      return [id, { ...record, name }];
    }),
  );
}

function show(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

/** The Figma variables, collections and text styles of the snapshot. */
class FigmaFile {
  readonly variables: Record<string, FigmaVariable>;
  readonly collections: Record<string, FigmaCollection>;
  readonly textStyles: Record<string, FigmaTextStyle>;
  /** Ids of the variables and text styles that are only bound on layers. */
  readonly layerOnly: Set<string>;
  /** Names that had unusual whitespace, after cleaning. */
  readonly uncleanNames = new Set<string>();
  private readonly modes: Record<string, string>;

  constructor(snapshot: FigmaSnapshot, modes: Record<string, string>) {
    this.modes = modes;
    this.variables = withCleanNames(
      { ...snapshot.variables, ...snapshot.usage.variables },
      this.uncleanNames,
    );
    this.collections = {
      ...snapshot.variableCollections,
      ...snapshot.usage.variableCollections,
    };
    this.textStyles = withCleanNames(
      { ...snapshot.textStyles, ...snapshot.usage.textStyles },
      this.uncleanNames,
    );
    this.layerOnly = new Set([
      ...Object.keys(snapshot.usage.variables),
      ...Object.keys(snapshot.usage.textStyles),
    ]);
  }

  collectionOf(variable: FigmaVariable): FigmaCollection | undefined {
    return this.collections[variable.variableCollectionId];
  }

  /** The value of `variable` in its configured (or theme) mode. */
  value(
    variable: FigmaVariable,
    themeModes: Record<string, string> = {},
  ): FigmaValue {
    const collection = this.collectionOf(variable);
    const modeIds = Object.keys(variable.valuesByMode);
    let modeId = modeIds.length === 1 ? modeIds[0] : undefined;
    if (collection && collection.modes.length > 1) {
      const name = themeModes[collection.name] ?? this.modes[collection.name];
      modeId = collection.modes.find((mode) => mode.name === name)?.modeId;
      if (!modeId) {
        throw new SyncError(
          `Figma collection "${collection.name}" has the modes ` +
            `${collection.modes.map((mode) => `"${mode.name}"`).join(', ')}: ` +
            `set one in "modes" of ${CONFIG_FILE}.`,
        );
      }
    }
    if (!modeId) {
      throw new SyncError(
        `"${variable.name}" has several modes but its library collection is not in the snapshot.`,
      );
    }
    return variable.valuesByMode[modeId];
  }

  /** Follows aliases to the final value. */
  resolve(
    variable: FigmaVariable,
    themeModes?: Record<string, string>,
  ): FigmaValue {
    const value = this.value(variable, themeModes);
    if (!isAlias(value)) {
      return value;
    }
    const target = this.variables[value.id];
    if (!target) {
      throw new SyncError(`"${variable.name}" aliases a missing variable.`);
    }
    return this.resolve(target, themeModes);
  }
}

/** The code value of a Figma literal for a token of `type`. */
function literalFor(value: FigmaValue, type: string | undefined): unknown {
  if (type === 'color' && typeof value === 'object' && !isAlias(value)) {
    return figmaHex(value);
  }
  if (type === 'dimension' && typeof value === 'number') {
    return px(value);
  }
  if (
    (type === 'number' || type === 'fontWeight') &&
    typeof value === 'number'
  ) {
    return value;
  }
  throw new SyncError(
    `Figma value ${JSON.stringify(value)} can't become a "${type}" token.`,
  );
}

class Comparison {
  readonly issues: SyncIssue[] = [];
  /** Figma variable id → ids of the tokens linked to it. */
  private readonly linked = new Map<string, string[]>();
  /** Token id → the Figma variable or style it is linked to. */
  private readonly targets = new Map<string, string>();
  /** Tokens that linked text style tokens reference (checked through them). */
  private readonly styleParts = new Set<string>();
  private autoLineHeights = 0;
  private readonly config: SyncConfig;
  private readonly figma: FigmaFile;
  private readonly tokens: Map<string, TokenEntry>;
  private readonly themes: Map<ThemeName, Map<string, TokenEntry>>;

  constructor(
    config: SyncConfig,
    figma: FigmaFile,
    tokens: Map<string, TokenEntry>,
    themes: Map<ThemeName, Map<string, TokenEntry>>,
  ) {
    this.config = config;
    this.figma = figma;
    this.tokens = tokens;
    this.themes = themes;
  }

  private report(
    level: IssueLevel,
    message: string,
    edits: TokenEdit[] = [],
  ): void {
    this.issues.push({ level, message, edits });
  }

  /** Resolves code references (also inside composite values). */
  private resolveCode(value: unknown, seen = new Set<string>()): unknown {
    const reference = referenceOf(value);
    if (reference) {
      const target = this.tokens.get(reference);
      if (!target || seen.has(reference)) {
        return value;
      }
      return this.resolveCode(
        target.token.$value,
        new Set([...seen, reference]),
      );
    }
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, part]) => [
          key,
          this.resolveCode(part, seen),
        ]),
      );
    }
    return value;
  }

  private linkPath(entry: TokenEntry): string[] {
    return [...entry.path, '$extensions', FIGMA_EXTENSION];
  }

  /**
   * Finds the Figma variable or style of a linked token: by id, else by name
   * (a re-created variable, or the other copy of a duplicated library).
   */
  private findTarget(
    entry: TokenEntry,
    link: FigmaLink,
  ): FigmaVariable | FigmaTextStyle | undefined {
    const level: IssueLevel = link.library ? 'warning' : 'error';
    const records: Record<string, FigmaVariable | FigmaTextStyle> =
      link.variable ? this.figma.variables : this.figma.textStyles;
    const key = link.variable ? 'variable' : 'style';
    const id = (link.variable ?? link.style) as string;
    const found = records[id];
    if (found) {
      if (found.name !== link.name) {
        this.report(
          level,
          `${entry.id}: Figma renamed "${link.name}" to "${found.name}".`,
          [
            {
              file: entry.file,
              path: [...this.linkPath(entry), 'name'],
              value: found.name,
            },
          ],
        );
      }
      return found;
    }
    const candidates = Object.values(records)
      .filter((record) => record.name === link.name)
      .sort((a, b) => a.id.localeCompare(b.id, 'en'));
    const values = new Set(
      candidates.map((record) =>
        'resolvedType' in record
          ? JSON.stringify(this.tryResolve(record))
          : JSON.stringify([record.fontName, record.fontSize]),
      ),
    );
    if (candidates.length > 0 && values.size === 1) {
      const [target] = candidates;
      this.report(
        level,
        `${entry.id}: "${link.name}" has a new Figma id; relinking.`,
        [
          {
            file: entry.file,
            path: [...this.linkPath(entry), key],
            value: target.id,
          },
        ],
      );
      return target;
    }
    this.report(
      level,
      candidates.length > 0
        ? `${entry.id}: "${link.name}" is gone; ${candidates.length} Figma ${key}s ` +
            `have that name with different values. Link one by id.`
        : `${entry.id}: its Figma ${key} "${link.name}" is gone. ` +
            `Remove the link (the token becomes code-owned) or link another ${key}.`,
    );
    return undefined;
  }

  private tryResolve(variable: FigmaVariable): FigmaValue | null {
    try {
      return this.figma.resolve(variable);
    } catch {
      return null;
    }
  }

  /**
   * The code value Figma expects for a token linked to `variable`: a
   * reference when the alias target is linked to a token, else a literal.
   */
  private expected(
    variable: FigmaVariable,
    type: string | undefined,
    current: unknown,
    themeModes?: Record<string, string>,
  ): unknown {
    const value = this.figma.value(variable, themeModes);
    if (!isAlias(value)) {
      return literalFor(value, type);
    }
    const target = this.figma.variables[value.id];
    if (!target) {
      throw new SyncError(`"${variable.name}" aliases a missing variable.`);
    }
    const candidates = this.linked.get(target.id) ?? [];
    if (candidates.length > 0) {
      const reference = referenceOf(current);
      const chosen =
        reference && candidates.includes(reference) ? reference : candidates[0];
      return `{${chosen}}`;
    }
    return this.expected(target, type, current, themeModes);
  }

  /** Whether `current` already matches `expected`. */
  private matches(
    current: unknown,
    expected: unknown,
    type: string | undefined,
  ): boolean {
    if (referenceOf(expected)) {
      return current === expected;
    }
    return sameValue(this.resolveCode(current), expected, type);
  }

  run(): SyncIssue[] {
    const linkedEntries: [TokenEntry, FigmaLink, string][] = [];
    for (const entry of this.tokens.values()) {
      const link = linkOf(entry);
      const target = link && this.findTarget(entry, link);
      if (link && target) {
        linkedEntries.push([entry, link, target.id]);
        this.targets.set(entry.id, target.id);
        if (link.variable) {
          this.linked.set(target.id, [
            ...(this.linked.get(target.id) ?? []),
            entry.id,
          ]);
        }
      }
    }
    for (const [entry, link, targetId] of linkedEntries) {
      try {
        if (link.variable) {
          this.compareVariable(entry, link, this.figma.variables[targetId]);
        } else {
          this.compareTextStyle(entry, this.figma.textStyles[targetId]);
        }
      } catch (error) {
        if (!(error instanceof SyncError)) {
          throw error;
        }
        this.report('error', `${entry.id}: ${error.message}`);
      }
    }
    this.reportUnlinked();
    this.reportCodeOnly();
    return this.issues;
  }

  private compareVariable(
    entry: TokenEntry,
    link: FigmaLink,
    variable: FigmaVariable,
  ): void {
    const level: IssueLevel = link.library ? 'warning' : 'error';
    const current = entry.token.$value;
    const expected = this.expected(variable, entry.type, current);
    if (!this.matches(current, expected, entry.type)) {
      this.report(
        level,
        `${entry.id}: ${show(current)} → ${show(expected)} (Figma "${variable.name}").`,
        [
          {
            file: entry.file,
            path: [...entry.path, '$value'],
            value: expected,
          },
        ],
      );
    }
    for (const [theme, themeModes] of Object.entries(this.config.themes)) {
      const name = theme as ThemeName;
      const themed = this.themes.get(name)?.get(entry.id);
      const file = THEMES[name].source;
      const themeExpected = this.expected(
        variable,
        entry.type,
        themed?.token.$value ?? current,
        themeModes,
      );
      const differs = referenceOf(themeExpected)
        ? themeExpected !== expected
        : !sameValue(this.resolveCode(expected), themeExpected, entry.type);
      if (!differs && themed) {
        this.report(
          level,
          `${entry.id}: ${theme} no longer differs from the default (Figma "${variable.name}").`,
          [{ file, path: entry.path, value: undefined }],
        );
      } else if (
        differs &&
        !(
          themed && this.matches(themed.token.$value, themeExpected, entry.type)
        )
      ) {
        this.report(
          level,
          `${entry.id} (${theme}): ${show(themed?.token.$value ?? '(default)')} → ` +
            `${show(themeExpected)} (Figma "${variable.name}").`,
          [{ file, path: [...entry.path, '$value'], value: themeExpected }],
        );
      }
    }
  }

  private compareTextStyle(entry: TokenEntry, style: FigmaTextStyle): void {
    for (const part of Object.values(entry.token.$value as object)) {
      const reference = referenceOf(part);
      if (reference) {
        this.styleParts.add(reference);
      }
    }
    const parts = this.resolveCode(entry.token.$value) as Record<
      string,
      unknown
    >;
    const differences: string[] = [];
    const families = [parts['fontFamily']].flat();
    if (!families.includes(style.fontName.family)) {
      differences.push(
        `font family "${style.fontName.family}" is not in ${show(parts['fontFamily'])}`,
      );
    }
    const weightName = style.fontName.style.replace(/\s*Italic$/, '');
    const weight = FONT_WEIGHTS[weightName.replace(/\s+/g, '')];
    if (weight !== parts['fontWeight']) {
      differences.push(
        `font weight "${style.fontName.style}" (${weight ?? '?'}) ≠ ${show(parts['fontWeight'])}`,
      );
    }
    if (!sameValue(parts['fontSize'], px(style.fontSize), 'dimension')) {
      differences.push(
        `font size ${style.fontSize}px ≠ ${show(parts['fontSize'])}`,
      );
    }
    // AUTO line heights stay code-owned: CSS `normal` differs per font.
    const { lineHeight, letterSpacing } = style;
    if (lineHeight.unit === 'AUTO') {
      this.autoLineHeights++;
    } else if (lineHeight.value !== undefined) {
      const figmaLineHeight =
        lineHeight.unit === 'PIXELS'
          ? lineHeight.value
          : (style.fontSize * lineHeight.value) / 100;
      if (!sameValue(parts['lineHeight'], px(figmaLineHeight), 'dimension')) {
        differences.push(
          `line height ${px(figmaLineHeight)} ≠ ${show(parts['lineHeight'])}`,
        );
      }
    }
    if (letterSpacing.value && !parts['letterSpacing']) {
      differences.push(
        `letter spacing ${letterSpacing.value} ${letterSpacing.unit} is not in the token`,
      );
    }
    if (style.textDecoration && style.textDecoration !== 'NONE') {
      differences.push(
        `text decoration ${style.textDecoration} is not in the token`,
      );
    }
    if (style.textCase && style.textCase !== 'ORIGINAL') {
      differences.push(`text case ${style.textCase} is not in the token`);
    }
    if (differences.length > 0) {
      this.report(
        'error',
        `${entry.id}: Figma text style "${style.name}" differs: ` +
          `${differences.join('; ')}. Update the token by hand.`,
      );
    }
  }

  /** Local Figma variables and text styles without a token. */
  private reportUnlinked(): void {
    const ignored = new Set(this.config.ignore.map((entry) => entry.id));
    const isLinked = (id: string) => [...this.targets.values()].includes(id);
    for (const variable of Object.values(this.figma.variables)) {
      if (
        variable.remote ||
        this.figma.layerOnly.has(variable.id) ||
        ignored.has(variable.id) ||
        isLinked(variable.id)
      ) {
        continue;
      }
      const collection = this.figma.collectionOf(variable)?.name ?? '?';
      const rule = this.config.import.find(
        (candidate) =>
          candidate.collection === collection &&
          new RegExp(candidate.name).test(variable.name),
      );
      if (rule) {
        this.importVariable(variable, rule);
      } else {
        this.report(
          'error',
          `Figma variable "${collection}/${variable.name}" has no token. Add one with ` +
            `"$extensions": { "${FIGMA_EXTENSION}": { "variable": "${variable.id}", "name": "${variable.name}" } } ` +
            `and run the sync, or add it to "ignore" in ${CONFIG_FILE}.`,
        );
      }
    }
    for (const style of Object.values(this.figma.textStyles)) {
      if (
        !style.remote &&
        !this.figma.layerOnly.has(style.id) &&
        !ignored.has(style.id) &&
        !isLinked(style.id)
      ) {
        this.report(
          'error',
          `Figma text style "${style.name}" has no token. Add a typography token with ` +
            `"$extensions": { "${FIGMA_EXTENSION}": { "style": "${style.id}", "name": "${style.name}" } }, ` +
            `or add it to "ignore" in ${CONFIG_FILE}.`,
        );
      }
    }
  }

  /** Adds a token for a new variable of an import collection. */
  private importVariable(variable: FigmaVariable, rule: ImportRule): void {
    const key = new RegExp(rule.name).exec(variable.name)?.[1] as string;
    const path = [...rule.group, key];
    const id = path.join('.');
    const existing = this.tokens.get(id);
    const link: FigmaLink = { variable: variable.id, name: variable.name };
    if (existing) {
      this.report(
        'error',
        `${id}: links to the new Figma variable "${variable.name}".`,
        [
          {
            file: existing.file,
            path: [...this.linkPath(existing), 'variable'],
            value: variable.id,
          },
          {
            file: existing.file,
            path: [...this.linkPath(existing), 'name'],
            value: variable.name,
          },
        ],
      );
      return;
    }
    const groupType = [...this.tokens.values()].find(
      (entry) => entry.path.slice(0, -1).join('.') === rule.group.join('.'),
    )?.type;
    const value = literalFor(this.figma.resolve(variable), groupType);
    const size = parsePx(value) ?? 0;
    this.report(
      'error',
      `${id}: new token ${show(value)} from Figma "${variable.name}".`,
      [
        {
          file: rule.file,
          path,
          value: { $value: value, $extensions: { [FIGMA_EXTENSION]: link } },
          before: (key, sibling) => {
            const siblingSize = key.startsWith('$')
              ? null
              : parsePx((sibling as Partial<DesignToken> | undefined)?.$value);
            return siblingSize !== null && siblingSize > size;
          },
        },
      ],
    );
  }

  /** Lists code-owned tokens, unlinked library values and theme gaps. */
  private reportCodeOnly(): void {
    const codeOnly = [...this.tokens.values()].filter(
      (entry) => !this.targets.has(entry.id) && !this.styleParts.has(entry.id),
    );
    if (this.autoLineHeights > 0) {
      this.report(
        'info',
        `Line heights stay code-owned: ${this.autoLineHeights} linked Figma text styles use AUTO.`,
      );
    }
    if (codeOnly.length > 0) {
      this.report(
        'info',
        `Code-owned (no Figma variable or style): ${codeOnly.map((entry) => entry.id).join(', ')}.`,
      );
    }
    for (const theme of Object.keys(this.config.themes) as ThemeName[]) {
      const themed = this.themes.get(theme) ?? new Map();
      const gaps = codeOnly.filter(
        (entry) =>
          entry.type === 'color' &&
          referenceOf(entry.token.$value) &&
          !themed.has(entry.id),
      );
      if (gaps.length > 0) {
        this.report(
          'info',
          `No ${theme} value (falls back to the default): ${gaps.map((entry) => entry.id).join(', ')}.`,
        );
      }
    }
    if (this.figma.uncleanNames.size > 0) {
      this.report(
        'info',
        `Figma names with unusual whitespace (rename them in Figma): ${[...this.figma.uncleanNames].sort().join(', ')}.`,
      );
    }
    // A linked name covers every copy of a duplicated library.
    const linkedNames = new Set(
      [...this.targets.values()].map(
        (id) => (this.figma.variables[id] ?? this.figma.textStyles[id]).name,
      ),
    );
    const names = (records: { id: string; name: string }[]) =>
      [...new Set(records.map((record) => record.name))].sort().join(', ');
    const layerVariables = Object.values(this.figma.variables).filter(
      (variable) =>
        this.figma.layerOnly.has(variable.id) &&
        !linkedNames.has(variable.name),
    );
    const layerStyles = Object.values(this.figma.textStyles).filter(
      (style) =>
        this.figma.layerOnly.has(style.id) && !linkedNames.has(style.name),
    );
    if (layerVariables.length > 0) {
      this.report(
        'info',
        `Library variables bound on layers without a token: ${names(layerVariables)}.`,
      );
    }
    if (layerStyles.length > 0) {
      this.report(
        'info',
        `Library text styles used on layers without a token: ${names(layerStyles)}.`,
      );
    }
  }
}

/**
 * Compares the token sources with the Figma snapshot (by default the
 * committed one) and returns the issues, most severe first.
 */
export async function compareWithFigma(
  snapshot?: FigmaSnapshot,
): Promise<SyncIssue[]> {
  const config = await readSyncConfig();
  const figmaSnapshot =
    snapshot ?? (await readSnapshot(join(libRoot, config.snapshot)));
  if (figmaSnapshot.source.fileKey !== config.fileKey) {
    return [
      {
        level: 'error',
        message: `The snapshot is from Figma file ${figmaSnapshot.source.fileKey}, not ${config.fileKey} (${CONFIG_FILE}).`,
        edits: [],
      },
    ];
  }
  const tokens = flattenTokens(await readTokenFiles(TOKEN_SOURCES));
  const themes = new Map<ThemeName, Map<string, TokenEntry>>();
  for (const theme of Object.keys(config.themes) as ThemeName[]) {
    themes.set(
      theme,
      flattenTokens([await readTokenFile(THEMES[theme].source)]),
    );
  }
  const figma = new FigmaFile(figmaSnapshot, config.modes);
  const issues = new Comparison(config, figma, tokens, themes).run();
  const order: IssueLevel[] = ['error', 'warning', 'info'];
  return issues.sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level));
}

export function formatIssues(issues: SyncIssue[]): string {
  const marks: Record<IssueLevel, string> = {
    error: '✗',
    warning: '!',
    info: '·',
  };
  return issues
    .map(
      (issue) =>
        `${marks[issue.level]} ${issue.message}${issue.edits.length > 0 ? ' [sync fixes]' : ''}`,
    )
    .join('\n');
}
