import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { icons, type IconName } from './generated/icons';
import { Icon } from './icon';

interface IconArgs {
  name: IconName;
  size: number;
  label: string;
}

const meta: Meta<IconArgs> = {
  title: 'Design System/Atoms/Icon',
  component: Icon,
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div style="padding: 1.5rem; background: var(--gdg-color-background-default); color: var(--gdg-color-content-default)">${story}</div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Phosphor icons (regular), generated from `@phosphor-icons/core` for the names in `icons.json` (run `nx run design-system-components:generate-icons` after adding one). Icons inherit the text color and are decorative unless a `label` is set.',
      },
    },
  },
  args: { name: 'caret-right', size: 24, label: '' },
  argTypes: {
    name: { control: 'select', options: Object.keys(icons) },
    size: { control: { type: 'number', min: 12, max: 96, step: 4 } },
    label: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `<gdg-icon [name]="name" [size]="size" [label]="label || undefined" />`,
  }),
};
export default meta;

type Story = StoryObj<IconArgs>;

export const Default: Story = {};

/** Icons take the current text color. */
export const InheritsColor: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem">
        <span style="color: var(--gdg-color-brand-blue-primary)"><gdg-icon name="caret-right" /></span>
        <span style="color: var(--gdg-color-brand-green-primary)"><gdg-icon name="caret-right" /></span>
        <span style="color: var(--gdg-color-brand-yellow-primary)"><gdg-icon name="caret-right" /></span>
        <span style="color: var(--gdg-color-brand-red-primary)"><gdg-icon name="caret-right" /></span>
        <span style="color: var(--gdg-color-content-disabled)"><gdg-icon name="caret-right" /></span>
      </div>
    `,
  }),
};

/** A standalone icon that conveys meaning needs a `label`. */
export const Labelled: Story = {
  args: { label: 'Next' },
  play: async ({ canvasElement }) => {
    const icon = within(canvasElement).getByRole('img', { name: 'Next' });
    await expect(icon).not.toHaveAttribute('aria-hidden');
  },
};

/** Every icon in the registry. */
export const Gallery: Story = {
  render: () => ({
    props: { names: Object.keys(icons) },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 1.5rem">
        @for (name of names; track name) {
          <figure style="margin: 0; display: grid; justify-items: center; gap: 0.5rem; font: var(--gdg-font-paragraph-9)">
            <gdg-icon [name]="name" [size]="32" />
            <figcaption>{{ name }}</figcaption>
          </figure>
        }
      </div>
    `,
  }),
};
