import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { TeamSection } from './team-section';
import { SAMPLE_TEAM } from './team.stories-data';

const meta: Meta<TeamSection> = {
  title: 'UI/Team Section',
  component: TeamSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Team section from the Figma **Team/Partners** page (`Team / 2 /`): centered title, the people as `PersonCard`s in a `circle` or `puzzle` frame, and an optional call to action (ADR-0013, ADR-0018).',
      },
    },
  },
  args: {
    heading: 'Our team',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    members: SAMPLE_TEAM,
    frame: 'circle',
    badges: true,
    ctaHeading: 'We’re hiring!',
    ctaText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    ctaHref: '#',
    ctaLabel: 'Contact us',
  },
  argTypes: {
    frame: { control: 'inline-radio', options: ['circle', 'puzzle'] },
  },
};
export default meta;

type Story = StoryObj<TeamSection>;

/** Figma 181:5312. */
export const Circle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Our team' }),
    ).toBeVisible();
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(9);
    await expect(
      canvas.getByRole('link', { name: 'Contact us' }),
    ).toBeVisible();
  },
};

/** Figma 181:4620. */
export const Puzzle: Story = {
  args: { frame: 'puzzle' },
};

/** An incomplete last row is centered. */
export const FewMembers: Story = {
  args: {
    members: SAMPLE_TEAM.slice(0, 6),
    ctaHeading: '',
    ctaHref: undefined,
  },
};
