import type {
  DevfestKeynote,
  DevfestPanel,
  DevfestScheduleItem,
  DevfestSpeaker,
  DevfestTalk,
  Track,
} from './devfest-session';

// Story fixtures with the Figma DevFest components placeholder copy (ADR-0028).

export const TRACKS: Track[] = [
  'ai',
  'web',
  'mobile',
  'cloud',
  'robotics',
  'generic',
];

export const SAMPLE_TALK: DevfestTalk = {
  title: 'Topic: TBA',
  track: 'ai',
  time: '08:00 – 08:30',
  dateTime: '2026-11-21T08:00',
  room: 'Room A',
  description: 'Speaker and topic to be announced soon',
  abstract: 'Abstract text',
  speakers: [{ name: 'First Last', initials: 'OT' }],
};

export const SAMPLE_SPEAKER: DevfestSpeaker = {
  name: 'First Last',
  initials: 'OT',
  track: 'ai',
  role: 'Rola · panel',
  talk: 'Talk title',
};

export const SAMPLE_KEYNOTE: DevfestKeynote = {
  title: 'Who Let the Dogs Out? The State of AI Robotics',
  time: '15:50',
  dateTime: '2026-11-21T15:50',
  room: 'Main Stage',
  abstract: 'Abstract',
  speaker: { name: 'First Last', initials: 'OT' },
};

const PERSON = { name: 'First Last', initials: 'OT' };

export const SAMPLE_PANEL: DevfestPanel = {
  title: 'AI Panel',
  track: 'ai',
  time: '16:00',
  dateTime: '2026-11-21T16:00',
  room: 'Main Stage',
  description:
    'A short description of the panel: what we talk about and why now. Two or three sentences are enough.',
  topics: [
    'First topic',
    'Second topic, a bit longer to check how the text wraps',
    'Third topic',
  ],
  host: PERSON,
  panelists: [PERSON, PERSON, PERSON, PERSON, PERSON],
};

export const SAMPLE_OPENING: DevfestScheduleItem = {
  type: 'shared',
  title: 'Opening',
  time: '07:30',
  dateTime: '2026-11-21T07:30',
  rooms: 'Room A + Room B',
};

export const SAMPLE_BREAK: DevfestScheduleItem = {
  ...SAMPLE_OPENING,
  type: 'break',
  title: 'Przerwa obiadowa',
  time: '12:30',
  dateTime: '2026-11-21T12:30',
};
