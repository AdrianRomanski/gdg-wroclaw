import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { SAMPLE_PARTNERS } from '../partners-section/partners.stories-data';
import { PartnerCard } from './partner-card';

const meta: Meta<PartnerCard> = {
  title: 'UI/Partner Card',
  component: PartnerCard,
  decorators: [
    // The product is dark by default (ADR-0008); 296px is the Figma card width.
    componentWrapperDecorator(
      (story) =>
        `<div style="padding: 1.5rem; background: var(--gdg-color-background-default)"><div style="max-inline-size: 18.5rem">${story}</div></div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Partner card from the Figma **Team/Partners** page (`Partners`, 181:8588): a square logo with the name below, as a rounded `tile` (grid) or a square `card` (carousel). Links to the partner site when it has a `url` (ADR-0019).',
      },
    },
  },
  args: { partner: SAMPLE_PARTNERS[0], variant: 'tile' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['tile', 'card'] },
  },
};
export default meta;

type Story = StoryObj<PartnerCard>;

/** Figma `Property 1=Partner`. */
export const Tile: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Full name' })).toBeVisible();
  },
};

/** Figma `Property 1=Card`. */
export const Card: Story = {
  args: { variant: 'card' },
};

export const WithoutLink: Story = {
  args: { partner: { ...SAMPLE_PARTNERS[0], url: undefined } },
};

export const WithoutLogo: Story = {
  args: { partner: { name: 'Wrocław Tech Hub' } },
};
