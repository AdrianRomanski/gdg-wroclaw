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
          "Avatar from the Figma **DevFest components** page (`Avatar`, 9024:27): a person's initials in a circle, S 40px, M 64px or L 112px, or XL 224px (ADR-0033), which shrinks to fit its container, with an optional accent ring in the session track color (ADR-0028). With a `src`, the photo fills the circle and the initials are the fallback (ADR-0031). Decorative unless given a `label`.",
      },
    },
  },
  args: { initials: 'OT', size: 's' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l', 'xl'] },
    accent: {
      control: 'select',
      options: [undefined, 'red', 'yellow', 'green', 'blue', 'contrast'],
    },
  },
};
export default meta;

type Story = StoryObj<Avatar>;

export const Default: Story = {};

/** Figma 9024:27: S, M and L, and XL (ADR-0033). */
export const Sizes: Story = {
  render: () => ({
    template: `
      <gdg-avatar initials="OT" size="s" />
      <gdg-avatar initials="OT" size="m" />
      <gdg-avatar initials="OT" size="l" />
      <gdg-avatar initials="OT" size="xl" />
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

// A stand-in photo: Storybook has no app assets.
const PHOTO =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%23a8c7fa"/%3E%3Ccircle cx="32" cy="26" r="12" fill="%23446eb3"/%3E%3Cellipse cx="32" cy="60" rx="22" ry="16" fill="%23446eb3"/%3E%3C/svg%3E';

/** With a photo in each size and a track ring (ADR-0031). */
export const Photo: Story = {
  render: () => ({
    props: { photo: PHOTO },
    template: `
      <gdg-avatar initials="OT" size="s" [src]="photo" />
      <gdg-avatar initials="OT" size="m" accent="blue" [src]="photo" />
      <gdg-avatar initials="OT" size="l" accent="red" [src]="photo" />
      <gdg-avatar initials="OT" size="xl" accent="green" [src]="photo" />
    `,
  }),
};
