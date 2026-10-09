import type { Person } from '../person/person';

/** Everything the Workshop page shows (ADR-0017). */
export interface Workshop {
  topic: string;
  description?: string;
  /** Header image, e.g. the event's GDG brand-kit banner. */
  banner?: { src: string; alt?: string };
  trainers?: readonly Person[];
}
