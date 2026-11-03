import type {
  DevfestKeynote,
  DevfestParallelEntry,
  DevfestSpeaker,
  DevfestStageSession,
} from '../devfest-session/devfest-session';
import type { EventLink } from '../event-page/event-detail';

/** The DevFest artwork above both pages (Figma `DevFest hero image`), see ADR-0029. */
export interface DevfestHeroContent {
  image: { src: string; alt?: string };
  /** Small caps line of the caption, e.g. "WROCŁAW · 2026". */
  overline?: string;
  /** E.g. "Google Developer Groups — DevFest 2026". */
  caption?: string;
  /** E.g. "Register". */
  action?: EventLink;
}

/** The centered overline, title and description of a section (Figma `Section heading`). */
export interface DevfestHeading {
  overline?: string;
  heading: string;
  description?: string;
}

/** Day 1 of the agenda: keynotes and discussion panels on one stage. */
export interface DevfestMainStageDay {
  /** Day toggle label, e.g. "Day 1: Discussion Panels & Keynotes". */
  label: string;
  /** Line under the agenda title for this day. */
  description?: string;
  sessions: readonly DevfestStageSession[];
}

/** Day 2 of the agenda: talks in parallel rooms, and workshops. */
export interface DevfestParallelDay {
  label: string;
  description?: string;
  /** Column headers, e.g. ["Room A", "Room B"]. */
  rooms: readonly string[];
  entries: readonly DevfestParallelEntry[];
  /** Format navigation, e.g. "Talks (2 Rooms in Parallel)". */
  talksLabel: string;
  /** E.g. "Workshops (Hands-on Labs)"; without it the format navigation is left out. */
  workshopsLabel?: string;
  /** Column headers of the workshop agenda; defaults to `rooms`. */
  workshopRooms?: readonly string[];
  /** The workshop agenda, shown under `workshopsLabel`. */
  workshops?: readonly DevfestParallelEntry[];
  /** Shown instead of the workshop agenda until it is published. */
  workshopsNote?: string;
}

/** The agenda section (Figma `Agenda`, e.g. 9043:2054). */
export interface DevfestAgendaContent {
  overline?: string;
  heading: string;
  mainStage: DevfestMainStageDay;
  parallel: DevfestParallelDay;
}

/** A group of the speaker directory, e.g. the panel hosts (Figma `Panel hosts`). */
export interface DevfestSpeakerGroup {
  id: string;
  /** Role navigation label, e.g. "Hosts". */
  label: string;
  /** Section heading; a keynote-only group can leave it out. */
  heading?: DevfestHeading;
  speakers?: readonly DevfestSpeaker[];
  /** A keynote, shown as the Keynote card (Figma `Keynote speaker`). */
  keynote?: DevfestKeynote;
  /** Shown while the group has nobody yet, e.g. "The list of workshop trainers will appear here." */
  emptyNote?: string;
}

/** The speaker directory (Figma `Speaker directory`, e.g. 9044:2755). */
export interface DevfestSpeakersContent {
  heading: DevfestHeading;
  /** First role navigation option; the number of people is added, e.g. "All (29)". */
  allLabel: string;
  groups: readonly DevfestSpeakerGroup[];
}

/** The agenda page: the hero and the agenda. */
export interface DevfestAgendaPageContent {
  /** Visually hidden `<h1>`; the visible title is part of the hero image. */
  title: string;
  hero: DevfestHeroContent;
  agenda: DevfestAgendaContent;
}

/** The speakers page: the hero and the speaker directory. */
export interface DevfestSpeakersPageContent {
  title: string;
  hero: DevfestHeroContent;
  speakers: DevfestSpeakersContent;
}
