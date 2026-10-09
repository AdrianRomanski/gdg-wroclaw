# storybook

The single Storybook for the GDG Wrocław UI stack (see [ADR-0013](../../docs/adr/0013-design-system-and-ui-library-architecture.md)
and [ADR-0004](../../docs/adr/0004-storybook-for-design-system.md)). It owns only the Storybook configuration and smoke
tests; stories and docs pages stay next to the code they document:

| Source                                              | Titles                                        |
| :-------------------------------------------------- | :-------------------------------------------- |
| `libs/design-system/tokens/docs/*.mdx`              | `Design System/Foundations/*`                 |
| `libs/design-system/components/src/**/*.stories.ts` | `Design System/Atoms\|Molecules\|Organisms/*` |
| `libs/ui/src/**/*.stories.ts`                       | `UI/*`, `Pages/*` (page templates)            |

Future feature and page compositions use `Features/<Domain>/*` and `Pages/*`.

```sh
npx nx storybook storybook        # dev server on http://localhost:4400
npx nx build-storybook storybook  # static build in dist/storybook
npx nx test-storybook storybook   # smoke-test every story/docs page (dev + static, needs Google Chrome)
```

Every story renders with the design tokens (`.storybook/preview.ts` imports `tokens.css`), and accessibility violations
fail (`a11y.test: 'error'`). After adding new TypeScript files to a library, restart a running dev server.

Story-only assets (sample photos, the placeholder event banner) live in `public/` and are served at the Storybook root through `staticDirs`, e.g.
`people/trainer-1.jpg`. They are never shipped with a library; the current sample photos come from the Figma file and
must be replaced with consented photos before anything public is built from Storybook (ADR-0016).
