import type { Person } from '../person/person';
import type { EventDetail } from './event-detail';
import { EVENT_SECTION_IDS } from './event-detail';

const bio =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.';

const socials: Person['socials'] = [
  { network: 'linkedin', url: '#' },
  { network: 'x', url: '#' },
  { network: 'dribbble', url: '#' },
];

const person = (photo: number, role: Person['role']): Person => ({
  name: 'Dawid Perdek',
  bio,
  role,
  photo: { src: `people/trainer-${photo}.jpg` },
  socials,
});

const partner = (name: string) => ({
  name,
  logo: { src: 'partners/placeholder.svg' },
});

/**
 * Story-only sample of the Figma Event detail page (8927:6018, ADR-0025), with the Figma sample
 * copy. Photos and logos are neutral placeholders in apps/storybook/public; this file is not
 * exported from the library.
 */
export const SAMPLE_EVENT: EventDetail = {
  title: 'DevFest 2026',
  tagline: 'Build what’s next.',
  label: 'In-person event',
  labelNote: 'Sample event · GDG London',
  summary:
    'An afternoon of practical AI, cloud and web development. Learn from local builders, ask the big questions and meet the people behind the code.',
  back: { label: 'All events', href: '#' },
  primaryAction: { label: 'Register', href: '#register' },
  secondaryAction: {
    label: 'See the schedule',
    href: `#${EVENT_SECTION_IDS.schedule}`,
  },
  actionNote: 'Everyone is welcome',
  facts: [
    {
      icon: 'calendar-dots',
      label: 'Date',
      value: 'Saturday, 14 November 2026',
      detail: 'One afternoon. A whole lot of ideas.',
    },
    {
      icon: 'clock',
      label: 'Time',
      value: '13:00–18:00 GMT',
      detail: 'Doors open at 13:00 · Talks start at 13:30',
    },
    {
      icon: 'map-pin',
      label: 'Location',
      value: 'The Foundry · London',
      detail: 'Sample venue · 12 Studio Lane, London E2',
    },
  ],
  speakers: {
    eyebrow: 'Learn from local builders',
    heading: 'Speakers & their talks',
    description:
      'Two perspectives. Real-world lessons. Plenty of time for your questions.',
    talks: [
      {
        speaker: person(2, 'speaker'),
        topic: 'AI · 45 min',
        time: '13:45–14:30',
        title: 'From prompt to product with Gemini',
        description:
          'Go beyond the demo. Learn how to ground responses, evaluate quality and build a reliable AI feature with the Gemini API.',
      },
      {
        speaker: person(1, 'speaker'),
        topic: 'Cloud · 45 min',
        time: '14:30–15:15',
        title: 'Ship your first app on Cloud Run',
        description:
          'From local code to a production service: containers, deployment, observability and the practical choices that keep your app running.',
      },
    ],
  },
  schedule: {
    eyebrow: 'Your afternoon, planned',
    heading: 'Schedule',
    description:
      'Saturday, 14 November 2026. One track, shared discoveries and room to connect.',
    timezoneNote: 'All times in GMT · Doors at 13:00',
    note: 'Joining the build lab? Bring a laptop and a curious mind. Starter code will be provided.',
    sessions: [
      {
        start: '13:00',
        duration: '30 min',
        title: 'Check-in & coffee',
        detail: 'Meet the community · Foyer',
        type: 'Welcome',
      },
      {
        start: '13:30',
        duration: '15 min',
        title: 'Welcome to DevFest',
        detail: 'Dawid Perdek · Main stage',
        type: 'Opening',
      },
      {
        start: '13:45',
        duration: '45 min',
        title: 'From prompt to product with Gemini',
        detail: 'Alex Morgan · Main stage',
        type: 'Talk',
        highlight: true,
      },
      {
        start: '14:30',
        duration: '45 min',
        title: 'Ship your first app on Cloud Run',
        detail: 'Sam Rivera · Main stage',
        type: 'Talk',
        highlight: true,
      },
      {
        start: '15:15',
        duration: '30 min',
        title: 'Coffee, conversations & a reset',
        detail: 'Everyone · Foyer',
        type: 'Break',
      },
      {
        start: '15:45',
        duration: '60 min',
        title: 'Build lab: bring AI to your web app',
        detail: 'Alex Morgan & Sam Rivera · Main stage',
        type: 'Workshop',
        highlight: true,
      },
      {
        start: '16:45',
        duration: '30 min',
        title: 'Ask the speakers: open Q&A',
        detail: 'Alex Morgan & Sam Rivera · Hosted by Nina Patel',
        type: 'Q&A',
      },
      {
        start: '17:15',
        duration: '45 min',
        title: 'Community connections & closing',
        detail: 'Dawid Perdek & Nina Patel · Foyer',
        type: 'Networking',
      },
    ],
  },
  venue: {
    eyebrow: 'Meet us here',
    heading: 'The Foundry',
    description: '12 Studio Lane, London E2 · Sample venue',
    photo: { src: 'banners/placeholder.svg' },
    arrival:
      'Head to the main entrance on Studio Lane. Our volunteers will welcome you at the check-in desk. The talks and build lab take place on the ground floor.',
    features: [
      {
        icon: 'wheelchair',
        text: 'Step-free entrance · Accessible facilities',
      },
      { icon: 'train', text: 'A short walk from the nearest Overground stop' },
    ],
    action: { label: 'Get directions', href: '#' },
  },
  organizers: {
    eyebrow: 'The people behind this event',
    heading: 'Meet your organizers',
    description:
      'The local volunteers bringing this DevFest afternoon to life.',
    people: [person(1, 'organizer'), person(3, 'organizer')],
    contact: {
      heading: 'A question before you arrive?',
      text: 'Ask about the venue, access needs or taking part. Your event team is here to help.',
      action: { label: 'Contact us', href: '#' },
    },
  },
  supporters: {
    eyebrow: 'Made possible together',
    heading: 'Partners & sponsors',
    description:
      'Support for this DevFest event, from the space we share to the tools we build with.',
    groups: [
      {
        title: 'Partners',
        supporters: [
          {
            partner: partner('The Foundry'),
            contribution: 'Venue partner · Sample',
          },
          {
            partner: partner('Open Builders'),
            contribution: 'Community partner · Sample',
          },
        ],
      },
      {
        title: 'Sponsors',
        supporters: [
          {
            partner: partner('Stackworks'),
            contribution: 'Build lab sponsor · Sample',
          },
          {
            partner: partner('Good Coffee Co.'),
            contribution: 'Refreshments sponsor · Sample',
          },
        ],
      },
    ],
  },
  registration: {
    heading: 'Your next idea starts here.',
    reminder: '14 November 2026 · 13:00–18:00 GMT · The Foundry, London',
    detail:
      'Free entry. Talks, a hands-on build lab and a community to learn with.',
    action: { label: 'Register', href: '#' },
    note: 'Sample event registration',
  },
};
