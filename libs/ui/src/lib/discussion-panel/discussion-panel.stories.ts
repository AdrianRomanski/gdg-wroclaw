import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { SAMPLE_PANEL } from '../devfest-session/devfest.stories-data';
import { DiscussionPanel } from './discussion-panel';

const meta: Meta<DiscussionPanel> = {
  title: 'UI/DevFest/Discussion Panel',
  component: DiscussionPanel,
  decorators: [
    // The product is dark by default (ADR-0008); 1168px is the Figma desktop width.
    componentWrapperDecorator(
      (story) =>
        `<div style="padding: 1.5rem; background: var(--gdg-color-background-default)"><div style="max-inline-size: 73rem">${story}</div></div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Discussion panel from the Figma **DevFest components** page (`Discussion panel`, 9041:602): tags, the title after a track rule, the host and the panelists. Narrower than 48rem it uses the Figma mobile layout (ADR-0028).',
      },
    },
  },
  args: {
    panel: SAMPLE_PANEL,
    hostLabel: 'Host',
  },
};
export default meta;

type Story = StoryObj<DiscussionPanel>;

/** Figma 9041:273 (AI, desktop). */
export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'AI Panel' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('list', { name: 'Panelists / 5 people' }),
    ).toBeVisible();
  },
};

/** Figma 9041:314 (AI, mobile): 358px wide. */
export const Mobile: Story = {
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-inline-size: 22.375rem">${story}</div>`,
    ),
  ],
};

/** Figma 9041:602: the Web, Mobile and Cloud tracks. */
export const Tracks: Story = {
  render: (args) => ({
    props: {
      ...args,
      panels: (['web', 'mobile', 'cloud'] as const).map((track) => ({
        ...SAMPLE_PANEL,
        track,
        title: `${track[0].toUpperCase()}${track.slice(1)} Panel`,
      })),
    },
    template: `<div style="display: grid; gap: 1.5rem">
      @for (panel of panels; track panel.track) {
        <gdg-discussion-panel [panel]="panel" />
      }
    </div>`,
  }),
};
