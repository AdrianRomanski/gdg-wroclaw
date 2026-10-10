import type { Workshop } from '@gdg-wroclaw/ui';
import { ORGANIZER } from './organizers';

/**
 * Event pages, keyed by URL slug (`/workshops/:slug`), shown with the Workshop page template
 * (ADR-0023). Details come from the event's page on gdg.community.dev.
 */
export const WORKSHOPS: Readonly<Record<string, Workshop>> = {
  'ai-cloud-stream-meetup': {
    topic: 'AI & Cloud Stream Meetup',
    description:
      'Join us on Thursday, 29 October 2026, 18:00–20:30, at Capgemini, Legnicka 48H, Wrocław, for an evening of AI and cloud computing: building AI agents on Google Cloud, a local cognitive mentor, pizza and networking. Agenda: 18:00 welcome, 18:15 first talk, 19:00 pizza and networking, 19:30 second talk, 20:30 wrap-up. RSVP on gdg.community.dev.',
    trainersHeading: 'Speakers & organizers',
    trainers: [
      {
        name: 'Remigiusz Marciniak',
        jobTitle: 'Senior Software Engineer, Capgemini',
        bio: 'Agents Development in GCP: spec-driven development, developing and deploying agents on Google Cloud, adding memory, and evaluating agents.',
        role: 'speaker',
      },
      {
        ...ORGANIZER.adrian,
        bio: 'Personal Mind Trainer: a local Gemma model quizzes you offline, and a cloud Gemini model judges your answers without seeing your private notes.',
        role: 'speaker',
      },
      ORGANIZER.adrian,
      ORGANIZER.luka,
      ORGANIZER.karol,
      ORGANIZER.artur,
    ],
  },
};
