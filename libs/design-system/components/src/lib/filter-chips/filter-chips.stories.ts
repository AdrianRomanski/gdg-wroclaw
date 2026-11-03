import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, userEvent, within } from 'storybook/test';
import { FilterChips } from './filter-chips';

const meta: Meta<FilterChips> = {
  title: 'Design System/Atoms/Filter Chips',
  component: FilterChips,
  decorators: [
    // The product is dark by default (ADR-0008).
    componentWrapperDecorator(
      (story) =>
        `<div style="padding: 1.5rem; background: var(--gdg-color-background-default)">${story}</div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Filter chips from the Figma **DevFest** page (`Category filters`, `Format navigation`, `Track browsing`): toggle buttons (`aria-pressed`) with one selected at most, in the Nav Button (`pill`) or Tag (`tag`) look (ADR-0029).',
      },
    },
  },
};
export default meta;

type Story = StoryObj<FilterChips>;

/** Figma Category filters (9028:1261): "All" and the tracks. */
export const Categories: Story = {
  args: {
    label: 'Track',
    value: 'all',
    chips: [
      { value: 'all', label: 'All' },
      { value: 'ai', label: 'AI', appearance: 'tag', accent: 'red' },
      { value: 'web', label: 'Web', appearance: 'tag', accent: 'yellow' },
      { value: 'mobile', label: 'Mobile', appearance: 'tag', accent: 'green' },
      { value: 'cloud', label: 'Cloud', appearance: 'tag', accent: 'blue' },
      {
        value: 'robotics',
        label: 'Robotics',
        appearance: 'tag',
        accent: 'contrast',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ai = canvas.getByRole('button', { name: 'AI' });
    await userEvent.click(ai);
    await expect(ai).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  },
};

/** Figma Format navigation (9028:1256): pills only. */
export const Formats: Story = {
  args: {
    label: 'Format',
    value: 'talks',
    chips: [
      { value: 'talks', label: 'Talks (2 Rooms in Parallel)' },
      { value: 'workshops', label: 'Workshops (Hands-on Labs)' },
    ],
  },
};

/** Figma Track browsing (9044:2800): tags that can be cleared again. */
export const ClearableTags: Story = {
  args: {
    label: 'Tracks',
    allowEmpty: true,
    chips: [
      { value: 'ai', label: 'AI', appearance: 'tag', accent: 'red' },
      { value: 'cloud', label: 'Cloud', appearance: 'tag', accent: 'blue' },
      { value: 'generic', label: 'Generic', appearance: 'tag' },
    ],
  },
};
