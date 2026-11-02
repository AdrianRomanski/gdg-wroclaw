import {
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, userEvent, within } from 'storybook/test';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';
import {
  SAMPLE_COMMUNITY_SOCIALS,
  SAMPLE_LEGAL_LINKS,
  SAMPLE_NAV_ACTIONS,
} from '../navbar/site.stories-data';
import { DevfestAgendaPage } from './devfest-agenda-page';
import {
  SAMPLE_AGENDA_PAGE,
  SAMPLE_AGENDA_PAGE_WITH_WORKSHOPS,
} from './devfest-page.stories-data';

const links = [
  { label: 'Agenda', href: '#agenda', current: true },
  { label: 'Speakers', href: '#' },
];

// The Navbar and Footer come from the app shell; the story adds them to show the whole Figma page.
const meta: Meta<DevfestAgendaPage> = {
  title: 'Pages/DevFest Agenda',
  component: DevfestAgendaPage,
  decorators: [moduleMetadata({ imports: [Navbar, Footer] })],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'DevFest agenda page from the Figma **DevFest** page: `Day 1 desktop — Main stage` (9043:2020) and `Day 2 desktop — Presentations` (9028:1211), with their mobile frames. The Day toggle switches between the main stage timeline and the parallel-rooms schedule; the chips filter by format and track (ADR-0029).',
      },
    },
  },
  args: { content: SAMPLE_AGENDA_PAGE, day: 'main-stage' },
  render: (args) => ({
    props: {
      ...args,
      links,
      actions: SAMPLE_NAV_ACTIONS,
      socials: SAMPLE_COMMUNITY_SOCIALS,
      legal: SAMPLE_LEGAL_LINKS,
    },
    template: `
      <gdg-navbar homeHref="#" [links]="links" [actions]="actions" />
      <main><gdg-devfest-agenda-page [content]="content" [day]="day" /></main>
      <gdg-footer homeHref="#" [links]="links" [socials]="socials" [legalLinks]="legal" />
    `,
  }),
};
export default meta;

type Story = StoryObj<DevfestAgendaPage>;

/** Figma 9043:2020: day 1 on the main stage. */
export const MainStage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Harmonogram & Sceny' }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Web' }));
    await expect(
      canvas.queryByRole('heading', { name: 'AI Panel' }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole('heading', { name: 'Web Panel' }),
    ).toBeVisible();
  },
};

/** Figma 9028:1211: day 2, talks in two rooms. */
export const ParallelRooms: Story = {
  args: { day: 'parallel' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'Otwarcie eventu' }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Warsztaty (Hands-on Labs)' }),
    );
    await expect(
      canvas.getByText('Harmonogram warsztatów pojawi się tutaj.'),
    ).toBeVisible();
  },
};

/** Day 2 with the workshop agenda published: one workshop room, filtered by track. */
export const Workshops: Story = {
  args: { content: SAMPLE_AGENDA_PAGE_WITH_WORKSHOPS, day: 'parallel' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Warsztaty (Hands-on Labs)' }),
    );
    await expect(
      canvas.getByRole('heading', { name: 'The Agents Optimization Lab' }),
    ).toBeVisible();
  },
};
