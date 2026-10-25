# ADR-0026: Export Figma Variables with a Development Plugin and Sync Them into the Tokens

- **Status**: Accepted
- **Date**: 2026-10-20
- **Deciders**: GDG Wrocław Core Team
- **Consulted**: Designers, Frontend Working Group
- **Informed**: All project contributors

---

## Context and Problem Statement

The design tokens are W3C DTCG JSON built with Style Dictionary ([ADR-0008](0008-design-tokens-pipeline-dtcg-style-dictionary.md)). Their values were copied from Figma by hand, and each token recorded its Figma **name** in `$extensions["gdg.figma"]`. Nothing checked that the two still agreed. ADR-0008 left "automate export and drift detection" as a next step. Issue #11 asks for it: an ADR, one command that updates `tokens/*.tokens.json` from Figma, a CI check that reports differences, and token and Storybook tests that stay green after a sync.

The designers are turning the **GDG-ds** file into Figma Variables (issue #9, ongoing). An export of the file on 2026-10-20 (refreshed on 2026-10-24, with the same content) has:

- **Local variables**: `Colors Primitives` (20 colors), `tokens` (16 semantic colors, with **Light mode** and **Dark mode**), `spacing` (16) and `radius` (12). The spacing and radius variables alias a numeral scale in a linked library.
- **27 local text styles**: `Headings Bold/H1–H9`, `Headings Regular/H1–H9` and `Paragraph/P1–P9`, all with **AUTO** line height.
- **Library values bound on layers**: the page padding, section padding, container and max-width variables, `Text Sizes/*` and `Color/Neutral Darkest` come from a linked UI kit with **Desktop** and **Mobile** modes. Layers are bound to **two copies** of that kit, so most of those variables exist twice, under different ids (for example `Page Padding/padding-global`).

The file is not on a Figma **Enterprise** plan, and the Figma REST API for variables (`GET /v1/files/:key/variables/local`) requires one.

## Decision Drivers

- Works on our Figma plan, without paid add-ons.
- One command updates the token sources and the generated files.
- CI catches drift without Figma access or secrets.
- Links survive renames in Figma; work in progress in Figma (#9) never breaks CI.
- Code-owned decisions, such as the WCAG fix in [ADR-0012](0012-primary-button-text-color-for-wcag-aa.md) or the Event page colors in [ADR-0025](0025-event-page-template.md), are never overwritten.
- Reviewable, stable diffs: no reordered keys and no noise.

## Considered Options

### Export

1. **Figma REST API** with a personal access token, run in CI.
2. **Tokens Studio** plugin, exporting DTCG.
3. **Figma Dev Mode MCP server** (`get_variable_defs`).
4. **Our own development plugin** that exports a snapshot, plus a local sync script.

### Drift check

1. Compare the tokens with **live Figma** in CI.
2. Compare the tokens with a **committed snapshot** of Figma.

### Link between a token and Figma

1. By Figma **name**.
2. By Figma **id**, with the name as a fallback.

## Decision Outcome

Chosen: **our own development plugin**, a **committed snapshot** with an offline drift test, and links **by id with a name fallback**. The REST API needs Enterprise. Tokens Studio keeps its own token store, a second source of truth. The MCP server only returns resolved values of variables bound under one layer, with no collections, aliases or modes.

### Export: the GDG Tokens Export plugin (`libs/design-system/tokens/figma-plugin/`)

- A Figma **development plugin**, imported once from `manifest.json` in the Figma desktop app (Plugins → Development → Import plugin from manifest…). It only reads; it never changes the file.
- It reads the local collections, variables and text styles through the Plugin API, follows aliases into linked libraries, and walks every layer to collect the library variables and text styles bound there.
- It writes a **snapshot**: the shape of the REST API response (`variableCollections`, `variables`) plus `textStyles`, a `usage` section for values that are only bound on layers, `missingVariableIds` and a `source` block with the file key, file name and export time.
- **Send to repo** posts the snapshot to a receiver on `localhost:4747` (`sync-figma --receive`); **Copy JSON** is the fallback (`sync-figma --from=<file>`). Network access is limited to that address in development.
- The receiver listens on the loopback addresses only. It refuses requests from web pages (any `Origin` other than the plugin's sandboxed `null` or `https://www.figma.com`) and snapshots of another Figma file, and keeps waiting. A snapshot of another file is never saved, and `--check` saves nothing.
- The snapshot is committed as `figma/gdg-ds.figma.json`, sorted by name for stable diffs and excluded from Prettier. The file key is in `figma/sync.config.json`; the repository is public, and so is the key.

### Links

A token is **linked** when its `$extensions["gdg.figma"]` has a `variable` or `style` id:

```json
"gdg.figma": {
  "variable": "VariableID:1:131",
  "name": "Core Colors/Blue 500",
  "group": "Core colors",
  "node": "1:37"
}
```

- `name` is the full Figma name; the sync keeps it up to date. `group` and `node` stay code-owned (the Storybook Colors page groups swatches by `group`).
- `library: true` marks a link to a variable in a linked library. Drift there is only a **warning**, as is a library value the sync can't read, because those values can leave the snapshot when a layer is deleted.
- Every other token is **code-owned**, and the sync never changes it.

### Sync (`tools/sync-figma.ts`)

| Change in Figma                                | What the sync does                                                                                                                                                                                |
| :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A linked variable's value or alias changes     | Updates `$value`, as a reference when Figma aliases a linked variable (`{color.off-white}`)                                                                                                       |
| A linked variable or style is renamed          | Updates `name` (the id is unchanged)                                                                                                                                                              |
| A linked id is gone, but the name exists       | Relinks to it, if every variable with that name has the same, readable value (the duplicated kit)                                                                                                 |
| A linked variable or style is deleted          | Reports an error for a person: remove the link, or link another one                                                                                                                               |
| A new variable in `spacing` or `radius`        | Adds a token (`spacing-128` → `spacing.128`), in order of value (`import` rules in the config). A code-owned token with that name is linked only if its value matches; otherwise a person decides |
| Any other new local variable or text style     | Reports an error with the JSON to add, unless it is listed in `ignore`                                                                                                                            |
| A linked text style changes                    | Reports family, weight, size, letter spacing, decoration or case differences, for a person to decide                                                                                              |
| A collection has several modes                 | Reads the mode set in `modes`: `tokens` → Dark mode; library Spacing & Sizing, Typography → Desktop                                                                                               |
| Light mode differs from the default (ADR-0027) | Writes the difference to `themes/light.tokens.json`                                                                                                                                               |
| A Figma name has unusual whitespace (`U+2028`) | Compares the cleaned name and lists it, so it can be fixed in Figma                                                                                                                               |

- Text styles are **checked, not written**. In code they share scale steps (`font.size.1` is used by Heading 1, Paragraph 1 and Mono 1, and is paired with `line-height.1`). Whether a new size changes the step or moves the style to another step is a design decision.
- **Line heights stay code-owned.** Figma uses AUTO line height on every style. CSS `normal` depends on the font, and the existing 36/46 … 12/16 px scale is relied on by components.
- Edits go through `jsonc-parser`, which changes the JSON text in place. `JSON.parse` would move integer-like keys (`spacing.12`) ahead of `$type`. The edited files are formatted with Prettier, and the generated files are rebuilt. A second run changes nothing.
- The report lists code-owned tokens, roles without a Light value, and library values that have no token. Those lists are input for #9.

### Commands

```sh
npx nx run design-system-tokens:sync-figma --receive      # run the plugin, click "Send to repo"
npx nx run design-system-tokens:sync-figma --from=<file>  # a "Copy JSON" export
npx nx run design-system-tokens:sync-figma                # re-apply the committed snapshot
npx nx run design-system-tokens:sync-figma --check        # report only, saves nothing; exits 1 on errors
```

### CI

`src/lib/figma-sync.spec.ts` compares the tokens with the committed snapshot and fails on errors, so the existing `nx test` step in CI runs it. CI needs no Figma token, and changes in Figma never break CI until someone exports and commits them. The same spec checks each sync rule against edited copies of the snapshot.

### First sync (2026-10-20)

- **All values already matched.** That covers the 20 palette and 16 semantic colors (Dark mode), the spacing, radius and layout values, and the family, size and weight of all 27 text styles.
- Links now use ids:
  - 100 of the 156 tokens are linked: 73 to variables (including the 12 new steps below) and 27 to text styles;
  - 8 of them point at library variables: the 6 layout tokens, `font.size.display-1` and `color.neutral-darkest`;
  - the typography links use the current style names (`Headings Bold/H1`, not `Heading 1` / `Heading Styles - Bold`).
- `spacing.32` and `spacing.48` link to their new variables. `color.background.default` links to `Background/Background` instead of the primitive `Grayscale/Black 02`; the output is unchanged.
- New tokens for the GDG-ds steps the code lacked: `spacing.{2,3,6,10,36}` and `radius.{none,4,6,20,24,32,48}`. All existing CSS custom properties keep their names.
- The composite `font.display-1` is no longer linked; its size `font.size.display-1` is.

New dev dependency: `jsonc-parser` (~3.3). It was already installed through Nx and the Angular CLI.

### Positive Consequences

- One command brings Figma changes into code, and CI reports drift on every pull request.
- Links survive renames and re-created variables, and the report says exactly what changed.
- Works on any Figma plan, with no secrets in CI.
- The report turns the open design work (#9) into concrete lists.

### Negative Consequences / Trade-offs

- Exporting is manual: someone runs the plugin in the Figma desktop app. Nothing notices a Figma change until then.
- The snapshot (about 150 kB) is committed, and every export shows up in the diff.
- Text style changes still need a person.
- Library values (layout sizes, `Text Sizes/Heading 2`) are only as stable as the layers that use them.

## Pros and Cons of the Options

### Figma REST API in CI

- **Good**, because it is fully automatic and could run on a schedule.
- **Bad**, because the variables endpoints require an Enterprise plan, and a token would live in CI secrets.

### Tokens Studio

- **Good**, because it is mature and exports DTCG.
- **Bad**, because it keeps its own copy of the tokens (a second source of truth) with its own format and workflow.

### Dev Mode MCP server

- **Good**, because it is already running for design work.
- **Bad**, because it returns only resolved values of the variables bound under one layer: no collections, aliases or modes.

### Our own plugin and a committed snapshot

- **Good**, because it gets everything the Plugin API sees, on any plan, and the drift check runs offline.
- **Bad**, because the export is a manual step, and the plugin is ours to maintain.

### Live Figma in CI

- **Good**, because it notices every change in Figma.
- **Bad**, because it needs the REST API (Enterprise) and a token in CI, and work in progress in Figma (#9) would break CI.

### A committed snapshot

- **Good**, because the check runs offline, and every export is a reviewable diff.
- **Bad**, because it is only as fresh as the last export.

### Links by name

- **Good**, because they are readable.
- **Bad**, because a rename in Figma breaks the link, and the duplicated kit has the same names under different ids.

### Links by id, with the name as a fallback

- **Good**, because they survive renames, and the name still finds a re-created variable.
- **Bad**, because ids are unreadable, so the link also keeps the name.

## Implementation Guidelines / Next Steps

1. **To change a token that is in Figma**: change Figma first, then run the plugin and the sync. Edit the JSON by hand only for code-owned tokens.
2. Review the sync report with the designers. Open items for #9:
   - **Roles without a Figma variable**:
     - `content.on-brand` (ADR-0012), `content.error` and `border.error`;
     - `content.muted`, `background.raised`, `background.brand-subtle` and `border.subtle`, with `gray-300`, `gray-600`, `gray-850` and `navy-800` (ADR-0025);
     - `spacing.80` and `layout.max-width-xlarge`;
     - the Mono text styles.
   - **Name fixes**: the six `Grayscale/Alpha…` names contain a `U+2028` line separator, and `Core Colors/red 500` is lower case.
   - **The duplicated UI kit**: bind layers to one copy, or to GDG-ds variables.
   - **Explicit line heights** on the text styles, if Figma should own them.
3. If the team gets an Enterprise plan, add a scheduled job that exports through the REST API and opens a pull request.
4. The kit's Mobile mode (padding 20 px, smaller text sizes) could become responsive tokens later; that needs its own ADR.
