import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import type { Accent } from '../accent/accent';
import { Tag } from './tag';

interface TagArgs {
  label: string;
  accent?: Accent;
}

const meta: Meta<TagArgs> = {
  title: 'Design System/Atoms/Tag',
  component: Tag,
  decorators: [
    // The product is dark by default (ADR-0008).
    componentWrapperDecorator(
      (story) =>
        `<div style="display: flex; flex-wrap: wrap; gap: 1rem; padding: 1.5rem; background: var(--gdg-color-background-default)">${story}</div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Tag from the Figma **DevFest components** page (`Tag`, 9024:20): a pill with an optional accent dot (the session track) and a short label. Without an accent it is the neutral tag for rooms, times and session types (ADR-0028).',
      },
    },
  },
  args: { label: 'AI', accent: 'red' },
  argTypes: {
    accent: {
      control: 'select',
      options: [undefined, 'red', 'yellow', 'green', 'blue', 'contrast'],
    },
  },
  render: (args) => ({
    props: args,
    template: `<gdg-tag [accent]="accent">{{ label }}</gdg-tag>`,
  }),
};
export default meta;

type Story = StoryObj<TagArgs>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('AI')).toBeVisible();
  },
};

export const Neutral: Story = { args: { label: 'Sala A', accent: undefined } };

/** Figma 9024:20: the tracks AI, Web, Mobile, Cloud, Robotyka and a room. */
export const AllTracks: Story = {
  render: () => ({
    template: `
      <gdg-tag accent="red">AI</gdg-tag>
      <gdg-tag accent="yellow">Web</gdg-tag>
      <gdg-tag accent="green">Mobile</gdg-tag>
      <gdg-tag accent="blue">Cloud</gdg-tag>
      <gdg-tag accent="contrast">Robotyka</gdg-tag>
      <gdg-tag>Sala</gdg-tag>
    `,
  }),
};
