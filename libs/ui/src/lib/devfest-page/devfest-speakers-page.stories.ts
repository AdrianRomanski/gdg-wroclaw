import { type Meta, type StoryObj } from '@analogjs/storybook-angular';
import { expect, userEvent, within } from 'storybook/test';
import { DevfestSpeakersPage } from './devfest-speakers-page';
import { SAMPLE_SPEAKERS_PAGE } from './devfest-page.stories-data';

const meta: Meta<DevfestSpeakersPage> = {
  title: 'Pages/DevFest Speakers',
  component: DevfestSpeakersPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'DevFest speakers page from the Figma **DevFest** page: `Speaker directory — Desktop` (9044:2755) and `— Mobile` (9044:3192). The Role navigation shows everyone or one group; the track chips filter the people and can be cleared again (ADR-0029).',
      },
    },
  },
  args: { content: SAMPLE_SPEAKERS_PAGE },
};
export default meta;

type Story = StoryObj<DevfestSpeakersPage>;

/** Figma 9044:2755, with shortened copy. */
export const Directory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Prowadzący paneli' }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'Trenerzy' }));
    await expect(
      canvas.getByText('Lista trenerów warsztatów pojawi się tutaj.'),
    ).toBeVisible();
    await expect(
      canvas.queryByRole('heading', { name: 'Prowadzący paneli' }),
    ).not.toBeInTheDocument();
  },
};
