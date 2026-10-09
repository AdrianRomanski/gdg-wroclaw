import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, userEvent, within } from 'storybook/test';
import { TextInput } from './text-input';

interface TextInputArgs {
  label: string;
  placeholder: string;
  disabled: boolean;
  invalid: boolean;
}

const field = (label: string, control: string) =>
  `<label style="display: grid; gap: var(--gdg-spacing-8); max-inline-size: var(--gdg-layout-max-width-medium); color: var(--gdg-color-content-default); font: var(--gdg-font-paragraph-7)">${label}${control}</label>`;

const meta: Meta<TextInputArgs> = {
  title: 'Design System/Atoms/Text Input',
  component: TextInput,
  decorators: [
    // The product is dark by default (ADR-0008).
    componentWrapperDecorator(
      (story) =>
        `<div style="display: grid; gap: 1.5rem; padding: 1.5rem; background: var(--gdg-color-background-default)">${story}</div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Text input and text area from the Figma **Contact Form** page. Apply `gdg-text-input` to a native `<input>` or `<textarea>` and give it a `<label>`. Set `aria-invalid="true"` for the error stroke (ADR-0014).',
      },
    },
  },
  args: {
    label: 'Name',
    placeholder: '',
    disabled: false,
    invalid: false,
  },
  render: (args) => ({
    props: args,
    template: field(
      '{{ label }}',
      `<input gdg-text-input [placeholder]="placeholder" [disabled]="disabled" [attr.aria-invalid]="invalid || null" />`,
    ),
  }),
};
export default meta;

type Story = StoryObj<TextInputArgs>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Name' });
    await userEvent.type(input, 'Ada Lovelace');
    await expect(input).toHaveValue('Ada Lovelace');
  },
};

export const TextArea: Story = {
  render: () => ({
    template: field(
      'Message',
      '<textarea gdg-text-input placeholder="Type your message..."></textarea>',
    ),
  }),
};

export const Invalid: Story = {
  args: { label: 'Email', invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
