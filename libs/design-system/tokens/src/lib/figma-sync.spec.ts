import { join } from 'node:path';
import { findNodeAtLocation, parseTree } from 'jsonc-parser';
import { readSnapshot } from '../../tools/figma-snapshot.ts';
import type {
  FigmaSnapshot,
  FigmaVariable,
} from '../../tools/figma-snapshot.ts';
import { compareWithFigma, readSyncConfig } from '../../tools/figma-sync.ts';
import type { SyncIssue } from '../../tools/figma-sync.ts';
import {
  editTokenText,
  libRoot,
  readTokenFile,
} from '../../tools/token-files.ts';

let committed: FigmaSnapshot;

beforeAll(async () => {
  const config = await readSyncConfig();
  committed = await readSnapshot(join(libRoot, config.snapshot));
});

const withLevel = (issues: SyncIssue[], level: SyncIssue['level']) =>
  issues.filter((issue) => issue.level === level);

/** A copy of the committed snapshot to change like a designer would. */
function edit(change: (snapshot: FigmaSnapshot) => void): FigmaSnapshot {
  const snapshot = structuredClone(committed);
  change(snapshot);
  return snapshot;
}

function required<T>(value: T | undefined, what: string): T {
  if (value === undefined) {
    throw new Error(`No ${what} in the snapshot`);
  }
  return value;
}

function variable(snapshot: FigmaSnapshot, name: string): FigmaVariable {
  return required(
    [
      ...Object.values(snapshot.variables),
      ...Object.values(snapshot.usage.variables),
    ].find((candidate) => candidate.name.replace(/\s+/gu, ' ') === name),
    `variable "${name}"`,
  );
}

function collectionId(snapshot: FigmaSnapshot, name: string): string {
  return required(
    Object.values(snapshot.variableCollections).find(
      (collection) => collection.name === name,
    ),
    `collection "${name}"`,
  ).id;
}

/** Adds a variable with one value to the collection of `template`. */
function addVariable(
  snapshot: FigmaSnapshot,
  template: string,
  id: string,
  name: string,
  value: FigmaVariable['valuesByMode'][string],
): FigmaVariable {
  const source = variable(snapshot, template);
  snapshot.variables[id] = {
    ...source,
    id,
    name,
    valuesByMode: { [Object.keys(source.valuesByMode)[0]]: value },
  };
  return snapshot.variables[id];
}

/** Drops library collections, as when Figma can't resolve them. */
function dropCollections(snapshot: FigmaSnapshot, names: string[]) {
  for (const [id, collection] of Object.entries(
    snapshot.usage.variableCollections,
  )) {
    if (names.includes(collection.name)) {
      delete snapshot.usage.variableCollections[id];
    }
  }
}

/** The property keys of the object at `path`, in the order of the text. */
function keysAt(text: string, path: string[]): string[] {
  const node = findNodeAtLocation(required(parseTree(text), 'JSON'), path);
  return (node?.children ?? []).map((property) =>
    String(property.children?.[0].value),
  );
}

function setValue(
  variable: FigmaVariable,
  value: FigmaVariable['valuesByMode'][string],
) {
  for (const modeId of Object.keys(variable.valuesByMode)) {
    variable.valuesByMode[modeId] = value;
  }
}

