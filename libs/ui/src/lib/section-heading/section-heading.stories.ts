import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { SectionHeading } from './section-heading';

const meta: Meta<SectionHeading> = {
  title: 'UI/DevFest/Section Heading',
  component: SectionHeading,
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
          'Section heading from the Figma **DevFest components** page (`Section heading`, 9041:607): a centered yellow overline, the `<h2>` and a description. Smaller below 48rem (ADR-0028).',
      },
    },
  },
  args: {
    overline: 'AGENDA / DEVFEST 2026',
    heading: 'Agenda & Stages',
    description: 'Opis sekcji',
  },
};
export default meta;

type Story = StoryObj<SectionHeading>;

/** Figma 9027:148 (desktop); 9041:603 below 48rem. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', {
        level: 2,
        name: 'Agenda & Stages',
      }),
    ).toBeVisible();
  },
};

export const WithoutOverline: Story = { args: { overline: '' } };
