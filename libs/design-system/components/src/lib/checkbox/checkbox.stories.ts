import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from './checkbox';

interface CheckboxArgs {
  label: string;
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
}

const meta: Meta<CheckboxArgs> = {
  title: 'Design System/Atoms/Checkbox',
  component: Checkbox,
  decorators: [
    // The product is dark by default (ADR-0008).
    componentWrapperDecorator(
      (story) =>
        `<div style="padding: 1.5rem; background: var(--gdg-color-background-default)">${story}</div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Checkbox from the Figma **Contact Form** page. Apply `gdg-checkbox` to a native `<input type="checkbox">` inside or next to a `<label>`. Set `aria-invalid="true"` for the error stroke (ADR-0014).',
      },
    },
  },
  args: {
    label: 'I accept the Terms',
    checked: false,
    disabled: false,
    invalid: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <label style="display: inline-flex; align-items: center; gap: var(--gdg-spacing-8); color: var(--gdg-color-content-default); font: var(--gdg-font-paragraph-8)">
        <input
          type="checkbox"
          gdg-checkbox
          [checked]="checked"
          [disabled]="disabled"
          [attr.aria-invalid]="invalid || null"
        />
        {{ label }}
      </label>
    `,
  }),
};
export default meta;

type Story = StoryObj<CheckboxArgs>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', {
      name: 'I accept the Terms',
    });
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};

export const Checked: Story = {
  args: { checked: true },
};

export const Invalid: Story = {
  args: { invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true, checked: true },
};
