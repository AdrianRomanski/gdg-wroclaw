import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { Panelist } from './panelist';

const meta: Meta<Panelist> = {
  title: 'UI/DevFest/Panelist',
  component: Panelist,
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
          'Panelist from the Figma **DevFest components** page (`Panelist`, 9041:272): an S avatar and the name, stacked or inline (ADR-0028).',
      },
    },
  },
  args: { person: { name: 'Imię Nazwisko', initials: 'OT' } },
  argTypes: {
    layout: { control: 'inline-radio', options: ['stacked', 'inline'] },
    accent: {
      control: 'select',
      options: [undefined, 'red', 'yellow', 'green', 'blue', 'contrast'],
    },
  },
};
export default meta;

type Story = StoryObj<Panelist>;

/** Figma 9040:285. */
export const Stacked: Story = { args: { layout: 'stacked' } };

/** Figma 9041:269. */
export const Inline: Story = { args: { layout: 'inline' } };