describe('Figma sync (ADR-0026)', () => {
  it('tokens match the committed Figma snapshot (run `nx run design-system-tokens:sync-figma`)', async () => {
    const issues = await compareWithFigma();
    withLevel(issues, 'warning').forEach((issue) =>
      console.warn(issue.message),
    );
    expect(withLevel(issues, 'error').map((issue) => issue.message)).toEqual(
      [],
    );
  });

  it('updates a token when its Figma value changes', async () => {
    const snapshot = edit((s) =>
      setValue(variable(s, 'Core Colors/Blue 500'), { r: 1, g: 0, b: 0, a: 1 }),
    );
    const [issue] = withLevel(await compareWithFigma(snapshot), 'error');
    expect(issue.message).toContain('color.blue-500');
    expect(issue.edits).toEqual([
      {
        file: 'tokens/color/primitive.tokens.json',
        path: ['color', 'blue-500', '$value'],
        value: '#ff0000',
      },
    ]);
  });

  it('keeps semantic tokens as references to the aliased palette token', async () => {
    const snapshot = edit((s) => {
      const target = variable(s, 'Core Colors/Green 500');
      setValue(variable(s, 'Colors/Brand-Blue-Primary'), {
        type: 'VARIABLE_ALIAS',
        id: target.id,
      });
    });
    const edits = withLevel(await compareWithFigma(snapshot), 'error').flatMap(
      (issue) => issue.edits,
    );
    expect(edits).toContainEqual({
      file: 'tokens/color/semantic.tokens.json',
      path: ['color', 'brand', 'blue', 'primary', '$value'],
      value: '{color.green-500}',
    });
  });

  it('follows a renamed variable by its id', async () => {
    const snapshot = edit((s) => {
      variable(s, 'Core Colors/Blue 500').name = 'Core Colors/Blue 550';
    });
    const [issue] = withLevel(await compareWithFigma(snapshot), 'error');
    expect(issue.edits).toEqual([
      {
        file: 'tokens/color/primitive.tokens.json',
        path: ['color', 'blue-500', '$extensions', 'gdg.figma', 'name'],
        value: 'Core Colors/Blue 550',
      },
    ]);
  });

  it('relinks by name when a variable is re-created', async () => {
    const snapshot = edit((s) => {
      const original = variable(s, 'spacing-24');
      delete s.variables[original.id];
      s.variables['VariableID:999:1'] = { ...original, id: 'VariableID:999:1' };
    });
    const [issue] = withLevel(await compareWithFigma(snapshot), 'error');
    expect(issue.edits).toEqual([
      expect.objectContaining({
        path: ['spacing', '24', '$extensions', 'gdg.figma', 'variable'],
        value: 'VariableID:999:1',
      }),
    ]);
  });

  it('leaves a deleted variable to a person', async () => {
    const snapshot = edit((s) => {
      delete s.variables[variable(s, 'Border/Border-Disabled').id];
    });
    const [issue] = withLevel(await compareWithFigma(snapshot), 'error');
    expect(issue.message).toContain('color.border.disabled');
    expect(issue.edits).toEqual([]);
  });

  it('only warns when a linked library variable is gone', async () => {
    const snapshot = edit((s) => {
      for (const [id, candidate] of Object.entries(s.usage.variables)) {
        if (candidate.name === 'Page Padding/padding-global') {
          delete s.usage.variables[id];
        }
      }
    });
    const issues = await compareWithFigma(snapshot);
    expect(withLevel(issues, 'error')).toEqual([]);
    expect(withLevel(issues, 'warning')[0].message).toContain(
      'layout.padding-global',
    );
  });

  it('adds a token for a new spacing step', async () => {
    const snapshot = edit((s) =>
      addVariable(s, 'spacing-64', 'VariableID:999:2', 'spacing-128', 128),
    );
    const [issue] = withLevel(await compareWithFigma(snapshot), 'error');
    expect(issue.edits).toEqual([
      expect.objectContaining({
        file: 'tokens/spacing.tokens.json',
        path: ['spacing', '128'],
        value: {
          $value: '128px',
          $extensions: {
            'gdg.figma': { variable: 'VariableID:999:2', name: 'spacing-128' },
          },
        },
      }),
    ]);
  });

  it('links a code-owned token when Figma adds a variable with its value', async () => {
    const snapshot = edit((s) =>
      addVariable(s, 'spacing-64', 'VariableID:999:4', 'spacing-80', 80),
    );
    const [issue] = withLevel(await compareWithFigma(snapshot), 'error');
    const link = ['spacing', '80', '$extensions', 'gdg.figma'];
    expect(issue.edits).toEqual([
      {
        file: 'tokens/spacing.tokens.json',
        path: [...link, 'variable'],
        value: 'VariableID:999:4',
      },
      {
        file: 'tokens/spacing.tokens.json',
        path: [...link, 'name'],
        value: 'spacing-80',
      },
    ]);
  });

  it('leaves a code-owned token to a person when Figma adds another value', async () => {
    const snapshot = edit((s) =>
      addVariable(s, 'spacing-64', 'VariableID:999:4', 'spacing-80', 72),
    );
    const [issue] = withLevel(await compareWithFigma(snapshot), 'error');
    expect(issue.message).toContain('spacing.80');
    expect(issue.message).toContain('72px');
    expect(issue.edits).toEqual([]);
  });

  it('reports a new spacing variable it cannot turn into a token', async () => {
    const snapshot = edit((s) => {
      addVariable(
        s,
        'spacing-64',
        'VariableID:999:5',
        'spacing-auto',
        'auto',
      ).resolvedType = 'STRING';
      addVariable(s, 'spacing-64', 'VariableID:999:6', 'spacing-1.5', 1.5);
    });
    const issues = withLevel(await compareWithFigma(snapshot), 'error');
    expect(issues.map((issue) => issue.message)).toEqual([
      expect.stringContaining(
        '"spacing/spacing-auto": Figma value "auto" can\'t become a "dimension" token',
      ),
      expect.stringContaining(
        '"spacing/spacing-1.5": "1.5" can\'t be a token name',
      ),
    ]);
    expect(issues.flatMap((issue) => issue.edits)).toEqual([]);
  });

  it('only warns when a library collection is missing', async () => {
    const snapshot = edit((s) =>
      dropCollections(s, ['Spacing & Sizing', 'Typography']),
    );
    const issues = await compareWithFigma(snapshot);
    expect(withLevel(issues, 'error')).toEqual([]);
    expect(withLevel(issues, 'warning').map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('layout.padding-global'),
        expect.stringContaining('font.size.display-1'),
      ]),
    );
  });

  it('does not relink by name when the value cannot be read', async () => {
    const snapshot = edit((s) => {
      const copies = Object.values(s.usage.variables).filter(
        (candidate) => candidate.name === 'Page Padding/padding-global',
      );
      copies.forEach((copy) => delete s.usage.variables[copy.id]);
      s.usage.variables['VariableID:999:7'] = {
        ...copies[0],
        id: 'VariableID:999:7',
      };
      dropCollections(s, ['Spacing & Sizing']);
    });
    const [issue] = withLevel(
      await compareWithFigma(snapshot),
      'warning',
    ).filter((candidate) =>
      candidate.message.startsWith('layout.padding-global:'),
    );
    expect(issue.message).toContain("can't be read");
    expect(issue.edits).toEqual([]);
  });

  it('writes Light mode differences to the light theme', async () => {
    const snapshot = edit((s) => {
      const content = variable(s, 'Content/Content');
      const collection = s.variableCollections[content.variableCollectionId];
      const light = required(
        collection.modes.find((mode) => mode.name === 'Light mode'),
        'Light mode',
      );
      content.valuesByMode[light.modeId] = {
        type: 'VARIABLE_ALIAS',
        id: variable(s, 'Core Colors/Blue 500').id,
      };
    });
    const [issue] = withLevel(await compareWithFigma(snapshot), 'error');
    expect(issue.edits).toEqual([
      {
        file: 'themes/light.tokens.json',
        path: ['color', 'content', 'default', '$value'],
        value: '{color.blue-500}',
      },
    ]);
  });

  it('asks for a token when a new semantic variable appears', async () => {
    const snapshot = edit((s) => {
      const template = variable(s, 'Content/Content');
      s.variables['VariableID:999:3'] = {
        ...template,
        id: 'VariableID:999:3',
        name: 'Content/Content-Error',
        variableCollectionId: collectionId(s, 'tokens'),
      };
    });
    const [issue] = withLevel(await compareWithFigma(snapshot), 'error');
    expect(issue.message).toContain(
      '"tokens/Content/Content-Error" has no token',
    );
    expect(issue.edits).toEqual([]);
  });

  it('reports a changed text style for a person to resolve', async () => {
    const snapshot = edit((s) => {
      const style = required(
        Object.values(s.textStyles).find(
          (candidate) => candidate.name === 'Headings Bold/H1',
        ),
        'text style "Headings Bold/H1"',
      );
      style.fontSize = 40;
    });
    const [issue] = withLevel(await compareWithFigma(snapshot), 'error');
    expect(issue.message).toContain('font.heading-1');
    expect(issue.message).toContain('font size 40px');
    expect(issue.edits).toEqual([]);
  });

  it('rejects a snapshot of another Figma file', async () => {
    const snapshot = edit((s) => {
      s.source.fileKey = 'another-file';
    });
    const [issue] = withLevel(await compareWithFigma(snapshot), 'error');
    expect(issue.message).toContain('another-file');
  });
});

