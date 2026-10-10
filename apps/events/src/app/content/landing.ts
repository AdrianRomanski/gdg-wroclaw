import type { EventDay, LandingPageContent, Partner } from '@gdg-wroclaw/ui';
import { ORGANIZERS } from './organizers';

/** Upcoming events; "Read more" opens the event page (`/workshops/:slug`). */
const EVENTS: readonly EventDay[] = [
  {
    label: '29.10',
    ariaLabel: '29 October 2026',
    events: [
      {
        title: 'AI & Cloud Stream Meetup',
        time: '18:00–20:30',
        dateTime: '2026-10-29T18:00+01:00',
        location: 'Capgemini, Legnicka 48H, Wrocław',
        description:
          'An evening of AI and cloud talks: building, deploying and evaluating agents on Google Cloud, and a personal mind trainer that pairs a local Gemma model with Gemini. Pizza and networking included.',
        href: '/workshops/ai-cloud-stream-meetup',
      },
    ],
  },
];

/** Community partners; logos are self-hosted in `apps/events/public/partners`. */
const PARTNERS: readonly Partner[] = [
  {
    name: 'meet.js',
    logo: { src: '/partners/meetjs.svg' },
    url: 'https://meetjs.pl/',
  },
  {
    name: 'Sekurak',
    logo: { src: '/partners/sekurak.png' },
    url: 'https://sekurak.pl/',
  },
];

/**
 * Landing page content (ADR-0023): the hero banner, events, team, partners and FAQ.
 */
export const LANDING_CONTENT: LandingPageContent = {
  heading: 'Google Developer Groups Wrocław: join our community',
  // Figma: GDG-Pro-Digital-LandingPageHeader-1440x500-Blue (143:2917). Its text repeats the
  // heading above, so the image stays decorative (empty alt).
  hero: { src: '/banners/landing-header.jpg' },
  events: {
    heading: 'Event',
    description:
      'Meetups, workshops and DevFest for developers in Wrocław. Pick a day to see what’s on.',
    days: EVENTS,
  },
  team: {
    description:
      'The volunteers behind GDG Wrocław’s meetups, workshops and DevFest.',
    members: ORGANIZERS,
    ctaHeading: 'Want to help organize?',
    ctaText:
      'We’re always looking for volunteers to help run meetups, workshops and DevFest.',
    ctaHref: '/contact',
  },
  partners: {
    description: 'Communities and companies that support GDG Wrocław.',
    partners: PARTNERS,
    ctaHeading: 'Become a partner',
    ctaText: 'Want to support the community or host a meetup? Get in touch.',
    ctaHref: '/contact',
  },
  faq: {
    description: 'New to GDG Wrocław? Start here.',
    entries: [
      {
        question: 'What is GDG Wrocław?',
        answer:
          'Google Developer Groups (GDG) are local communities of developers interested in Google technologies, part of the Google for Developers community program. GDG Wrocław runs meetups, workshops and DevFest in Wrocław.',
        open: true,
      },
      {
        question: 'How do I sign up for an event?',
        answer:
          'Every event has a page on gdg.community.dev with its date, venue and agenda. RSVP there; join the GDG Wrocław chapter to hear about new events first.',
      },
      {
        question: 'Can I give a talk?',
        answer:
          'Yes. Send us your topic through the contact form and we’ll get back to you about an upcoming meetup.',
      },
      {
        question: 'How can my company get involved?',
        answer:
          'Companies can host a meetup or support the community as a partner. Get in touch through the contact form.',
      },
    ],
    askHref: '/contact',
  },
};
