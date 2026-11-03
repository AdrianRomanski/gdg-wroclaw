import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, userEvent, within } from 'storybook/test';
import { PersonBio } from './person-bio';

const meta: Meta<PersonBio> = {
  title: 'UI/DevFest/Person Bio',
  component: PersonBio,
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
          'A "Pokaż bio" button that opens the person\'s bio in a modal dialog, or says it is coming soon (ADR-0034). Not in Figma.',
      },
    },
  },
  args: {
    person: {
      name: 'Imię Nazwisko',
      initials: 'OT',
      bio: [
        'Pierwszy akapit bio: doświadczenie i obecna rola.',
        'Drugi akapit: społeczność i wystąpienia.',
      ],
    },
    color: 'red',
  },
};
export default meta;

type Story = StoryObj<PersonBio>;

/** Opens the dialog with the bio. */
export const WithBio: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Pokaż bio/ }));
    await expect(
      canvas.getByRole('dialog', { name: 'Imię Nazwisko' }),
    ).toBeVisible();
  },
};

/** No bio yet: the dialog says it is coming soon. */
export const ComingSoon: Story = {
  args: { person: { name: 'Imię Nazwisko', initials: 'OT' } },
};
