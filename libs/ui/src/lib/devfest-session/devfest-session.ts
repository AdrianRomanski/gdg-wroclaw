import type {
  Accent,
  ButtonColor,
} from '@gdg-wroclaw/design-system-components';
import { initials } from '../person/initials';

/**
 * Conference tracks of the Figma **DevFest components** page (ADR-0028). `generic` is a session
 * outside the tracks: neutral colors and no tag unless it has a `trackLabel`.
 */
export type Track = 'ai' | 'web' | 'mobile' | 'cloud' | 'robotics' | 'generic';

/** A speaker, host or panelist as shown on a session: initials from the name by default. */
export interface SessionPerson {
  name: string;
  /** Overrides the initials taken from `name`. */
  initials?: string;
}

interface Scheduled {
  /** As shown, e.g. "08:00 – 08:30". */
  time?: string;
  /** For `<time datetime>`, e.g. "2026-11-21T08:00". */
  dateTime?: string;
  /** Room or stage, e.g. "Sala A". */
  room?: string;
}

interface OnTrack {
  track: Track;
  /** Overrides the default track name (`TRACK_LABELS`). */
  trackLabel?: string;
}

/** A talk in the agenda (Figma `Presentation card`). */
export interface DevfestTalk extends Scheduled, OnTrack {
  title: string;
  /** Short line under the title, e.g. "Speaker and topic to be announced". */
  description?: string;
  /** Longer abstract behind the expand button. */
  abstract?: string;
  speakers?: readonly SessionPerson[];
}

/** A keynote (Figma `Keynote card`). */
export interface DevfestKeynote extends Scheduled {
  title: string;
  abstract?: string;
  speaker?: SessionPerson;
}

/** A discussion panel (Figma `Discussion panel`). */
export interface DevfestPanel extends Scheduled, OnTrack {
  title: string;
  host?: SessionPerson;
  panelists: readonly SessionPerson[];
}

/** A speaker in the speaker directory (Figma `Speaker card`). */
export interface DevfestSpeaker extends SessionPerson, OnTrack {
  /** E.g. "CTO, Acme · panel". */
  role?: string;
  /** Title of their talk. */
  talk?: string;
}

/** An agenda entry for the whole venue (Figma `Schedule event`): an opening or a break. */
export interface DevfestScheduleItem {
  type: 'shared' | 'break';
  title: string;
  time: string;
  dateTime?: string;
  /** E.g. "Sala A + Sala B". */
  rooms?: string;
}

export const TRACK_LABELS: Record<Track, string> = {
  ai: 'AI',
  web: 'Web',
  mobile: 'Mobile',
  cloud: 'Cloud',
  robotics: 'Robotyka',
  generic: '',
};

/** Accent of the track's tag dot and avatar rings; `generic` has none. */
export const TRACK_ACCENTS: Record<Track, Accent | undefined> = {
  ai: 'red',
  web: 'yellow',
  mobile: 'green',
  cloud: 'blue',
  robotics: 'contrast',
  generic: undefined,
};

/** Color of the track's buttons: brand blue where the track has no brand color. */
export const TRACK_BUTTON_COLORS: Record<Track, ButtonColor> = {
  ai: 'red',
  web: 'yellow',
  mobile: 'green',
  cloud: 'blue',
  robotics: 'blue',
  generic: 'blue',
};

export function trackLabel(session: OnTrack): string {
  return session.trackLabel ?? TRACK_LABELS[session.track];
}

export function personInitials(person: SessionPerson): string {
  return person.initials ?? initials(person.name);
}
