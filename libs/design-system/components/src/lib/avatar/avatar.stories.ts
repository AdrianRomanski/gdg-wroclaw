import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { Avatar } from './avatar';

const meta: Meta<Avatar> = {
  title: 'Design System/Atoms/Avatar',
  component: Avatar,
  decorators: [
    // The product is dark by default (ADR-0008).
    componentWrapperDecorator(
      (story) =>
        `<div style="display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: var(--gdg-color-background-default)">${story}</div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Avatar from the Figma **DevFest components** page (`Avatar`, 9024:27): a person's initials in a circle, S 40px, M 64px or L 112px, with an optional accent ring in the session track color (ADR-0028). Decorative unless given a `label`.",
      },
    },
  },
  args: { initials: 'OT', size: 's' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    accent: {
      control: 'select',
      options: [undefined, 'red', 'yellow', 'green', 'blue', 'contrast'],
    },
  },
};
export default meta;

type Story = StoryObj<Avatar>;

export const Default: Story = {};

/** Figma 9024:27: S, M and L. */
export const Sizes: Story = {
  render: () => ({
    template: `
      <gdg-avatar initials="OT" size="s" />
      <gdg-avatar initials="OT" size="m" />
      <gdg-avatar initials="OT" size="l" />
    `,
  }),
};

/** Track rings, as in the Presentation and Speaker cards. */
export const Accents: Story = {
  render: () => ({
    template: `
      <gdg-avatar initials="OT" size="m" accent="red" />
      <gdg-avatar initials="OT" size="m" accent="yellow" />
      <gdg-avatar initials="OT" size="m" accent="green" />
      <gdg-avatar initials="OT" size="m" accent="blue" />
      <gdg-avatar initials="OT" size="m" accent="contrast" />
    `,
  }),
};
