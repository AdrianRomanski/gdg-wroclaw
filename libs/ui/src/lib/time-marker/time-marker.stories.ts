import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { TimeMarker } from './time-marker';

const meta: Meta<TimeMarker> = {
  title: 'UI/DevFest/Time Marker',
  component: TimeMarker,
  decorators: [
    // The product is dark by default (ADR-0008); 132 × 240px is the Figma frame.
    componentWrapperDecorator(
      (story) =>
        `<div style="padding: 1.5rem; background: var(--gdg-color-background-default)"><div style="inline-size: 8.25rem; block-size: 15rem">${story}</div></div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Time marker from the Figma **DevFest components** page (`Time marker`, 9024:28): the time slot in the agenda's left column with a connector down to the next slot (ADR-0028).",
      },
    },
  },
  args: { time: '08:00 – 08:30', dateTime: '2026-11-21T08:00' },
};
export default meta;

type Story = StoryObj<TimeMarker>;

/** Figma 9024:28. */
export const Default: Story = {};
