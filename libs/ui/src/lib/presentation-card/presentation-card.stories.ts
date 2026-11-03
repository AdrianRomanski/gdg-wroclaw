import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, userEvent, within } from 'storybook/test';
import { SAMPLE_TALK, TRACKS } from '../devfest-session/devfest.stories-data';
import { PresentationCard } from './presentation-card';

const meta: Meta<PresentationCard> = {
  title: 'UI/DevFest/Presentation Card',
  component: PresentationCard,
  decorators: [
    // The product is dark by default (ADR-0008); 558px is the Figma card width.
    componentWrapperDecorator(
      (story) =>
        `<div style="padding: 1.5rem; background: var(--gdg-color-background-default)"><div style="max-inline-size: 34.875rem">${story}</div></div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Presentation card from the Figma **DevFest components** page (`Presentation card`, 9025:192): a talk bordered in its track color, with the abstract behind a disclosure button (ADR-0028).',
      },
    },
  },
  args: { talk: SAMPLE_TALK, expanded: false },
};
export default meta;

type Story = StoryObj<PresentationCard>;

/** Figma 9025:2 (AI, collapsed). */
export const Collapsed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: /Show abstract/ });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    await expect(canvas.getByText('Abstract text')).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: /Hide abstract/ }),
    ).toHaveAttribute('aria-expanded', 'true');
  },
};

/** Figma 9025:16 (AI, expanded). */
export const Expanded: Story = { args: { expanded: true } };

/** Figma 9025:192: every track. */
export const AllTracks: Story = {
  render: (args) => ({
    props: {
      ...args,
      talks: TRACKS.map((track) => ({ ...SAMPLE_TALK, track })),
    },
    template: `<div style="display: grid; gap: 1.5rem">
      @for (talk of talks; track talk.track) {
        <gdg-presentation-card [talk]="talk" />
      }
    </div>`,
  }),
};
