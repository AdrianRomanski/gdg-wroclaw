import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { NavButton } from './nav-button';

interface NavButtonArgs {
  label: string;
  active: boolean;
  disabled: boolean;
}

const meta: Meta<NavButtonArgs> = {
  title: 'Design System/Atoms/Nav Button',
  component: NavButton,
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
          'Navigation item from the Figma **Button / Nav Button** page. Apply `gdg-nav-button` to a native `<a>` (navigation) or `<button>` (in-page action). Hover shows `background.nav-button-hover`; the current page (`aria-current="page"`) shows `background.nav-button-active`.',
      },
    },
  },
  args: {
    label: 'Nav Button',
    active: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<a gdg-nav-button href="#" [active]="active" [disabled]="disabled">{{ label }}</a>`,
  }),
};
export default meta;

type Story = StoryObj<NavButtonArgs>;

export const Default: Story = {};

export const Active: Story = {
  args: { active: true },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'Nav Button',
    });
    await expect(link).toHaveAttribute('aria-current', 'page');
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'Nav Button',
    });
    await expect(link).toHaveAttribute('aria-disabled', 'true');
    await expect(link).toHaveAttribute('tabindex', '-1');
  },
};

/** On a `<button>` (e.g. opening a menu), disabled uses the native attribute. */
export const AsButton: Story = {
  render: (args) => ({
    props: args,
    template: `<button gdg-nav-button type="button" [disabled]="disabled">{{ label }}</button>`,
  }),
};

/** All Figma states side by side. Hover the first item to see the hover state. */
export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 1rem">
        <a gdg-nav-button href="#">Default</a>
        <a gdg-nav-button href="#" active>Active</a>
        <a gdg-nav-button href="#" disabled>Disabled</a>
      </div>
    `,
  }),
};

/** Typical use: a site navigation with the current page marked. */
export const Navigation: Story = {
  render: () => ({
    template: `
      <nav aria-label="Main">
        <ul style="display: flex; gap: 0.5rem; margin: 0; padding: 0; list-style: none">
          <li><a gdg-nav-button href="#" active>Home</a></li>
          <li><a gdg-nav-button href="#">Workshops</a></li>
          <li><a gdg-nav-button href="#">Team</a></li>
          <li><a gdg-nav-button href="#">FAQ</a></li>
          <li><a gdg-nav-button href="#">Contact</a></li>
        </ul>
      </nav>
    `,
  }),
};
