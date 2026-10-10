import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { PartnersSection } from './partners-section';
import { SAMPLE_PARTNERS } from './partners.stories-data';

const meta: Meta<PartnersSection> = {
  title: 'UI/Partners Section',
  component: PartnersSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Partners section from the Figma **Team/Partners** page: a centered `grid` of logo tiles (`Partners`) or a `carousel` of partner cards with dots and previous/next buttons (`Team / 10 /`), with an optional call to action (ADR-0013, ADR-0019).',
      },
    },
  },
  args: {
    heading: 'Partners',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    partners: SAMPLE_PARTNERS,
    layout: 'grid',
    ctaHeading: '',
    ctaText: '',
    ctaHref: undefined,
    ctaLabel: 'Contact',
  },
  argTypes: {
    layout: { control: 'inline-radio', options: ['grid', 'carousel'] },
  },
};
export default meta;

type Story = StoryObj<PartnersSection>;

/** Figma 181:5975. */
export const Grid: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Partners' }),
    ).toBeVisible();
    await expect(
      canvas.getAllByRole('link', { name: 'Full name' }),
    ).toHaveLength(8);
  },
};

/** Figma 181:7330. */
export const Carousel: Story = {
  args: {
    layout: 'carousel',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    partners: SAMPLE_PARTNERS.slice(0, 7),
    ctaHeading: 'Join us!',
    ctaText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    ctaHref: '#',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previous = canvas.getByRole('button', { name: 'Previous partners' });
    const next = canvas.getByRole('button', { name: 'Next partners' });
    await expect(
      canvas.getByRole('region', { name: 'Partners' }),
    ).toBeVisible();
    await expect(previous).toBeDisabled();
    await userEvent.click(next);
    await waitFor(() => expect(previous).toBeEnabled());
  },
};
