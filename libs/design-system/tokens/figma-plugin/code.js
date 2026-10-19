/**
 * GDG Tokens Export: a development plugin that snapshots the variables and
 * text styles of the open Figma file (ADR-0026). The snapshot has the shape of
 * the Figma REST API `GET /v1/files/:key/variables/local` response plus the
 * text styles, so it works on every Figma plan. Start the receiver with
 * `npx nx run design-system-tokens:sync-figma --receive`, run the plugin and
 * click "Send to repo" (or "Copy JSON" and pass the file with `--from`).
 *
 * - `variableCollections`, `variables` and `textStyles` hold the file's local
 *   variables and text styles, plus the library variables their aliases and
 *   bindings lead to (marked `remote`).
 * - `usage` holds the library variables and text styles that are bound on the
 *   file's layers but not reachable from the local ones. It changes whenever a
 *   layer does, so the drift check only warns about it.
 */
/* global figma, __html__ */

const VARIABLE_FIELDS = [
  'id',
  'name',
  'key',
  'variableCollectionId',
  'resolvedType',
  'valuesByMode',
  'description',
  'scopes',
  'codeSyntax',
  'hiddenFromPublishing',
  'remote',
];
const COLLECTION_FIELDS = [
  'id',
  'name',
  'key',
  'modes',
  'defaultModeId',
  'variableIds',
  'hiddenFromPublishing',
  'remote',
];
const TEXT_STYLE_FIELDS = [
  'id',
  'key',
  'name',
  'description',
  'fontName',
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'paragraphSpacing',
  'paragraphIndent',
  'textCase',
  'textDecoration',
  'boundVariables',
  'remote',
];
const PAINT_FIELDS = ['fills', 'strokes', 'effects', 'layoutGrids'];

/** Copies `fields` of a Figma object into a plain, JSON-serialisable object. */
function pick(source, fields) {
  const copy = {};
  for (const field of fields) {
    if (source[field] !== undefined) {
      copy[field] = JSON.parse(JSON.stringify(source[field]));
    }
  }
  return copy;
}

function byId(items, fields) {
  const result = {};
  for (const item of items) {
    result[item.id] = pick(item, fields);
  }
  return result;
}

/** Adds the ids of every variable alias nested in `value` to `ids`. */
function collectAliases(value, ids) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectAliases(item, ids));
  } else if (value && typeof value === 'object') {
    if (value.type === 'VARIABLE_ALIAS') {
      ids.add(value.id);
    } else {
      Object.values(value).forEach((item) => collectAliases(item, ids));
    }
  }
  return ids;
}

/**
 * Resolves the variables in `ids` that are not in `known`, following their
 * aliases. Library variables resolve as long as the file uses them.
 */
async function resolveVariables(ids, known, missing) {
  const found = {};
  const queue = [...ids];
  while (queue.length > 0) {
    const id = queue.pop();
    if (known[id] || found[id] || missing.has(id)) {
      continue;
    }
    const variable = await figma.variables.getVariableByIdAsync(id);
    if (!variable) {
      missing.add(id);
      continue;
    }
    found[id] = pick(variable, VARIABLE_FIELDS);
    queue.push(...collectAliases(found[id].valuesByMode, new Set()));
  }
  return found;
}

/** Resolves the collections of `variables` that are not in `known`. */
async function resolveCollections(variables, known) {
  const found = {};
  for (const { variableCollectionId: id } of Object.values(variables)) {
    if (known[id] || found[id]) {
      continue;
    }
    // Library collections may not resolve; the sync then flags their
    // variables if they have more than one mode.
    const collection = await figma.variables.getVariableCollectionByIdAsync(id);
    if (collection) {
      found[id] = pick(collection, COLLECTION_FIELDS);
    }
  }
  return found;
}

function textSegments(node) {
  try {
    return node.getStyledTextSegments([
      'textStyleId',
      'fills',
      'boundVariables',
    ]);
  } catch {
    return node.getStyledTextSegments(['textStyleId', 'fills']);
  }
}

/** Collects the variables and text styles bound on every layer of the file. */
async function collectUsage() {
  await figma.loadAllPagesAsync();
  const variableIds = new Set();
  const textStyleIds = new Set();
  for (const node of figma.root.findAll()) {
    collectAliases(node.boundVariables, variableIds);
    for (const field of PAINT_FIELDS) {
      if (field in node) {
        collectAliases(node[field], variableIds);
      }
    }
    if (node.type === 'TEXT') {
      for (const segment of textSegments(node)) {
        collectAliases(segment.boundVariables, variableIds);
        collectAliases(segment.fills, variableIds);
        if (segment.textStyleId) {
          textStyleIds.add(segment.textStyleId);
        }
      }
    }
  }
  return { variableIds, textStyleIds };
}

async function resolveTextStyles(ids, known) {
  const found = {};
  for (const id of ids) {
    if (known[id]) {
      continue;
    }
    const style = await figma.getStyleByIdAsync(id);
    if (style && style.type === 'TEXT') {
      found[id] = pick(style, TEXT_STYLE_FIELDS);
    }
  }
  return found;
}

async function createSnapshot() {
  const missing = new Set();
  const localCollections = byId(
    await figma.variables.getLocalVariableCollectionsAsync(),
    COLLECTION_FIELDS,
  );
  const localVariables = byId(
    await figma.variables.getLocalVariablesAsync(),
    VARIABLE_FIELDS,
  );
  const textStyles = byId(
    await figma.getLocalTextStylesAsync(),
    TEXT_STYLE_FIELDS,
  );

  const linkedIds = collectAliases(
    [
      Object.values(localVariables).map((variable) => variable.valuesByMode),
      Object.values(textStyles).map((style) => style.boundVariables),
    ],
    new Set(),
  );
  const variables = {
    ...localVariables,
    ...(await resolveVariables(linkedIds, localVariables, missing)),
  };
  const variableCollections = {
    ...localCollections,
    ...(await resolveCollections(variables, localCollections)),
  };

  const used = await collectUsage();
  const usedTextStyles = await resolveTextStyles(used.textStyleIds, textStyles);
  collectAliases(
    Object.values(usedTextStyles).map((style) => style.boundVariables),
    used.variableIds,
  );
  const usedVariables = await resolveVariables(
    used.variableIds,
    variables,
    missing,
  );

  let fileKey = null;
  try {
    fileKey = figma.fileKey || null;
  } catch {
    // figma.fileKey is only available to private and development plugins.
  }
  return {
    source: {
      exporter: 'gdg-tokens-export-plugin',
      fileKey,
      fileName: figma.root.name,
      exportedAt: new Date().toISOString(),
    },
    variableCollections,
    variables,
    textStyles,
    usage: {
      variableCollections: await resolveCollections(
        usedVariables,
        variableCollections,
      ),
      variables: usedVariables,
      textStyles: usedTextStyles,
    },
    missingVariableIds: [...missing].sort(),
  };
}

figma.showUI(__html__, { width: 360, height: 252, themeColors: true });

createSnapshot().then(
  (snapshot) => figma.ui.postMessage({ type: 'snapshot', snapshot }),
  (error) => figma.ui.postMessage({ type: 'error', message: String(error) }),
);

figma.ui.onmessage = (message) => {
  if (message.type === 'notify') {
    figma.notify(message.text);
  } else if (message.type === 'close') {
    figma.closePlugin();
  }
};
