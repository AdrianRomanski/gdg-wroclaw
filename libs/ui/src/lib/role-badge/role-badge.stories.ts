import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { type PersonRole, RoleBadge } from './role-badge';

const roles: PersonRole[] = ['member', 'organizer', 'speaker'];

const meta: Meta<RoleBadge> = {
  title: 'UI/Role Badge',
  component: RoleBadge,
  decorators: [
    // The product is dark by default (ADR-0008).
    componentWrapperDecorator(
      (story) =>
        `<div style="display: flex; flex-wrap: wrap; gap: 1.5rem; padding: 1.5rem; background: var(--gdg-color-background-default)">${story}</div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Role badge from the Figma **Team/Partners** page (Badge component set): the GDG logo above a role icon. Member is blue, Organizer green, Speaker yellow. `ring` is Figma `Stroke`. It is an image named after the role; pass `label` to translate it (ADR-0016).',
      },
    },
  },
  args: { role: 'speaker', ring: true, size: 120 },
  argTypes: {
    role: { control: 'inline-radio', options: roles },
    size: { control: { type: 'range', min: 24, max: 240, step: 1 } },
  },
};
export default meta;

type Story = StoryObj<RoleBadge>;

export const Default: Story = {};

/** The Figma component set: every role, with and without the ring. */
export const AllVariants: Story = {
  render: () => ({
    template: [true, false]
      .flatMap((ring) =>
        roles.map(
          (role) =>
            `<gdg-role-badge role="${role}" [ring]="${ring}" [size]="120" />`,
        ),
      )
      .join(''),
  }),
};

/** 55px, as in the Workshop trainer rows. */
export const Small: Story = {
  render: () => ({
    template: roles.map((role) => `<gdg-role-badge role="${role}" />`).join(''),
  }),
};
