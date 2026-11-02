import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { SAMPLE_KEYNOTE } from '../devfest-session/devfest.stories-data';
import { KeynoteCard } from './keynote-card';

const meta: Meta<KeynoteCard> = {
  title: 'UI/DevFest/Keynote Card',
  component: KeynoteCard,
  decorators: [
    // The product is dark by default (ADR-0008); 1168px is the Figma card width.
    componentWrapperDecorator(
      (story) =>
        `<div style="padding: 1.5rem; background: var(--gdg-color-background-default)"><div style="max-inline-size: 73rem">${story}</div></div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Keynote card from the Figma **DevFest components** page (`Keynote card`, 9040:511): on brand blue, tags for the time, type and room, the title, abstract and speaker (ADR-0028).',
      },
    },
  },
  args: { keynote: SAMPLE_KEYNOTE, typeLabel: 'Keynote' },
};
export default meta;

type Story = StoryObj<KeynoteCard>;

/** Figma 9040:511. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', {
        name: SAMPLE_KEYNOTE.title,
      }),
    ).toBeVisible();
  },
};

/** Not in Figma: the narrow layout (ADR-0028). */
export const Narrow: Story = {
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-inline-size: 22.375rem">${story}</div>`,
    ),
  ],
};
