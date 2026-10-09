# design-system-components

GDG Wrocław design-system components (Angular): the Figma primitives (atoms) the rest of the UI is built from. See [ADR-0013](../../../docs/adr/0013-design-system-and-ui-library-architecture.md) for where this library sits in the architecture.

It may depend only on [`@gdg-wroclaw/design-system-tokens`](../tokens/README.md). Composed GDG product UI (navbar, cards, page sections) belongs in [`@gdg-wroclaw/ui`](../../ui/README.md), not here.

## Components

| Component   | Usage                                                                                       | Figma                                           | ADR                                                                            |
| :---------- | :------------------------------------------------------------------------------------------ | :---------------------------------------------- | :----------------------------------------------------------------------------- |
| `Button`    | `<button gdg-button type="button" color="green" variant="secondary" size="m">Save</button>` | Button / Nav Button (`143:2772`)                | [ADR-0011](../../../docs/adr/0011-button-component-and-phosphor-icons.md)      |
| `Checkbox`  | `<label><input type="checkbox" gdg-checkbox /> I accept the Terms</label>`                  | Checkbox (`181:9151`)                           | [ADR-0014](../../../docs/adr/0014-contact-form-and-form-control-primitives.md) |
| `Icon`      | `<gdg-icon name="caret-right" />` (Phosphor, see `src/lib/icon/icons.json`)                 | CaretRight (`181:7873`)                         | [ADR-0011](../../../docs/adr/0011-button-component-and-phosphor-icons.md)      |
| `NavButton` | `<a gdg-nav-button routerLink="/faq" routerLinkActive ariaCurrentWhenActive="page">FAQ</a>` | Button / Nav Button (`143:2869`)                | [ADR-0009](../../../docs/adr/0009-nav-button-component.md)                     |
| `TextInput` | `<input gdg-text-input id="email" type="email" />`, `<textarea gdg-text-input></textarea>`  | Text input / Text Area (`181:9163`, `181:9174`) | [ADR-0014](../../../docs/adr/0014-contact-form-and-form-control-primitives.md) |

## Icons

Icons come from [`@phosphor-icons/core`](https://phosphoricons.com) (regular weight). To add one, put its name in
`src/lib/icon/icons.json` and run `npx nx run design-system-components:generate-icons`. A unit test fails if the generated
registry is out of date.

## Storybook

Stories live next to their component (`src/lib/<component>/<component>.stories.ts`, titled `Design System/Atoms/*`)
and are rendered by the workspace Storybook in [`apps/storybook`](../../../apps/storybook/README.md):

```sh
npx nx storybook storybook   # dev server on http://localhost:4400
```

## Running unit tests

Run `npx nx test design-system-components` to execute the unit tests via [Vitest](https://vitest.dev/).
