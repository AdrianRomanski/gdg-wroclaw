/**
 * Reads and edits the DTCG token sources in place (ADR-0026). Edits go through
 * jsonc-parser, so key order and formatting survive (`JSON.parse` would move
 * integer-like keys such as `spacing.12` ahead of `$type`), and Prettier
 * formats the result.
 */
import { existsSync, globSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyEdits, modify, parse } from 'jsonc-parser';
import type { FormattingOptions } from 'jsonc-parser';
import * as prettier from 'prettier';

export const libRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Base token sources, built into `:root` (ADR-0008). */
export const TOKEN_SOURCES = 'tokens/**/*.tokens.json';

export interface DesignToken {
  $value: unknown;
  $type?: string;
  $description?: string;
  $extensions?: Record<string, unknown>;
}

export interface TokenFile {
  /** Path relative to the library root. */
  file: string;
  text: string;
  json: Record<string, unknown>;
}

export interface TokenEntry {
  /** Dot-separated token path, e.g. `color.blue-500`. */
  id: string;
  path: string[];
  file: string;
  /** `$type`, inherited from the closest group that sets it. */
  type: string | undefined;
  token: DesignToken;
}

export interface TokenEdit {
  file: string;
  path: string[];
  /** `undefined` removes the property (and groups left empty). */
  value: unknown;
  /** For a new property: insert it before the first sibling that matches. */
  before?: (key: string, value: unknown) => boolean;
}

const FORMATTING: FormattingOptions = {
  insertSpaces: true,
  tabSize: 2,
  eol: '\n',
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function readTokenFile(file: string): Promise<TokenFile> {
  const absolute = join(libRoot, file);
  const text = existsSync(absolute) ? await readFile(absolute, 'utf8') : '{}\n';
  return { file, text, json: JSON.parse(text) };
}

export async function readTokenFiles(pattern: string): Promise<TokenFile[]> {
  const files = globSync(pattern, { cwd: libRoot }).sort();
  return Promise.all(files.map(readTokenFile));
}

/** Lists every token (an object with `$value`) in `files`. */
export function flattenTokens(files: TokenFile[]): Map<string, TokenEntry> {
  const entries = new Map<string, TokenEntry>();
  const walk = (
    node: Record<string, unknown>,
    path: string[],
    type: string | undefined,
    file: string,
  ) => {
    const ownType = typeof node['$type'] === 'string' ? node['$type'] : type;
    if ('$value' in node) {
      const id = path.join('.');
      entries.set(id, {
        id,
        path,
        file,
        type: ownType,
        token: node as unknown as DesignToken,
      });
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith('$') && isObject(child)) {
        walk(child, [...path, key], ownType, file);
      }
    }
  };
  for (const { file, json } of files) {
    walk(json, [], undefined, file);
  }
  return entries;
}

function removeProperty(text: string, path: string[]): string {
  let result = applyEdits(
    text,
    modify(text, path, undefined, { formattingOptions: FORMATTING }),
  );
  // Drop the groups the removal left empty.
  for (let depth = path.length - 1; depth > 0; depth--) {
    const parentPath = path.slice(0, depth);
    const parent = valueAt(parse(result), parentPath);
    if (!isObject(parent) || Object.keys(parent).length > 0) {
      break;
    }
    result = applyEdits(
      result,
      modify(result, parentPath, undefined, {
        formattingOptions: FORMATTING,
      }),
    );
  }
  return result;
}

function valueAt(json: unknown, path: string[]): unknown {
  return path.reduce<unknown>(
    (node, key) => (isObject(node) ? node[key] : undefined),
    json,
  );
}

function editText(text: string, edit: TokenEdit): string {
  if (edit.value === undefined) {
    return removeProperty(text, edit.path);
  }
  const { before } = edit;
  // Siblings as they are now, including properties inserted by earlier edits.
  const parent = valueAt(parse(text), edit.path.slice(0, -1));
  return applyEdits(
    text,
    modify(text, edit.path, edit.value, {
      formattingOptions: FORMATTING,
      getInsertionIndex: (properties) => {
        const index = before
          ? properties.findIndex((key) => before(key, valueAt(parent, [key])))
          : -1;
        return index === -1 ? properties.length : index;
      },
    }),
  );
}

/**
 * Applies `edits` to the token files, formats them with Prettier and writes
 * the ones that changed. Returns their paths.
 */
export async function writeTokenEdits(edits: TokenEdit[]): Promise<string[]> {
  const byFile = new Map<string, TokenEdit[]>();
  for (const edit of edits) {
    byFile.set(edit.file, [...(byFile.get(edit.file) ?? []), edit]);
  }
  const written: string[] = [];
  for (const [file, fileEdits] of byFile) {
    const { text } = await readTokenFile(file);
    const absolute = join(libRoot, file);
    const edited = fileEdits.reduce(editText, text);
    const formatted = await prettier.format(edited, {
      ...(await prettier.resolveConfig(absolute)),
      filepath: absolute,
    });
    if (formatted !== text) {
      await mkdir(dirname(absolute), { recursive: true });
      await writeFile(absolute, formatted);
      written.push(file);
    }
  }
  return written;
}
