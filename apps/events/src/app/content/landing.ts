import type { GdgEvent, LandingPageContent, Person } from '@gdg-wroclaw/ui';

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.';
const short = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

const event = (tag?: string): GdgEvent => ({
  title: 'Event title heading',
  time: 'event start time',
  location: 'Location',
  description: lorem,
  tag,
  href: '/workshops/sample-workshop',
});

const person = (role: Person['role']): Person => ({
  name: 'Full name',
  bio: lorem,
  role,
});

/**
 * Landing page content: the Figma sample content until the real events, team, partners and
 * FAQ are ready (ADR-0023). No images yet, so the hero is left out and people and partners show
 * initials.
 */
export const LANDING_CONTENT: LandingPageContent = {
  heading: 'Google Developer Groups Wrocław: join our community',
  events: {
    heading: 'Event',
    description: lorem,
    days: ['29.06', '30.06', '01.07', '02.07', '03.07', '04.07'].map(
      (label, index) => ({
        label,
        events:
          index === 0
            ? [event('Sold out'), event(), event()]
            : [event(), event()],
      }),
    ),
  },
  team: {
    description: lorem,
    members: (
      [
        'organizer',
        'speaker',
        'member',
        'organizer',
        'speaker',
        'member',
        'organizer',
        'speaker',
      ] as const
    ).map(person),
    ctaHeading: 'We’re hiring!',
    ctaText: short,
    ctaHref: '/contact',
  },
  partners: {
    description: short,
    partners: Array.from({ length: 7 }, (_, index) => ({
      name: `Partner ${index + 1}`,
    })),
    ctaHeading: 'Join us!',
    ctaText: short,
    ctaHref: '/contact',
  },
  faq: {
    description: lorem,
    entries: Array.from({ length: 4 }, (_, index) => ({
      question: 'Question text goes here',
      answer: `${lorem} Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.`,
      open: index === 0,
    })),
    askHref: '/contact',
  },
};
