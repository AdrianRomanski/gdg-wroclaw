import type { Person } from '../person/person';
import type { PersonRole } from '../role-badge/role-badge';

const socials: Person['socials'] = [
  { network: 'linkedin', url: 'https://www.linkedin.com/' },
  { network: 'x', url: 'https://x.com/' },
  { network: 'dribbble', url: 'https://dribbble.com/' },
];
const bio =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.';

// The Figma Team page pairs each photo with one role.
const SAMPLES: Record<PersonRole, string> = {
  organizer: 'people/trainer-1.jpg',
  speaker: 'people/trainer-2.jpg',
  member: 'people/trainer-3.jpg',
};

export function samplePerson(role: PersonRole): Person {
  return {
    name: 'Full name',
    jobTitle: 'Job title',
    bio,
    role,
    photo: { src: SAMPLES[role] },
    socials,
  };
}

/**
 * Story-only sample of the eight Figma Team cards, in Figma order. The photos are served by
 * apps/storybook/public (ADR-0016, ADR-0018); this file is not exported from the library.
 */
export const SAMPLE_TEAM: Person[] = (
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
).map(samplePerson);
