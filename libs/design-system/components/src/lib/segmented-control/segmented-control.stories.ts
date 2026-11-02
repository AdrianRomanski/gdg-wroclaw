import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, userEvent, within } from 'storybook/test';
import { SegmentedControl } from './segmented-control';

const meta: Meta<SegmentedControl> = {
  title: 'Design System/Atoms/Segmented Control',
  component: SegmentedControl,
  decorators: [
    // The product is dark by default (ADR-0008); 768px is the Figma Toggle width.
    componentWrapperDecorator(
      (story) =>
        `<div style="padding: 1.5rem; background: var(--gdg-color-background-default)"><div style="max-inline-size: 48rem">${story}</div></div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Segmented control from the Figma **DevFest components** page: `Toggle` (9037:1840, `fullWidth`) and `Segment` (9040:251). A single-choice radio group; the arrow keys move and select (ADR-0028).',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SegmentedControl>;

/** Figma Toggle (9037:1840): two options sharing the full width. */
export const Toggle: Story = {
  args: {
    label: 'Dzień konferencji',
    fullWidth: true,
    value: 'day-1',
    options: [
      { value: 'day-1', label: 'Dzień 1' },
      { value: 'day-2', label: 'Dzień 2' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const second = canvas.getByRole('radio', { name: 'Dzień 2' });
    await userEvent.click(second);
    await expect(second).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowLeft}');
    await expect(
      canvas.getByRole('radio', { name: 'Dzień 1' }),
    ).toHaveAttribute('aria-checked', 'true');
  },
};

/** Figma Segment (9040:251): options that hug their labels. */
export const Segments: Story = {
  args: {
    label: 'Pokaż',
    value: 'all',
    options: [
      { value: 'all', label: 'Wszyscy' },
      { value: 'keynote', label: 'Keynote' },
      { value: 'hosts', label: 'Prowadzący' },
    ],
  },
};