describe('Token edits (ADR-0026)', () => {
  it('inserts new steps in order of value', async () => {
    const snapshot = edit((s) => {
      addVariable(s, 'spacing-64', 'VariableID:999:8', 'spacing-5', 5);
      addVariable(s, 'spacing-64', 'VariableID:999:9', 'spacing-128', 128);
    });
    const edits = (await compareWithFigma(snapshot)).flatMap(
      (issue) => issue.edits,
    );
    const { text } = await readTokenFile('tokens/spacing.tokens.json');
    const keys = keysAt(editTokenText(text, edits), ['spacing']);
    expect(keys.slice(keys.indexOf('4'), keys.indexOf('4') + 3)).toEqual([
      '4',
      '5',
      '6',
    ]);
    expect(keys[keys.length - 1]).toBe('128');
  });

  it('changes nothing when the same edits are applied again', async () => {
    const snapshot = edit((s) =>
      setValue(variable(s, 'Core Colors/Blue 500'), { r: 1, g: 0, b: 0, a: 1 }),
    );
    const edits = (await compareWithFigma(snapshot)).flatMap(
      (issue) => issue.edits,
    );
    const { text } = await readTokenFile('tokens/color/primitive.tokens.json');
    const once = editTokenText(text, edits);
    expect(once).toContain('"$value": "#ff0000"');
    expect(editTokenText(once, edits)).toBe(once);
  });

  it('removes the groups a removal leaves empty', () => {
    const text = JSON.stringify({
      color: {
        content: { default: { $value: '{color.black-02}' } },
        border: { default: { $value: '{color.black-02}' } },
      },
    });
    const edited = editTokenText(text, [
      {
        file: 'themes/light.tokens.json',
        path: ['color', 'content', 'default'],
        value: undefined,
      },
    ]);
    expect(JSON.parse(edited)).toEqual({
      color: { border: { default: { $value: '{color.black-02}' } } },
    });
  });
});
