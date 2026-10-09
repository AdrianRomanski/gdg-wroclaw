import type { Person } from '../person/person';
import type { Workshop } from './workshop';

const socials: Person['socials'] = [
  { network: 'linkedin', url: 'https://www.linkedin.com/' },
  { network: 'x', url: 'https://x.com/' },
  { network: 'dribbble', url: 'https://dribbble.com/' },
];
const bio =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.';

/**
 * Story-only sample from the Figma Workshop page. The images are served by apps/storybook/public
 * (ADR-0016, ADR-0017); this file is not exported from the library.
 */
export const SAMPLE_WORKSHOP: Workshop = {
  topic: 'Workshop topic',
  description:
    "This is the place for the workshop description. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.",
  banner: { src: 'banners/placeholder.svg' },
  trainers: [1, 2, 3].map((n) => ({
    name: 'Full name',
    jobTitle: 'Job title',
    bio,
    role: n === 3 ? 'member' : 'speaker',
    photo: { src: `people/trainer-${n}.jpg` },
    socials,
  })),
};
