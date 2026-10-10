import type { EventDetail } from '@gdg-wroclaw/ui';
import { EVENT_SECTION_IDS, LANDING_SECTION_IDS } from '@gdg-wroclaw/ui';
import { ORGANIZER } from './organizers';

const AI_CLOUD_RSVP =
  'https://gdg.community.dev/events/details/google-gdg-wroclaw-presents-ai-amp-cloud-stream-meetup/';

/**
 * Event pages, keyed by URL slug (`/events/:slug`), shown with the Event page template
 * (ADR-0025). Details come from the event's page on gdg.community.dev.
 */
export const EVENTS: Readonly<Record<string, EventDetail>> = {
  'ai-cloud-stream-meetup': {
    title: 'AI & Cloud Stream Meetup',
    label: 'In-person event',
    labelNote: 'GDG Wrocław',
    summary:
      'An evening of AI and cloud computing: building AI agents on Google Cloud and a personal mind trainer that runs on your own device, followed by pizza and networking.',
    back: { label: 'All events', href: `/#${LANDING_SECTION_IDS.events}` },
    primaryAction: { label: 'RSVP', href: AI_CLOUD_RSVP },
    secondaryAction: {
      label: 'See the schedule',
      href: `#${EVENT_SECTION_IDS.schedule}`,
    },
    actionNote: 'RSVP on gdg.community.dev',
    facts: [
      {
        icon: 'calendar-dots',
        label: 'Date',
        value: 'Thursday, 29 October 2026',
        detail: 'Two talks, pizza and networking',
      },
      {
        icon: 'clock',
        label: 'Time',
        value: '18:00–20:30 CET',
        detail: 'Welcome at 18:00 · First talk at 18:15',
      },
      {
        icon: 'map-pin',
        label: 'Location',
        value: 'Capgemini · Wrocław',
        detail: 'Legnicka 48H, 54-202 Wrocław',
      },
    ],
    speakers: {
      eyebrow: 'Learn from local builders',
      heading: 'Speakers & their talks',
      description:
        'Two talks on building with AI, in the cloud and on your device.',
      talks: [
        {
          speaker: {
            name: 'Remigiusz Marciniak',
            jobTitle: 'Senior Software Engineer, Capgemini',
            role: 'speaker',
          },
          topic: 'AI agents · 45 min',
          time: '18:15–19:00',
          title: 'Agents Development in GCP',
          description:
            'Spec-driven development, developing and deploying agents on Google Cloud, adding memory, and evaluating agents.',
        },
        {
          speaker: { ...ORGANIZER.adrian, role: 'speaker' },
          topic: 'On-device AI · 60 min',
          time: '19:30–20:30',
          title: 'Personal Mind Trainer',
          description:
            'A local Gemma model quizzes you offline, and a cloud Gemini model judges your answers without seeing your private notes.',
        },
      ],
    },
    schedule: {
      eyebrow: 'Your evening, planned',
      heading: 'Schedule',
      description:
        'Thursday, 29 October 2026. Two talks, pizza and time to connect.',
      timezoneNote: 'All times in CET',
      sessions: [
        {
          start: '18:00',
          dateTime: '2026-10-29T18:00+01:00',
          duration: '15 min',
          title: 'Welcome and intro',
          detail: 'GDG Wrocław',
          type: 'Welcome',
        },
        {
          start: '18:15',
          dateTime: '2026-10-29T18:15+01:00',
          duration: '45 min',
          title: 'Agents Development in GCP',
          detail: 'Remigiusz Marciniak',
          type: 'Talk',
          highlight: true,
        },
        {
          start: '19:00',
          dateTime: '2026-10-29T19:00+01:00',
          duration: '30 min',
          title: 'Pizza and networking',
          detail: 'Everyone',
          type: 'Break',
        },
        {
          start: '19:30',
          dateTime: '2026-10-29T19:30+01:00',
          duration: '60 min',
          title: 'Personal Mind Trainer',
          detail: 'Adrian Romański',
          type: 'Talk',
          highlight: true,
        },
        {
          start: '20:30',
          dateTime: '2026-10-29T20:30+01:00',
          title: 'Wrap-up and closing',
          detail: 'GDG Wrocław',
          type: 'Closing',
        },
      ],
    },
    venue: {
      eyebrow: 'Meet us here',
      heading: 'Capgemini Software Solutions Center',
      description: 'Legnicka 48H, 54-202 Wrocław',
      action: {
        label: 'Open in Google Maps',
        href: 'https://www.google.com/maps/search/?api=1&query=Capgemini%20Software%20Solutions%20Center%2048H%20Legnicka%20Wroc%C5%82aw',
      },
    },
    organizers: {
      eyebrow: 'The people behind this event',
      heading: 'Meet your organizers',
      description: 'The GDG Wrocław volunteers bringing this meetup to life.',
      people: [
        ORGANIZER.adrian,
        ORGANIZER.luka,
        ORGANIZER.karol,
        ORGANIZER.artur,
      ],
      contact: {
        heading: 'A question before you arrive?',
        text: 'Ask about the venue, access needs or taking part. Your event team is here to help.',
        action: { label: 'Contact us', href: '/contact' },
      },
    },
    supporters: {
      eyebrow: 'Made possible together',
      heading: 'Sponsors',
      description: 'Thanks to our host for the space and the support.',
      groups: [
        {
          title: 'Sponsors',
          supporters: [
            {
              partner: {
                name: 'Capgemini',
                logo: { src: '/partners/capgemini.png' },
                url: 'https://www.capgemini.com/',
              },
              contribution: 'Gold sponsor · Venue host',
            },
          ],
        },
      ],
    },
    registration: {
      heading: 'Your next idea starts here.',
      reminder: '29 October 2026 · 18:00–20:30 CET · Capgemini, Wrocław',
      detail:
        'Two talks on AI and the cloud, pizza and a community to learn with.',
      action: { label: 'RSVP', href: AI_CLOUD_RSVP },
      note: 'RSVP on gdg.community.dev',
    },
  },
};
