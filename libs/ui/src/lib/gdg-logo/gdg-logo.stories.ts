import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { GdgLogo } from './gdg-logo';

const meta: Meta<GdgLogo> = {
  title: 'UI/GDG Logo',
  component: GdgLogo,
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div style="padding: 1.5rem; background: var(--gdg-color-background-default)">${story}</div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'The GDG logo from the Figma Landing Page Navbar and Footer. Decorative by default; set `label` when it stands alone (ADR-0020).',
      },
    },
  },
  args: { height: 40, label: '' },
};
export default meta;

type Story = StoryObj<GdgLogo>;

export const Default: Story = {};

export const Large: Story = {
  args: { height: 96, label: 'Google Developer Groups' },
};
