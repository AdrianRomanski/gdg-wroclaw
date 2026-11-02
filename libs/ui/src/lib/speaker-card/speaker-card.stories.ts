import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, userEvent, within } from 'storybook/test';
import {
  SAMPLE_SPEAKER,
  TRACKS,
} from '../devfest-session/devfest.stories-data';
import { SpeakerCard } from './speaker-card';

const meta: Meta<SpeakerCard> = {
  title: 'UI/DevFest/Speaker Card',
  component: SpeakerCard,
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
          'Speaker card from the Figma **DevFest components** page (`Speaker card`, 9040:373): the avatar ringed in the track color, the track tag, name, role and talk (ADR-0028).',
      },
    },
  },
  args: { speaker: SAMPLE_SPEAKER },
};
export default meta;

type Story = StoryObj<SpeakerCard>;

/** Figma 9040:314 (AI): 308px wide. */
export const Default: Story = {
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-inline-size: 19.25rem">${story}</div>`,
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', { name: 'Imię Nazwisko' }),
    ).toBeVisible();
  },
};

/** Figma 9040:373: every track. */
export const AllTracks: Story = {
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(19.25rem, 1fr)); gap: 1.5rem; max-inline-size: 62rem">${story}</div>`,
    ),
  ],
  render: (args) => ({
    props: {
      ...args,
      speakers: TRACKS.map((track) => ({ ...SAMPLE_SPEAKER, track })),
    },
    template: `@for (speaker of speakers; track speaker.track) {
      <gdg-speaker-card [speaker]="speaker" />
    }`,
  }),
};

/** With a bio behind the disclosure button (ADR-0030). */
export const WithBio: Story = {
  args: {
    speaker: {
      ...SAMPLE_SPEAKER,
      bio: [
        'Pierwszy akapit bio: doświadczenie i obecna rola.',
        'Drugi akapit: społeczność, wystąpienia i projekty open source.',
      ],
    },
  },
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-inline-size: 19.25rem">${story}</div>`,
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Pokaż bio/ }));
    await expect(
      canvas.getByText(
        'Drugi akapit: społeczność, wystąpienia i projekty open source.',
      ),
    ).toBeVisible();
  },
};
