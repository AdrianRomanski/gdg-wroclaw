/**
 * Updates the token sources from the Figma snapshot and regenerates
 * `src/generated/` (ADR-0026):
 *
 *   npx nx run design-system-tokens:sync-figma                 # committed snapshot
 *   npx nx run design-system-tokens:sync-figma --receive       # wait for the plugin
 *   npx nx run design-system-tokens:sync-figma --from=<file>   # a "Copy JSON" export
 *   npx nx run design-system-tokens:sync-figma --check         # report only
 *
 * Exits with 1 while errors remain that need a person (see the report).
 */
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { buildTokens } from './build-tokens.ts';
import {
  SNAPSHOT_PORT,
  readSnapshot,
  receiveSnapshot,
  writeSnapshot,
} from './figma-snapshot.ts';
import {
  compareWithFigma,
  formatIssues,
  readSyncConfig,
} from './figma-sync.ts';
import { libRoot, writeTokenEdits } from './token-files.ts';

/** Fixes can enable more fixes (a new link, then its value); stop after this. */
const MAX_PASSES = 3;

const { values } = parseArgs({
  options: {
    receive: { type: 'boolean' },
    from: { type: 'string' },
    check: { type: 'boolean' },
  },
});

const config = await readSyncConfig();
const snapshotPath = join(libRoot, config.snapshot);
if (values.receive) {
  console.log(
    `Waiting for the GDG Tokens Export plugin on http://localhost:${SNAPSHOT_PORT} …`,
  );
  await writeSnapshot(snapshotPath, await receiveSnapshot());
  console.log(`Saved ${config.snapshot}.`);
} else if (values.from) {
  await writeSnapshot(snapshotPath, await readSnapshot(resolve(values.from)));
  console.log(`Saved ${config.snapshot} from ${values.from}.`);
}

let issues = await compareWithFigma();
if (!values.check) {
  for (
    let pass = 0;
    pass < MAX_PASSES && issues.some((issue) => issue.edits.length > 0);
    pass++
  ) {
    const written = await writeTokenEdits(
      issues.flatMap((issue) => issue.edits),
    );
    written.forEach((file) => console.log(`Updated ${file}`));
    issues = await compareWithFigma();
  }
  await buildTokens();
  console.log('Regenerated src/generated/.');
}

console.log(`\n${formatIssues(issues) || 'The tokens match Figma.'}`);
const errors = issues.filter((issue) => issue.level === 'error');
if (errors.length > 0) {
  const fixable = errors.filter((issue) => issue.edits.length > 0).length;
  const manual = errors.length - fixable;
  console.error(
    `\n${errors.length} error(s): ${fixable} fixed by running the sync ` +
      `without --check, ${manual} to fix by hand.`,
  );
  process.exitCode = 1;
}
