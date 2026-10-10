import type { ButtonColor } from '@gdg-wroclaw/design-system-components';
import type { EventDay } from '../events-section/events-section';
import type { FaqEntry } from '../faq/faq-section';
import type { Partner } from '../partner-card/partner';
import type { Person } from '../person/person';

/** A section title and its optional call to action. */
interface SectionCopy {
  heading?: string;
  description?: string;
}

interface SectionCta {
  ctaHeading?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaLabel?: string;
  ctaColor?: ButtonColor;
}

/**
 * Content of the Landing page template (ADR-0022). Every section is optional and left out when
 * missing, so the page can launch before all content exists.
 */
export interface LandingPageContent {
  /** The page's `<h1>`, read by screen readers; the visible title is part of the hero image. */
  heading: string;
  /** Hero image, e.g. the GDG brand-kit header with the chapter name. */
  hero?: { src: string; alt?: string };
  events?: SectionCopy & { days: readonly EventDay[] };
  team?: SectionCopy & SectionCta & { members: readonly Person[] };
  partners?: SectionCopy & SectionCta & { partners: readonly Partner[] };
  faq?: SectionCopy & {
    entries: readonly FaqEntry[];
    askHref?: string;
    askLabel?: string;
  };
}

/** Anchor ids of the page sections, for Navbar links such as `#team`. */
export const LANDING_SECTION_IDS = {
  events: 'events',
  team: 'team',
  partners: 'partners',
  faq: 'faq',
} as const;
