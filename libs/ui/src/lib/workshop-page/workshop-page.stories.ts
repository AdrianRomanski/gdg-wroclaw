import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { WorkshopPage } from './workshop-page';
import { SAMPLE_WORKSHOP } from './workshop.stories-data';

const meta: Meta<WorkshopPage> = {
  title: 'Pages/Workshop',
  component: WorkshopPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Workshop page template from the Figma **Workshop Page** (`Event Header / 1 /`): banner, topic, description and trainers. Presentational: the app routes to it and passes a `Workshop` (ADR-0013, ADR-0017).',
      },
    },
  },
  args: { workshop: SAMPLE_WORKSHOP },
};
export default meta;

type Story = StoryObj<WorkshopPage>;

/** Figma 143:5973. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Workshop topic' }),
    ).toBeVisible();
    await expect(
      canvas.getAllByRole('heading', { level: 3, name: 'Full name' }),
    ).toHaveLength(3);
  },
};

export const WithoutBanner: Story = {
  args: { workshop: { ...SAMPLE_WORKSHOP, banner: undefined } },
};
