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
import { LandingPage } from './landing-page';
import { LANDING_SECTION_IDS } from './landing-page-content';
import { SAMPLE_LANDING } from './landing.stories-data';

// The Navbar and Footer come from the app shell; the story adds them to show the whole Figma page.
const links = [
  { label: 'Agenda', href: `#${LANDING_SECTION_IDS.events}` },
  { label: 'Speakers', href: `#${LANDING_SECTION_IDS.team}` },
  { label: 'Organizers', href: `#${LANDING_SECTION_IDS.team}` },
  { label: 'Q&A', href: `#${LANDING_SECTION_IDS.faq}` },
  { label: 'About us', href: `#${LANDING_SECTION_IDS.partners}` },
];

const meta: Meta<LandingPage> = {
  title: 'Pages/Landing',
  component: LandingPage,
  decorators: [moduleMetadata({ imports: [Navbar, Footer] })],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Landing page template from the Figma **Landing Page** (143:2897): hero, Events, Team, Partners carousel and FAQ. Presentational: the app passes a `LandingPageContent`; the Navbar and Footer belong to the app shell and are added here for the full page (ADR-0013, ADR-0022).',
      },
    },
  },
  args: { content: SAMPLE_LANDING },
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
      <main><gdg-landing-page [content]="content" /></main>
      <gdg-footer homeHref="#" [links]="links" [socials]="socials" [legalLinks]="legal" />
    `,
  }),
};
export default meta;

type Story = StoryObj<LandingPage>;

/** Figma 143:2897. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { level: 1, name: SAMPLE_LANDING.heading }),
    ).toBeInTheDocument();
    for (const name of ['Event', 'Our team', 'Partners', 'FAQs']) {
      await expect(
        canvas.getByRole('heading', { level: 2, name }),
      ).toBeVisible();
    }
  },
};

/** Before the hero image and partners are ready. */
export const Minimal: Story = {
  args: {
    content: {
      heading: SAMPLE_LANDING.heading,
      events: SAMPLE_LANDING.events,
      faq: SAMPLE_LANDING.faq,
    },
  },
};
