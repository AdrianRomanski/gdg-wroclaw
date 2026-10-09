import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { EventBanner } from './event-banner';

const meta: Meta<EventBanner> = {
  title: 'UI/Event Banner',
  component: EventBanner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Full-width event banner from the Figma **Workshop Page**, at Figma's 1440 : 449 ratio. Pass the event's image (e.g. the GDG brand-kit header with the location filled in); the story uses a neutral placeholder (ADR-0017).",
      },
    },
  },
  args: { src: 'banners/placeholder.svg', alt: '' },
};
export default meta;

type Story = StoryObj<EventBanner>;

export const Default: Story = {};
