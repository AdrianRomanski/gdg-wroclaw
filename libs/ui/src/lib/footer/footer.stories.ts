import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import {
  SAMPLE_COMMUNITY_SOCIALS,
  SAMPLE_LEGAL_LINKS,
  SAMPLE_NAV_LINKS,
} from '../navbar/site.stories-data';
import { Footer } from './footer';

const meta: Meta<Footer> = {
  title: 'UI/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Footer from the Figma **Landing Page** (`Footer / 4 /`, 143:3117): logo, navigation and the community social links, then the legal links below a divider (ADR-0020).',
      },
    },
  },
  args: {
    homeHref: '#',
    links: SAMPLE_NAV_LINKS,
    socials: SAMPLE_COMMUNITY_SOCIALS,
    legalLinks: SAMPLE_LEGAL_LINKS,
  },
};
export default meta;

type Story = StoryObj<Footer>;

/** Figma 143:3117. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('link', { name: 'GDG Wrocław on YouTube' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('navigation', { name: 'Legal' }),
    ).toBeVisible();
  },
};
