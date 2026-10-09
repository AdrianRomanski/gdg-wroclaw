import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, userEvent, within } from 'storybook/test';
import { FaqItem, type FaqItemColor, type FaqItemVariant } from './faq-item';

interface FaqItemArgs {
  question: string;
  answer: string;
  variant: FaqItemVariant;
  color: FaqItemColor;
  open: boolean;
}

const colors: FaqItemColor[] = ['green', 'yellow', 'red', 'blue'];
const answer =
  'Yes. Every GDG Wrocław meetup and workshop is free; we only ask you to register so we can plan the room, the pizza and the Wi-Fi.';

const meta: Meta<FaqItemArgs> = {
  title: 'UI/FAQ Item',
  component: FaqItem,
  decorators: [
    // The product is dark by default (ADR-0008).
    componentWrapperDecorator(
      (story) =>
        `<div style="display: grid; gap: 1.5rem; max-inline-size: 700px; padding: 1.5rem; background: var(--gdg-color-background-default)">${story}</div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'FAQ item from the Figma **FAQs** page in two variants: `puzzle` (Border puzzle=True, an outline generated for the actual size so it fits any answer) and `plain` (Border puzzle=False, a 2px rounded stroke). Four brand colors. A native `<details>` disclosure; the answer is projected (ADR-0015).',
      },
    },
  },
  args: {
    question: 'Are the events free?',
    answer,
    variant: 'puzzle',
    color: 'green',
    open: true,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['puzzle', 'plain'] },
    color: { control: 'inline-radio', options: colors },
  },
  render: (args) => ({
    props: args,
    template: `<gdg-faq-item [question]="question" [variant]="variant" [color]="color" [open]="open">{{ answer }}</gdg-faq-item>`,
  }),
};
export default meta;

type Story = StoryObj<FaqItemArgs>;

export const Puzzle: Story = {};

export const Plain: Story = {
  args: { variant: 'plain' },
};

export const Collapsed: Story = {
  args: { open: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const summary = canvas.getByText('Are the events free?');
    await expect(canvas.queryByText(answer)).not.toBeVisible();
    await userEvent.click(summary);
    await expect(canvas.getByText(answer)).toBeVisible();
  },
};

/** The Figma component set: both variants in every color. */
export const AllVariants: Story = {
  render: () => ({
    props: { answer },
    template: (['puzzle', 'plain'] as const)
      .flatMap((variant) =>
        colors.map(
          (color) =>
            `<gdg-faq-item question="${variant} / ${color}" variant="${variant}" color="${color}" open>{{ answer }}</gdg-faq-item>`,
        ),
      )
      .join(''),
  }),
};
