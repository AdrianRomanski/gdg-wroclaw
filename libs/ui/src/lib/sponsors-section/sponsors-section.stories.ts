import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { SponsorsSection } from './sponsors-section';
import { SAMPLE_SPONSORS } from './sponsors.stories-data';

const meta: Meta<SponsorsSection> = {
  title: 'UI/Sponsors Section',
  component: SponsorsSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Sponsors section of the Landing page (no Figma frame): sponsors grouped by tier (Platinum, Gold, Silver) as logo tiles, larger for higher tiers, with an optional red call to action. Tier labels are uppercase with a pastel red underline (ADR-0013, ADR-0037).',
      },
    },
  },
  args: {
    heading: 'Sponsors',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    sponsors: SAMPLE_SPONSORS,
    ctaHeading: 'Become a sponsor',
    ctaText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    ctaHref: '#',
    ctaLabel: 'Contact',
  },
};
export default meta;

type Story = StoryObj<SponsorsSection>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Sponsors' }),
    ).toBeVisible();
    for (const tier of ['Platinum', 'Gold', 'Silver']) {
      await expect(canvas.getByRole('region', { name: tier })).toBeVisible();
    }
    await expect(
      canvas.getAllByRole('link', { name: 'Full name' }),
    ).toHaveLength(9);
  },
};

export const SingleTier: Story = {
  args: {
    sponsors: SAMPLE_SPONSORS.filter((sponsor) => sponsor.tier === 'gold'),
    ctaHeading: '',
    ctaHref: undefined,
  },
};
