import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { type FaqEntry, FaqSection } from './faq-section';

const entries: FaqEntry[] = [
  {
    question: 'Are the events free?',
    answer:
      'Yes. Every meetup and workshop is free; we only ask you to register so we can plan the room and the pizza.',
    open: true,
  },
  {
    question: 'Do I need to be an expert?',
    answer:
      'Not at all. Talks range from first steps to deep dives, and workshops list what you should know beforehand.',
    open: true,
  },
  {
    question: 'Can I give a talk?',
    answer:
      'We are always looking for speakers, first-timers included. Send us a short abstract through the contact form.',
    open: true,
  },
  {
    question: 'How do I become a partner?',
    answer:
      'Companies can host a meetup, sponsor a DevFest or run a workshop. Write to us and we will find a format that fits.',
    open: true,
  },
];

const meta: Meta<FaqSection> = {
  title: 'UI/FAQ Section',
  component: FaqSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'FAQ section from the Figma **FAQs** page (`FAQ / 11 /`): section title with an optional "Ask a question" link, and the questions as `FaqItem`s in the `puzzle` or `plain` variant (ADR-0013, ADR-0015).',
      },
    },
  },
  args: {
    heading: 'FAQs',
    description:
      'Everything you wanted to know about GDG Wrocław meetups, workshops and DevFest.',
    entries,
    variant: 'puzzle',
    color: 'green',
    askHref: '#',
    askLabel: 'Ask a question',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['puzzle', 'plain'] },
    color: {
      control: 'inline-radio',
      options: ['green', 'yellow', 'red', 'blue'],
    },
  },
};
export default meta;

type Story = StoryObj<FaqSection>;

/** Figma 181:6549. */
export const Puzzle: Story = {};

/** Figma 181:6770. */
export const Plain: Story = {
  args: { variant: 'plain' },
};

export const Collapsed: Story = {
  args: {
    entries: entries.map((entry) => ({ ...entry, open: false })),
  },
};
