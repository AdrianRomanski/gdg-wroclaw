import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import type { Person } from '../person/person';
import { PersonRow } from './person-row';

const socials: Person['socials'] = [
  { network: 'linkedin', url: 'https://www.linkedin.com/' },
  { network: 'x', url: 'https://x.com/' },
  { network: 'dribbble', url: 'https://dribbble.com/' },
];
const bio =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.';

// Sample photos from the Figma Workshop page, served from apps/storybook/public (ADR-0016).
const trainers: Person[] = [
  {
    name: 'Full name',
    jobTitle: 'Job title',
    bio,
    role: 'speaker',
    photo: { src: 'people/trainer-1.jpg' },
    socials,
  },
  {
    name: 'Full name',
    jobTitle: 'Job title',
    bio,
    role: 'speaker',
    photo: { src: 'people/trainer-2.jpg' },
    socials,
  },
  {
    name: 'Full name',
    jobTitle: 'Job title',
    bio,
    role: 'member',
    photo: { src: 'people/trainer-3.jpg' },
    socials,
  },
];

const meta: Meta<PersonRow> = {
  title: 'UI/Person Row',
  component: PersonRow,
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
          'Person row from the Figma **Workshop Page** (trainer card): photo, role badge, name, job title, bio and social links, with a divider above. Takes a `Person`, the data shape shared with the Team page (ADR-0016).',
      },
    },
  },
  args: { person: trainers[0] },
};
export default meta;

type Story = StoryObj<PersonRow>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'Full name' }),
    ).toBeVisible();
    await expect(canvas.getByRole('img', { name: 'Speaker' })).toBeVisible();
  },
};

/** Three trainers, as on the Figma Workshop page. */
export const List: Story = {
  render: () => ({
    props: { trainers },
    template: `@for (trainer of trainers; track $index) { <gdg-person-row [person]="trainer" /> }`,
  }),
};

export const WithoutPhoto: Story = {
  args: {
    person: {
      name: 'Grace Hopper',
      jobTitle: 'Organizer, GDG Wrocław',
      bio,
      role: 'organizer',
      socials: [{ network: 'github', url: 'https://github.com/' }],
    },
  },
};

export const Minimal: Story = {
  args: {
    person: { name: 'Alan Turing', photo: { src: 'people/trainer-2.jpg' } },
  },
};
