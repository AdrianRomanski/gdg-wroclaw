import type { PersonRole } from '../role-badge/role-badge';

export type SocialNetwork =
  'linkedin' | 'x' | 'github' | 'dribbble' | 'website';

export interface SocialLink {
  network: SocialNetwork;
  url: string;
}

/**
 * A person shown in GDG UI: trainers on the Workshop page, and later speakers, organizers and
 * members on the Team page (ADR-0016).
 */
export interface Person {
  name: string;
  jobTitle?: string;
  bio?: string;
  /** Square photo; `alt` defaults to empty, since the name is shown next to it. */
  photo?: { src: string; alt?: string };
  role?: PersonRole;
  socials?: readonly SocialLink[];
}
