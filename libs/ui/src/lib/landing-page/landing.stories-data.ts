import { SAMPLE_DAYS } from '../events-section/events.stories-data';
import type { FaqEntry } from '../faq/faq-section';
import { SAMPLE_PARTNERS } from '../partners-section/partners.stories-data';
import { SAMPLE_TEAM } from '../team-section/team.stories-data';
import type { LandingPageContent } from './landing-page-content';

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.';
const answer =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.';

const faq: FaqEntry[] = Array.from({ length: 4 }, () => ({
  question: 'Question text goes here',
  answer,
  open: true,
}));

/**
 * Story-only sample of the Figma Landing Page (ADR-0022), built from the section fixtures. The
 * hero is a neutral placeholder in apps/storybook/public/banners; this file is not exported from
 * the library.
 */
export const SAMPLE_LANDING: LandingPageContent = {
  heading: 'Google Developer Groups Wrocław: join our community',
  hero: { src: 'banners/landing-placeholder.svg' },
  events: { heading: 'Event', description: lorem, days: SAMPLE_DAYS },
  team: {
    description: lorem,
    members: SAMPLE_TEAM,
    ctaHeading: 'We’re hiring!',
    ctaText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    ctaHref: '#contact',
  },
  partners: {
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    partners: SAMPLE_PARTNERS.slice(0, 7),
    ctaHeading: 'Join us!',
    ctaText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    ctaHref: '#contact',
  },
  faq: {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    entries: faq,
    askHref: '#contact',
  },
};
