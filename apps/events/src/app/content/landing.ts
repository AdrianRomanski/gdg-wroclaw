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

const organizer = (
  name: string,
  photo: string,
  jobTitle?: string,
  linkedin?: string,
): Person => ({
  name,
  jobTitle,
  photo: { src: `/team/${photo}.jpg` },
  role: 'organizer',
  socials: linkedin ? [{ network: 'linkedin', url: linkedin }] : undefined,
});

/** The chapter organizers, as listed on gdg.community.dev/gdg-wroclaw (October 2026). */
const ORGANIZERS: readonly Person[] = [
  organizer('Karol Wrótniak', 'karol-wrotniak', 'GDG Organizer'),
  organizer('Artur Skrzypczyk', 'artur-skrzypczyk'),
  organizer(
    'Adrian Romański',
    'adrian-romanski',
    'Software Engineer, Push-Based',
  ),
  organizer(
    'Dawid Perdek',
    'dawid-perdek',
    'Staff Software Engineer, Altium',
    'https://www.linkedin.com/in/perdekdawid',
  ),
  organizer('Luka Malakhau', 'luka-malakhau', 'Software Developer'),
  organizer('Jan Łuczka', 'jan-luczka', 'Android Developer'),
  organizer(
    'Szymon Mazanik',
    'szymon-mazanik',
    'Flutter Lead',
    'https://www.linkedin.com/in/szymonmazanik/',
  ),
];

/**
 * Landing page content (ADR-0023). The team is real; events, partners and FAQ are still the
 * Figma sample content. No hero image yet, so the hero is left out and partners show initials.
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
    description:
      'The volunteers behind GDG Wrocław’s meetups, workshops and DevFest.',
    members: ORGANIZERS,
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
