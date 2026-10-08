import {
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { Icon } from '../icon/icon';
import {
  Button,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from './button';

interface ButtonArgs {
  label: string;
  color: ButtonColor;
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  withIcon: boolean;
  iconOnly: boolean;
}

const colors: ButtonColor[] = ['blue', 'green', 'yellow', 'red'];
const variants: ButtonVariant[] = ['primary', 'secondary'];
const sizes: ButtonSize[] = ['l', 'm'];

const stack = (content: string) =>
  `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem">${content}</div>`;

const meta: Meta<ButtonArgs> = {
  title: 'Design System/Atoms/Button',
  component: Button,
  decorators: [
    moduleMetadata({ imports: [Icon] }),
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
          "Button from the Figma **Button / Nav Button** page. Apply `gdg-button` to a native `<button>` (action) or `<a>` (navigation). Project a `<gdg-icon>` to show a trailing icon; for icon-only buttons set `iconOnly` and an `aria-label`. Primary text is black (`content.on-brand`) instead of Figma's OFF White, to meet WCAG AA on the Google brand fills (ADR-0012).",
      },
    },
  },
  args: {
    label: 'Button',
    color: 'blue',
    variant: 'primary',
    size: 'l',
    disabled: false,
    withIcon: false,
    iconOnly: false,
  },
  argTypes: {
    label: { control: 'text' },
    color: { control: 'inline-radio', options: colors },
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: sizes },
    disabled: { control: 'boolean' },
    withIcon: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `
      <button
        gdg-button
        type="button"
        [color]="color"
        [variant]="variant"
        [size]="size"
        [disabled]="disabled"
        [iconOnly]="iconOnly"
        [attr.aria-label]="iconOnly ? label : null"
      >
        @if (!iconOnly) {
          {{ label }}
        }
        @if (withIcon || iconOnly) {
          <gdg-icon name="caret-right" />
        }
      </button>
    `,
  }),
};
export default meta;

type Story = StoryObj<ButtonArgs>;

export const Default: Story = {};

export const Primary: Story = {
  render: () => ({
    template: stack(
      colors
        .map(
          (color) =>
            `<button gdg-button type="button" color="${color}">${color}</button>`,
        )
        .join(''),
    ),
  }),
};

export const Secondary: Story = {
  render: () => ({
    template: stack(
      colors
        .map(
          (color) =>
            `<button gdg-button type="button" variant="secondary" color="${color}">${color}</button>`,
        )
        .join(''),
    ),
  }),
};

/** L is 48px tall, M is 40px. */
export const Sizes: Story = {
  render: () => ({
    template: stack(`
      <button gdg-button type="button" size="l">Large</button>
      <button gdg-button type="button" size="m">Medium</button>
      <button gdg-button type="button" variant="secondary" size="l">Large</button>
      <button gdg-button type="button" variant="secondary" size="m">Medium</button>
    `),
  }),
};

/** The icon always follows the label (Figma `Property=txt+ikon`). */
export const WithIcon: Story = {
  args: { withIcon: true },
};

export const IconOnly: Story = {
  args: { iconOnly: true, label: 'Next' },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Next' });
    await expect(button).toHaveClass('gdg-button--icon-only');
  },
};

export const Disabled: Story = {
  render: () => ({
    template: stack(`
      <button gdg-button type="button" disabled>Primary</button>
      <button gdg-button type="button" variant="secondary" disabled>Secondary</button>
      <a gdg-button href="#" variant="secondary" disabled>Link <gdg-icon name="caret-right" /></a>
    `),
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('button', { name: 'Primary' }),
    ).toBeDisabled();
    const link = canvas.getByRole('link', { name: 'Link' });
    await expect(link).toHaveAttribute('aria-disabled', 'true');
    await expect(link).toHaveAttribute('tabindex', '-1');
  },
};

/** On an `<a>` for navigation, e.g. with `routerLink`. */
export const AsLink: Story = {
  render: () => ({
    template: stack(`
      <a gdg-button href="#">Register <gdg-icon name="caret-right" /></a>
      <a gdg-button href="#" variant="secondary">Agenda</a>
    `),
  }),
};

type Content = 'text' | 'text-icon' | 'icon';
const states = ['default', 'hover', 'disabled'] as const;

const variantCell = (
  variant: ButtonVariant,
  color: ButtonColor,
  size: ButtonSize,
  content: Content,
  state: (typeof states)[number],
) => {
  const attrs = [
    'gdg-button',
    'type="button"',
    `variant="${variant}"`,
    `color="${color}"`,
    `size="${size}"`,
    state === 'disabled' ? 'disabled' : '',
    // Static stand-in for :hover so the matrix can be compared with the Figma frame.
    state === 'hover' ? 'style="--_fill: var(--_fill-hover)"' : '',
    content === 'icon' ? 'iconOnly aria-label="Next"' : '',
  ].join(' ');
  const label = content === 'icon' ? '' : 'Button';
  const icon = content === 'text' ? '' : '<gdg-icon name="caret-right" />';
  return `<button ${attrs}>${label}${icon}</button>`;
};

/** Every Figma variant, laid out like the Figma component set (143:2772). */
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(6, auto); gap: 0.875rem 2rem; justify-items: center; align-items: center; color: var(--gdg-color-content-default); font: var(--gdg-font-paragraph-9)">
        ${variants.flatMap((variant) => states.map((state) => `<span>${variant} · ${state}</span>`)).join('')}
        ${(['text', 'text-icon', 'icon'] as Content[])
          .flatMap((content) =>
            sizes.flatMap((size) =>
              colors.flatMap((color) =>
                variants.flatMap((variant) =>
                  states.map((state) =>
                    variantCell(variant, color, size, content, state),
                  ),
                ),
              ),
            ),
          )
          .join('')}
      </div>
    `,
  }),
};
