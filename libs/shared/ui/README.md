# shared-ui

GDG Wrocław design-system components (Angular) and the design-system Storybook. See [ADR-0004](../../../docs/adr/0004-storybook-for-design-system.md).

Tokens (colors, …) live in [`@gdg-wroclaw/shared-ui-tokens`](../ui-tokens/README.md).

## Components

| Component   | Usage                                                                                       | Figma                            | ADR                                                                       |
| :---------- | :------------------------------------------------------------------------------------------ | :------------------------------- | :------------------------------------------------------------------------ |
| `Button`    | `<button gdg-button type="button" color="green" variant="secondary" size="m">Save</button>` | Button / Nav Button (`143:2772`) | [ADR-0011](../../../docs/adr/0011-button-component-and-phosphor-icons.md) |
| `Icon`      | `<gdg-icon name="caret-right" />` (Phosphor, see `src/lib/icon/icons.json`)                 | CaretRight (`181:7873`)          | [ADR-0011](../../../docs/adr/0011-button-component-and-phosphor-icons.md) |
| `NavButton` | `<a gdg-nav-button routerLink="/faq" routerLinkActive ariaCurrentWhenActive="page">FAQ</a>` | Button / Nav Button (`143:2869`) | [ADR-0009](../../../docs/adr/0009-nav-button-component.md)                |

## Icons

Icons come from [`@phosphor-icons/core`](https://phosphoricons.com) (regular weight). To add one, put its name in
`src/lib/icon/icons.json` and run `npx nx run shared-ui:generate-icons`. A unit test fails if the generated
registry is out of date.

## Storybook

```sh
npx nx storybook shared-ui        # dev server on http://localhost:4400
npx nx build-storybook shared-ui  # static build in dist/storybook/shared-ui
npx nx test-storybook shared-ui   # smoke-test every story/docs page (dev + static, needs Google Chrome)
```

Stories and docs pages are discovered from `src/**/*.mdx` and `src/**/*.stories.ts`. Titles follow:

- `Design System/Foundations/*`: tokens (colors, typography, …)
- `Design System/Atoms|Molecules|Organisms/*`: components
- `Features/<Domain>/*`, `Pages/*`: feature and page compositions

## Running unit tests

Run `npx nx test shared-ui` to execute the unit tests via [Vitest](https://vitest.dev/).
