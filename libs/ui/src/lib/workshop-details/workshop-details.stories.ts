import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { SAMPLE_WORKSHOP } from '../workshop-page/workshop.stories-data';
import { WorkshopDetails } from './workshop-details';

const meta: Meta<WorkshopDetails> = {
  title: 'UI/Workshop Details',
  component: WorkshopDetails,
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
          'Workshop details from the Figma **Workshop Page**: the topic as the page `<h1>`, the description and the trainers as `PersonRow`s (ADR-0017).',
      },
    },
  },
  args: {
    topic: SAMPLE_WORKSHOP.topic,
    description: SAMPLE_WORKSHOP.description,
    trainers: SAMPLE_WORKSHOP.trainers,
    trainersHeading: 'Trainers',
  },
};
export default meta;

type Story = StoryObj<WorkshopDetails>;

export const Default: Story = {};

export const WithoutTrainers: Story = {
  args: { trainers: [] },
};
