import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { expect, userEvent, within } from 'storybook/test';
import { EventsSection } from './events-section';
import { SAMPLE_DAYS } from './events.stories-data';

const meta: Meta<EventsSection> = {
  title: 'UI/Events Section',
  component: EventsSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Events section from the Figma **Landing Page** (143:2918): centered title, day filters as tabs, and the selected day's `EventCard`s (ADR-0021).",
      },
    },
  },
  args: {
    heading: 'Event',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    days: SAMPLE_DAYS,
    initialDay: 0,
  },
};
export default meta;

type Story = StoryObj<EventsSection>;

/** Figma 143:2918. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('tab', { name: '29.06' });
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: '30.06' })).toHaveFocus();
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  },
};

/** A day without events. */
export const EmptyDay: Story = {
  args: { initialDay: 5 },
};
