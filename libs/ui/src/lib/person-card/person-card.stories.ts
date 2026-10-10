import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { samplePerson } from '../team-section/team.stories-data';
import { PersonCard } from './person-card';

const roles = ['organizer', 'speaker', 'member'] as const;

// 296px, the Figma card width.
const cardWidth = componentWrapperDecorator(
  (story) => `<div style="max-inline-size: 18.5rem">${story}</div>`,
);

const meta: Meta<PersonCard> = {
  title: 'UI/Person Card',
  component: PersonCard,
  decorators: [
    // The product is dark by default (ADR-0008).
    componentWrapperDecorator(
      (story) =>
        `<div style="box-sizing: border-box; inline-size: max-content; min-inline-size: 100%; padding: 1.5rem; background: var(--gdg-color-background-default)">${story}</div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Person card from the Figma **Team/Partners** page (`Person`, 180:3087): photo in a `circle` or role-colored `puzzle` frame, role badge, name, bio and social links. Takes a `Person` (ADR-0016, ADR-0018).',
      },
    },
  },
  args: { person: samplePerson('organizer'), frame: 'circle', badge: true },
  argTypes: {
    frame: { control: 'inline-radio', options: ['circle', 'puzzle'] },
  },
};
export default meta;

type Story = StoryObj<PersonCard>;

/** Figma `Badge=True, Role=Organizer, Color border=False`. */
export const Circle: Story = {
  decorators: [cardWidth],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'Full name' }),
    ).toBeVisible();
    await expect(canvas.getByRole('img', { name: 'Organizer' })).toBeVisible();
  },
};

/** Figma `Badge=True, Role=Organizer, Color border=True`. */
export const Puzzle: Story = {
  decorators: [cardWidth],
  args: { frame: 'puzzle' },
};

/** Figma `Badge=False`: the job title replaces the badge and role. */
export const WithoutBadge: Story = {
  decorators: [cardWidth],
  args: { badge: false },
};

/** All twelve Figma variants: badge on and off, both frames, three roles. */
export const AllVariants: Story = {
  render: () => ({
    props: { people: roles.map(samplePerson) },
    template: `
      <div style="display: grid; grid-template-columns: repeat(6, 18.5rem); gap: 2.5rem 1.5rem">
        @for (frame of ['circle', 'puzzle']; track frame) {
          @for (badge of [true, false]; track badge) {
            @for (person of people; track $index) {
              <gdg-person-card [person]="person" [frame]="$any(frame)" [badge]="badge" />
            }
          }
        }
      </div>
    `,
  }),
};

export const WithoutPhoto: Story = {
  decorators: [cardWidth],
  args: {
    person: {
      ...samplePerson('speaker'),
      photo: undefined,
      name: 'Grace Hopper',
    },
    frame: 'puzzle',
  },
};
