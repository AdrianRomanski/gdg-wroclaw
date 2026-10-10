import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { Navbar } from './navbar';
import { SAMPLE_NAV_ACTIONS, SAMPLE_NAV_LINKS } from './site.stories-data';

const meta: Meta<Navbar> = {
  title: 'UI/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Navbar from the Figma **Landing Page** (143:2899): GDG logo and wordmark linking home, Nav Buttons and call-to-action buttons. Below 64rem the links and actions move into a menu (ADR-0020).',
      },
    },
  },
  args: {
    brand: 'Google Developer Groups',
    homeHref: '#',
    links: SAMPLE_NAV_LINKS,
    actions: SAMPLE_NAV_ACTIONS,
  },
};
export default meta;

type Story = StoryObj<Navbar>;

/** Figma 143:2899. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('navigation', { name: 'Main' }),
    ).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Register' })).toBeVisible();
  },
};

export const CurrentPage: Story = {
  args: {
    links: SAMPLE_NAV_LINKS.map((link) => ({
      ...link,
      current: link.label === 'Speakers',
    })),
  },
};

/** Below 64rem the links and actions move into a menu; pick a phone viewport in the toolbar. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
