import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import {
  SAMPLE_BREAK,
  SAMPLE_OPENING,
} from '../devfest-session/devfest.stories-data';
import { ScheduleEvent } from './schedule-event';

const meta: Meta<ScheduleEvent> = {
  title: 'UI/DevFest/Schedule Event',
  component: ScheduleEvent,
  decorators: [
    // The product is dark by default (ADR-0008); 1280px is the Figma desktop width.
    componentWrapperDecorator(
      (story) =>
        `<div style="padding: 1.5rem; background: var(--gdg-color-background-default)"><div style="max-inline-size: 80rem">${story}</div></div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Schedule event from the Figma **DevFest components** page (`Schedule event`, 9027:147): an agenda entry for all rooms, `shared` or `break`. It stacks when narrower than 40rem (ADR-0028).',
      },
    },
  },
  args: { item: SAMPLE_OPENING },
};
export default meta;

type Story = StoryObj<ScheduleEvent>;

/** Figma 9027:133 (Shared, desktop). */
export const Shared: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', { name: 'Opening' }),
    ).toBeVisible();
  },
};

/** Figma 9027:140 (Break, desktop). */
export const Break: Story = { args: { item: SAMPLE_BREAK } };

/** Figma 9041:608 and 9041:615 (mobile): 358px wide. */
export const Mobile: Story = {
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-inline-size: 22.375rem">${story}</div>`,
    ),
  ],
  render: () => ({
    props: { opening: SAMPLE_OPENING, pause: SAMPLE_BREAK },
    template: `<div style="display: grid; gap: 1.5rem">
      <gdg-schedule-event [item]="opening" />
      <gdg-schedule-event [item]="pause" />
    </div>`,
  }),
};
