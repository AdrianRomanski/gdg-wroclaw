import type { IconName } from '@gdg-wroclaw/design-system-components';
import type { Partner } from '../partner-card/partner';
import type { Person } from '../person/person';

/** A link shown as a button or breadcrumb, e.g. the RSVP page. */
export interface EventLink {
  label: string;
  href: string;
}

/** The eyebrow, heading and description that open most sections. */
export interface EventSectionIntro {
  /** Small line above the heading, e.g. "Learn from local builders". */
  eyebrow?: string;
  heading: string;
  description?: string;
}

/** One of the essentials under the hero, e.g. the date. */
export interface EventFact {
  icon: IconName;
  label: string;
  value: string;
  detail?: string;
}

/** A speaker and the talk they give. */
export interface EventTalk {
  speaker: Person;
  /** Topic and length, e.g. "AI · 45 min". */
  topic?: string;
  /** Time slot as shown, e.g. "18:15–19:00". */
  time?: string;
  title: string;
  description?: string;
}

/** One row of the agenda. */
export interface EventSession {
  /** Start time as shown, e.g. "18:15". */
  start: string;
  /** Machine-readable start for `<time datetime>`, e.g. "2026-10-29T18:15+01:00". */
  dateTime?: string;
  /** Length as shown, e.g. "45 min". */
  duration?: string;
  title: string;
  /** Who and where, e.g. "Remigiusz Marciniak · Main room". */
  detail?: string;
  /** Short label on the right, e.g. "Talk". */
  type?: string;
  /** Highlight the label in blue (talks and workshops). */
  highlight?: boolean;
}

/** A venue access or travel note with its icon. */
export interface EventVenueFeature {
  icon: IconName;
  text: string;
}

/** A partner or sponsor with what they contribute to this event. */
export interface EventSupporter {
  partner: Partner;
  /** E.g. "Venue partner". */
  contribution?: string;
}

/** A titled group of supporters, e.g. "Sponsors". */
export interface EventSupporterGroup {
  title: string;
  supporters: readonly EventSupporter[];
}

/**
 * Everything the Event page shows (ADR-0025). Only the title is required; every section is left
 * out when its data is missing, so a page can launch before the agenda or venue details exist.
 */
export interface EventDetail {
  title: string;
  /** Second line of the hero title, e.g. "Build what's next." */
  tagline?: string;
  summary?: string;
  /** Pill above the title, e.g. "In-person event". */
  label?: string;
  /** Text next to the pill, e.g. "GDG Wrocław". */
  labelNote?: string;
  /** Breadcrumb link back to the event list. */
  back?: EventLink;
  primaryAction?: EventLink;
  secondaryAction?: EventLink;
  /** Short note next to the hero buttons, e.g. "Everyone is welcome". */
  actionNote?: string;
  /** Words next to the hero graphic. Defaults to "Build. Share. Connect." */
  motto?: string;
  facts?: readonly EventFact[];
  speakers?: EventSectionIntro & { talks: readonly EventTalk[] };
  schedule?: EventSectionIntro & {
    sessions: readonly EventSession[];
    /** Pill under the description, e.g. "All times in CET". */
    timezoneNote?: string;
    note?: string;
  };
  venue?: EventSectionIntro & {
    photo?: { src: string; alt?: string };
    /** How to get in, e.g. which entrance to use. */
    arrival?: string;
    features?: readonly EventVenueFeature[];
    /** E.g. a map link. */
    action?: EventLink;
  };
  organizers?: EventSectionIntro & {
    people: readonly Person[];
    contact?: { heading: string; text?: string; action?: EventLink };
  };
  supporters?: EventSectionIntro & { groups: readonly EventSupporterGroup[] };
  registration?: {
    heading: string;
    /** E.g. "29 October 2026 · 18:00–20:30 · Capgemini, Wrocław". */
    reminder?: string;
    detail?: string;
    action?: EventLink;
    note?: string;
  };
}

/** Anchor ids of the page sections, e.g. for a "See the schedule" link (`#schedule`). */
export const EVENT_SECTION_IDS = {
  speakers: 'speakers',
  schedule: 'schedule',
  venue: 'venue',
  organizers: 'organizers',
  supporters: 'partners',
  registration: 'register',
} as const;
