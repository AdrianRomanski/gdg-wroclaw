import {
  moduleMetadata,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';
import {
  SAMPLE_COMMUNITY_SOCIALS,
  SAMPLE_LEGAL_LINKS,
  SAMPLE_NAV_ACTIONS,
} from '../navbar/site.stories-data';
import { EventPage } from './event-page';
import { EVENT_SECTION_IDS } from './event-detail';
import { SAMPLE_EVENT } from './event.stories-data';

// The Navbar and Footer come from the app shell; the story adds them to show the whole Figma page.
const links = [
  { label: 'Speakers', href: `#${EVENT_SECTION_IDS.speakers}` },
  { label: 'Schedule', href: `#${EVENT_SECTION_IDS.schedule}` },
  { label: 'Venue', href: `#${EVENT_SECTION_IDS.venue}` },
  { label: 'Organizers', href: `#${EVENT_SECTION_IDS.organizers}` },
  { label: 'Partners', href: `#${EVENT_SECTION_IDS.supporters}` },
];

const meta: Meta<EventPage> = {
  title: 'Pages/Event',
  component: EventPage,
  decorators: [moduleMetadata({ imports: [Navbar, Footer] })],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Event page template from the Figma **Event detail** page (8927:6018): overview, speakers and talks, schedule, venue, organizers, partners and sponsors, and the registration callout. Presentational: the app passes an `EventDetail`; sections without data are left out. The Navbar and Footer belong to the app shell and are added here for the full page (ADR-0013, ADR-0025).',
      },
    },
  },
  args: { event: SAMPLE_EVENT },
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
      <main><gdg-event-page [event]="event" /></main>
      <gdg-footer homeHref="#" [links]="links" [socials]="socials" [legalLinks]="legal" />
    `,
  }),
};
export default meta;

type Story = StoryObj<EventPage>;

/** Figma 8927:6018, with its sample copy. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 1, name: /DevFest 2026/ }),
    ).toBeVisible();
    for (const name of [
      'Speakers & their talks',
      'Schedule',
      'The Foundry',
      'Meet your organizers',
      'Partners & sponsors',
      'Your next idea starts here.',
    ]) {
      await expect(
        canvas.getByRole('heading', { level: 2, name }),
      ).toBeVisible();
    }
  },
};

/** An announced event: only the overview and registration, before speakers and agenda exist. */
export const Announced: Story = {
  args: {
    event: {
      title: SAMPLE_EVENT.title,
      tagline: SAMPLE_EVENT.tagline,
      label: SAMPLE_EVENT.label,
      summary: SAMPLE_EVENT.summary,
      back: SAMPLE_EVENT.back,
      primaryAction: SAMPLE_EVENT.primaryAction,
      facts: SAMPLE_EVENT.facts,
      registration: SAMPLE_EVENT.registration,
    },
  },
};
