# Project Workflow Rules

- **ADR for every major change**: Any architectural or significant change (new library or app, new tooling, workspace structure, design-system decisions, new dependencies) MUST come with an ADR in `docs/adr/` using the template in `docs/adr/README.md`. Add it to the Decision Log table in the same change.
- **Branch per feature**: Never commit directly to `main`. Start every feature/change on a new branch created from an up-to-date `main` (e.g. `feat/<name>`, `fix/<name>`, `chore/<name>`, `docs/<name>`).
- **Pull request for every change**: Push the branch and merge it into `main` only through a pull request. The PR description must link the related ADR(s).
- **Commit authorship**: Commits and PRs are authored solely by the repository owner. Do NOT add `Co-Authored-By` trailers or "Generated with Claude Code" (or any other AI attribution) lines to commit messages or PR descriptions.
- **Workspace layout**: Applications live in `apps/`, libraries in `libs/<scope>/<type>-<name>` (see ADR-0002). The UI stack is layered (ADR-0013): `libs/design-system/tokens` ← `libs/design-system/components` (Figma primitives) ← `libs/ui` (composed GDG product UI, presentational only) ← apps; the single Storybook lives in `apps/storybook`. Dependencies may only point down this stack (enforced by `@nx/enforce-module-boundaries`).

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
