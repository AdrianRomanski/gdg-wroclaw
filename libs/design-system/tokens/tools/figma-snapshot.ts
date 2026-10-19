/**
 * The Figma snapshot: variables and text styles exported by the
 * `figma-plugin/` development plugin (ADR-0026). Its variables have the shape
 * of the Figma REST API `GET /v1/files/:key/variables/local` response.
 *
 * The top-level records hold the file's local variables and text styles plus
 * the library variables they lead to (`remote: true`). `usage` holds library
 * variables and text styles that are only bound on layers.
 */
import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaAlias {
  type: 'VARIABLE_ALIAS';
  id: string;
}

export type FigmaValue = FigmaColor | FigmaAlias | number | string | boolean;

export interface FigmaVariable {
  id: string;
  name: string;
  key?: string;
  variableCollectionId: string;
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  valuesByMode: Record<string, FigmaValue>;
  description?: string;
  scopes?: string[];
  hiddenFromPublishing?: boolean;
  remote?: boolean;
}

export interface FigmaCollection {
  id: string;
  name: string;
  modes: { modeId: string; name: string }[];
  defaultModeId: string;
  variableIds: string[];
  remote?: boolean;
}

export interface FigmaUnitValue {
  unit: 'PIXELS' | 'PERCENT' | 'AUTO';
  value?: number;
}

export interface FigmaTextStyle {
  id: string;
  name: string;
  description?: string;
  fontName: { family: string; style: string };
  fontSize: number;
  lineHeight: FigmaUnitValue;
  letterSpacing: FigmaUnitValue;
  textCase?: string;
  textDecoration?: string;
  boundVariables?: Record<string, FigmaAlias>;
  remote?: boolean;
}

export interface FigmaRecords {
  /** Library collections are missing when Figma could not resolve them. */
  variableCollections: Record<string, FigmaCollection>;
  variables: Record<string, FigmaVariable>;
  textStyles: Record<string, FigmaTextStyle>;
}

export interface FigmaSnapshot extends FigmaRecords {
  source: {
    exporter: string;
    fileKey: string | null;
    fileName: string;
    exportedAt: string;
  };
  /** Library variables and text styles that are only bound on layers. */
  usage: FigmaRecords;
  /** Aliased or bound variables that no longer exist (deleted in a library). */
  missingVariableIds: string[];
}

/** Port of the local receiver the plugin's "Send to repo" button posts to. */
export const SNAPSHOT_PORT = 4747;

export function isAlias(value: FigmaValue): value is FigmaAlias {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as FigmaAlias).type === 'VARIABLE_ALIAS'
  );
}

function isRecords(value: unknown): boolean {
  const records = value as Partial<FigmaRecords> | null;
  return (
    typeof records?.variables === 'object' &&
    typeof records.variableCollections === 'object' &&
    typeof records.textStyles === 'object'
  );
}

function assertSnapshot(value: unknown): asserts value is FigmaSnapshot {
  const snapshot = value as Partial<FigmaSnapshot> | null;
  if (
    !snapshot?.source ||
    !isRecords(snapshot) ||
    !isRecords(snapshot.usage) ||
    !Array.isArray(snapshot.missingVariableIds)
  ) {
    throw new Error(
      'Not a GDG token snapshot: expected source, variableCollections, variables, textStyles, usage and missingVariableIds. Re-run the latest GDG Tokens Export plugin.',
    );
  }
}

function sortRecord<T>(
  record: Record<string, T>,
  key: (item: T) => string,
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(record).sort(([, a], [, b]) =>
      key(a).localeCompare(key(b), 'en'),
    ),
  );
}

function sortRecords(
  records: FigmaRecords,
  collections: Record<string, FigmaCollection>,
): FigmaRecords {
  return {
    variableCollections: sortRecord(records.variableCollections, (c) => c.name),
    variables: sortRecord(
      records.variables,
      (v) => `${collections[v.variableCollectionId]?.name ?? ''}/${v.name}`,
    ),
    textStyles: sortRecord(records.textStyles, (s) => s.name),
  };
}

/** Sorts collections, variables and text styles by name for stable diffs. */
export function normalizeSnapshot(snapshot: FigmaSnapshot): FigmaSnapshot {
  const collections = {
    ...snapshot.variableCollections,
    ...snapshot.usage.variableCollections,
  };
  return {
    source: snapshot.source,
    ...sortRecords(snapshot, collections),
    usage: sortRecords(snapshot.usage, collections),
    missingVariableIds: [...snapshot.missingVariableIds].sort(),
  };
}

export async function readSnapshot(path: string): Promise<FigmaSnapshot> {
  const snapshot: unknown = JSON.parse(await readFile(path, 'utf8'));
  assertSnapshot(snapshot);
  return snapshot;
}

export async function writeSnapshot(
  path: string,
  snapshot: FigmaSnapshot,
): Promise<void> {
  await writeFile(
    path,
    `${JSON.stringify(normalizeSnapshot(snapshot), null, 2)}\n`,
  );
}

/**
 * Waits for the plugin to post a snapshot to `http://localhost:<port>/`.
 * Listens on the IPv4 and IPv6 loopback addresses only.
 */
export function receiveSnapshot(port = SNAPSHOT_PORT): Promise<FigmaSnapshot> {
  return new Promise((resolve, reject) => {
    const handle = (request: IncomingMessage, response: ServerResponse) => {
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Private-Network', 'true');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      if (request.method !== 'POST') {
        response.writeHead(204).end();
        return;
      }
      let body = '';
      request.setEncoding('utf8');
      request.on('data', (chunk: string) => (body += chunk));
      request.on('end', () => {
        try {
          const snapshot: unknown = JSON.parse(body);
          assertSnapshot(snapshot);
          response.writeHead(200, { 'Content-Type': 'text/plain' }).end('ok');
          servers.forEach((server) => server.close());
          resolve(snapshot);
        } catch (error) {
          response.writeHead(400, { 'Content-Type': 'text/plain' });
          response.end(String(error));
        }
      });
    };
    const servers = ['127.0.0.1', '::1'].map((host) =>
      createServer(handle).listen(port, host),
    );
    servers[0].on('error', reject);
    // The IPv6 loopback is optional (it may be disabled).
    servers[1].on('error', () => undefined);
  });
}
