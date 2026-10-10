import type { Workshop } from '@gdg-wroclaw/ui';

const bio =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.';

/**
 * Sample workshops from the Figma Workshop Page, keyed by URL slug (`/workshops/:slug`).
 * Placeholder content (ADR-0023); replace with the real workshops.
 */
export const WORKSHOPS: Readonly<Record<string, Workshop>> = {
  'sample-workshop': {
    topic: 'Workshop topic',
    description:
      'This is the place for the workshop description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.',
    trainers: [
      { name: 'Full name', jobTitle: 'Job title', bio, role: 'speaker' },
      { name: 'Full name', jobTitle: 'Job title', bio, role: 'speaker' },
      { name: 'Full name', jobTitle: 'Job title', bio, role: 'member' },
    ],
  },
};
