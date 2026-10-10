import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { SAMPLE_EVENT } from '../events-section/events.stories-data';
import { EventCard } from './event-card';

const meta: Meta<EventCard> = {
  title: 'UI/Event Card',
  component: EventCard,
  decorators: [
    // The product is dark by default (ADR-0008); 950px is the Figma list width.
    componentWrapperDecorator(
      (story) =>
        `<div style="padding: 1.5rem; background: var(--gdg-color-background-default)"><div style="max-inline-size: 59.375rem">${story}</div></div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Event card from the Figma **Landing Page** (`Card`, 143:2932): title with an optional tag, start time and location, description and a "Read more" link (ADR-0021).',
      },
    },
  },
  args: { event: SAMPLE_EVENT, readMoreLabel: 'Read more' },
};
export default meta;

type Story = StoryObj<EventCard>;

/** Figma 143:2932, with the "Sold out" tag. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'Event title heading' }),
    ).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Read more' })).toBeVisible();
  },
};

/** Figma 143:2950, without a tag. */
export const WithoutTag: Story = {
  args: { event: { ...SAMPLE_EVENT, tag: undefined } },
};

export const Minimal: Story = {
  args: { event: { title: 'DevFest Wrocław' } },
};
