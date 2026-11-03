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
  room: 'Sala A',
  description: 'Prelegent i temat zostaną ogłoszeni wkrótce',
  abstract: 'Treść abstraktu',
  speakers: [{ name: 'Imię Nazwisko', initials: 'OT' }],
};

export const SAMPLE_SPEAKER: DevfestSpeaker = {
  name: 'Imię Nazwisko',
  initials: 'OT',
  track: 'ai',
  role: 'Rola · panel',
  talk: 'Tytuł prezentacji',
};

export const SAMPLE_KEYNOTE: DevfestKeynote = {
  title: 'Who Let the Dogs Out? The State of AI Robotics',
  time: '15:50',
  dateTime: '2026-11-21T15:50',
  room: 'Scena Główna',
  abstract: 'Abstrakt',
  speaker: { name: 'Imię Nazwisko', initials: 'OT' },
};

const PERSON = { name: 'Imię Nazwisko', initials: 'OT' };

export const SAMPLE_PANEL: DevfestPanel = {
  title: 'AI Panel',
  track: 'ai',
  time: '16:00',
  dateTime: '2026-11-21T16:00',
  room: 'Scena Główna',
  description:
    'Krótki opis panelu: o czym rozmawiamy i dlaczego właśnie teraz. Dwa, trzy zdania wystarczą.',
  topics: [
    'Pierwszy temat rozmowy',
    'Drugi temat rozmowy, nieco dłuższy, żeby sprawdzić zawijanie tekstu',
    'Trzeci temat rozmowy',
  ],
  host: PERSON,
  panelists: [PERSON, PERSON, PERSON, PERSON, PERSON],
};

export const SAMPLE_OPENING: DevfestScheduleItem = {
  type: 'shared',
  title: 'Otwarcie eventu',
  time: '07:30',
  dateTime: '2026-11-21T07:30',
  rooms: 'Sala A + Sala B',
};

export const SAMPLE_BREAK: DevfestScheduleItem = {
  ...SAMPLE_OPENING,
  type: 'break',
  title: 'Przerwa obiadowa',
  time: '12:30',
  dateTime: '2026-11-21T12:30',
};
