import type {
  DevfestAgendaPageContent,
  DevfestHeroContent,
  DevfestKeynote,
  DevfestPanel,
  DevfestScheduleItem,
  DevfestSessionSlot,
  DevfestSpeaker,
  DevfestSpeakersPageContent,
  DevfestTalk,
  SessionPerson,
  Track,
} from '@gdg-wroclaw/ui';
import { TRACK_LABELS } from '@gdg-wroclaw/ui';
import { COMMUNITY_URL } from './site';

/*
 * DevFest Wrocław 2026, from the Figma **DevFest** page (ADR-0029): the agenda of both days and
 * the speaker directory. Topics still to be announced keep the Figma placeholder copy.
 */

const ROOMS = ['Sala A', 'Sala B'] as const;

const TBA: SessionPerson = { name: 'TBA', initials: 'TBA' };
const FREE_SLOT: SessionPerson = { name: 'Slot wolny', initials: 'TBA' };
const SPEAKER_TBA: SessionPerson = { name: 'Prelegent: TBA', initials: 'TBA' };

const HERO: DevfestHeroContent = {
  image: {
    src: '/banners/devfest-2026.jpg',
    alt: 'DevFest 2026 — Join us! Google Developer Groups',
  },
  overline: 'WROCŁAW · 2026',
  caption: 'Google Developer Groups — DevFest 2026',
  action: { label: 'Zarejestruj się', href: COMMUNITY_URL },
};

const ROBOTICS_KEYNOTE: DevfestKeynote = {
  title: 'Who Let the Dogs Out? The State of AI Robotics',
  time: '15:50',
  dateTime: '15:50',
  room: 'Scena Główna',
  abstract:
    "The robot dogs are out of the lab — and nobody's putting them back. VLA models let a machine hear 'clear the table' and just do it.",
  speaker: { name: 'Grzegorz Piotrowski' },
};

function keynoteTba(time: string): { keynote: DevfestKeynote } {
  return {
    keynote: {
      title: 'Keynote (TBA)',
      time,
      dateTime: time,
      room: 'Scena Główna',
      speaker: TBA,
    },
  };
}

function panel(
  track: Track,
  time: string,
  host: string,
  panelists: readonly (string | SessionPerson)[],
): { panel: DevfestPanel } {
  return {
    panel: {
      title: `${TRACK_LABELS[track]} Panel`,
      track,
      time,
      dateTime: time,
      room: 'Scena Główna',
      host: { name: host },
      panelists: panelists.map((p) =>
        typeof p === 'string' ? { name: p } : p,
      ),
    },
  };
}

/** A talk still to be announced, with its speaker if known. */
function talkTba(
  track: Track,
  speaker: SessionPerson | string,
  extra: Partial<DevfestTalk> = {},
): Omit<DevfestTalk, 'time' | 'room'> {
  return {
    title: 'Topic: TBA',
    track,
    description: 'Prelegent i temat zostaną ogłoszeni wkrótce',
    speakers: [typeof speaker === 'string' ? { name: speaker } : speaker],
    ...extra,
  };
}

/** A row of talks: the first in Sala A, the second in Sala B. */
function slot(
  time: string,
  talks: readonly (Omit<DevfestTalk, 'time' | 'room'> | null)[],
  extra: Partial<DevfestSessionSlot> = {},
): DevfestSessionSlot {
  const cardTime = extra.groupedTime ?? time;
  return {
    type: 'slot',
    time,
    dateTime: time.slice(0, 5),
    talks: talks.map((talk, i) =>
      talk
        ? {
            time: cardTime,
            dateTime: cardTime.slice(0, 5),
            room: ROOMS[i],
            ...talk,
          }
        : null,
    ),
    ...extra,
  };
}

function event(
  type: DevfestScheduleItem['type'],
  time: string,
  title: string,
): DevfestScheduleItem {
  return {
    type,
    title,
    time,
    dateTime: time.slice(0, 5),
    rooms: ROOMS.join(' + '),
  };
}

export const DEVFEST_AGENDA: DevfestAgendaPageContent = {
  title: 'DevFest Wrocław 2026 — Harmonogram',
  hero: HERO,
  agenda: {
    overline: 'AGENDA / DEVFEST 2026',
    heading: 'Harmonogram & Sceny',
    mainStage: {
      label: 'Dzień 1: Panele Dyskusyjne & Keynotes',
      description:
        'Dzień 1 / Rozmowy, które inspirują · Panele Dyskusyjne & Keynotes · Scena Główna',
      sessions: [
        { keynote: ROBOTICS_KEYNOTE },
        panel('ai', '16:00', 'Dawid Perdek', [
          'Greg Radzio',
          'Łukasz Jaźwa',
          'Paweł Kubiak',
          'Marcin Czarkowski',
          'Tarun Jain',
        ]),
        panel('web', '17:00', 'Adrian Romański', [
          'Dominika Zajac',
          'Muhammad Ahsan Ayaz',
          'Jarosław Żołnowski',
          'Julia Raczynska',
          'Jakub Andrzejewski',
        ]),
        keynoteTba('17:50'),
        panel('mobile', '18:00', 'Artur Skrzypczyk', [
          'Piotr Prus',
          'Elaine Dias Batista',
          'Dominik Šimoník',
          'Oleksandr Tilnyi',
          FREE_SLOT,
        ]),
        keynoteTba('18:50'),
        panel('cloud', '19:00', 'Michał Jabłoński', [
          'Goram Minov',
          'Çalgan Aygün',
          'Paweł Ostromecki',
          FREE_SLOT,
          FREE_SLOT,
        ]),
      ],
    },
    parallel: {
      label: 'Dzień 2: Warsztaty & Prezentacje',
      description:
        'Dzień 2 / Prezentacje · Krótkie sesje i wykłady · 20–30 min · Sala A / Sala B',
      rooms: ROOMS,
      talksLabel: 'Prezentacje (2 Sale Równolegle)',
      workshopsLabel: 'Warsztaty (Hands-on Labs)',
      workshopsNote: 'Harmonogram warsztatów pojawi się tutaj.',
      entries: [
        event('shared', '07:30', 'Otwarcie eventu'),
        slot('08:00 - 08:30', [
          talkTba('mobile', 'Oleksandr Tilnyi'),
          talkTba('cloud', 'Ankur Roy'),
        ]),
        slot('08:35 - 09:05', [
          talkTba('web', 'Jakub Andrzejewski'),
          {
            title: 'From Human-Friendly to Agent-Friendly: WebMCP in Action',
            track: 'ai',
            abstract:
              'Exposing web app capabilities to AI agents as structured tools using WebMCP and Angular',
            speakers: [{ name: 'Paweł Kubiak' }],
          },
        ]),
        slot(
          '09:10 / 09:45',
          [
            talkTba('robotics', 'Marcin Wysocki'),
            talkTba('ai', 'Marcin Czarkowski'),
          ],
          {
            groupedTime: '09:10 - 09:40 / 09:45 - 10:15',
            groupedNote: 'Wspólny blok harmonogramu · dwa zakresy godzin',
          },
        ),
        slot('10:20 - 10:50', [
          talkTba('web', 'Tomasz Flis'),
          talkTba('cloud', 'Paweł Ostromecki'),
        ]),
        event('break', '12:00 - 12:45', 'PRZERWA JEDZENIOWA'),
        slot('12:45 - 13:15', [
          talkTba('web', 'Sam Vloeberghs'),
          talkTba('cloud', SPEAKER_TBA),
        ]),
        slot('13:20 - 13:50', [
          talkTba('ai', 'Przemysław Nowak'),
          {
            title: 'The State of Voice Interactions on Android',
            track: 'mobile',
            abstract:
              'Exploring speech APIs, App Actions, and Gemini voice agents',
            speakers: [{ name: 'Elaine Dias Batista' }],
          },
        ]),
        slot('15:05 - 15:35', [
          talkTba('cloud', 'Paweł Ostromecki'),
          talkTba('web', 'Jarosław Żołnowski'),
        ]),
        slot('16:15 - 16:45', [
          talkTba('ai', 'Julia Rapczyńska'),
          talkTba('ai', 'Tarun Jain'),
        ]),
        slot('17:25 - 17:45', [
          talkTba('generic', 'Mathias Weber', {
            trackLabel: 'Generic',
            room: 'Sala: TBA',
          }),
          null,
        ]),
        event('break', '17:45 - 18:30', 'PRZERWA JEDZENIOWA'),
        slot('18:30 - 19:00', [
          {
            title: 'Building a Production Video Feed in Flutter',
            track: 'mobile',
            abstract:
              'Architecture for short-form looping video feeds: player pooling, preloading, caching',
            speakers: [{ name: 'Dominik Šimoník' }],
          },
          talkTba('cloud', SPEAKER_TBA, { trackLabel: 'Cloud / AI' }),
        ]),
        event('shared', '20:10', 'Oficjalne Zakończenie Wydarzenia'),
      ],
    },
  },
};

function people(
  track: Track,
  entries: readonly [string, DevfestSpeaker['role'], string?][],
): DevfestSpeaker[] {
  return entries.map(([name, role, talk]) => ({ name, track, role, talk }));
}

const PANELIST = (track: string) => `Panelista · ${track} panel`;
const PANELIST_F = (track: string) => `Panelistka · ${track} panel`;
const PRESENTER = (track: string) => `Prelegent · ${track} prezentacja`;
const PRESENTER_F = (track: string) => `Prelegentka · ${track} prezentacja`;

export const DEVFEST_SPEAKERS: DevfestSpeakersPageContent = {
  title: 'DevFest Wrocław 2026 — Prelegenci & Prowadzący',
  hero: { image: HERO.image },
  speakers: {
    heading: {
      overline: 'LUDZIE / DEVFEST 2026',
      heading: 'Prelegenci & Prowadzący',
      description:
        'Poznaj osoby, które tworzą program DevFest Wrocław 2026 — 29 osób w programie.',
    },
    allLabel: 'Wszyscy',
    groups: [
      {
        id: 'keynote',
        label: 'Keynote',
        keynote: {
          title: ROBOTICS_KEYNOTE.title,
          time: 'Dzień 1 · 15:50',
          dateTime: '15:50',
          room: 'Robotyka / AI',
          speaker: ROBOTICS_KEYNOTE.speaker,
        },
      },
      {
        id: 'hosts',
        label: 'Prowadzący',
        heading: {
          overline: '4 OSOBY',
          heading: 'Prowadzący paneli',
          description: 'Osoby prowadzące rozmowy na czterech ścieżkach.',
        },
        speakers: [
          ...people('ai', [['Dawid Perdek', 'Prowadzący AI panel']]),
          ...people('web', [['Adrian Romański', 'Prowadzący Web panel']]),
          ...people('mobile', [
            ['Artur Skrzypczyk', 'Prowadzący Mobile panel'],
          ]),
          // Figma shows the community in the blue line under the role.
          ...people('cloud', [
            ['Michał Jabłoński', 'Prowadzący Cloud panel', 'GDG Warszawa'],
          ]),
        ],
      },
      {
        id: 'panelists',
        label: 'Paneliści',
        heading: {
          overline: '17 OSÓB',
          heading: 'Paneliści & prelegenci',
          description:
            'Uczestnicy paneli. Osoby występujące także z prezentacją mają obie role na jednej karcie.',
        },
        speakers: [
          ...people('ai', [
            ['Greg Radzio', PANELIST('AI')],
            ['Łukasz Jaźwa', PANELIST('AI')],
            [
              'Paweł Kubiak',
              [PANELIST('AI'), PRESENTER('AI')],
              'From Human-Friendly to Agent-Friendly: WebMCP in Action',
            ],
            ['Marcin Czarkowski', [PANELIST('AI'), PRESENTER('AI')]],
            ['Tarun Jain', [PANELIST('AI'), PRESENTER('AI')]],
          ]),
          ...people('web', [
            ['Dominika Zajac', PANELIST_F('Web')],
            ['Muhammad Ahsan Ayaz', PANELIST('Web')],
            ['Jarosław Żołnowski', [PANELIST('Web'), PRESENTER('Web')]],
            ['Julia Raczynska', PANELIST_F('Web')],
            ['Jakub Andrzejewski', [PANELIST('Web'), PRESENTER('Web')]],
          ]),
          ...people('mobile', [
            ['Piotr Prus', PANELIST('Mobile')],
            [
              'Elaine Dias Batista',
              [PANELIST_F('Mobile'), PRESENTER_F('Mobile')],
              'The State of Voice Interactions on Android',
            ],
            [
              'Dominik Šimoník',
              [PANELIST('Mobile'), PRESENTER('Mobile')],
              'Building a Production Video Feed in Flutter',
            ],
            ['Oleksandr Tilnyi', [PANELIST('Mobile'), PRESENTER('Mobile')]],
          ]),
          ...people('cloud', [
            ['Goram Minov', PANELIST('Cloud')],
            ['Çalgan Aygün', PANELIST('Cloud')],
            ['Paweł Ostromecki', [PANELIST('Cloud'), PRESENTER('Cloud')]],
          ]),
        ],
      },
      {
        id: 'presenters',
        label: 'Prezentacje',
        heading: {
          overline: '7 OSÓB',
          heading: 'Prelegenci prezentacji',
          description:
            'Pozostali prelegenci drugiego dnia — prezentacje na ścieżkach tematycznych.',
        },
        speakers: [
          ...people('cloud', [['Ankur Roy', PRESENTER('Cloud')]]),
          ...people('robotics', [['Marcin Wysocki', PRESENTER('Robotyka')]]),
          ...people('web', [
            ['Tomasz Flis', PRESENTER('Web')],
            ['Sam Vloeberghs', PRESENTER('Web')],
          ]),
          ...people('ai', [
            ['Przemysław Nowak', PRESENTER('AI')],
            ['Julia Rapczyńska', PRESENTER_F('AI')],
          ]),
          {
            name: 'Mathias Weber',
            track: 'generic',
            trackLabel: 'Generic',
            role: PRESENTER('Generic'),
          },
        ],
      },
      {
        id: 'trainers',
        label: 'Trenerzy',
        heading: { overline: 'DZIEŃ 2', heading: 'Trenerzy warsztatów' },
        emptyNote: 'Lista trenerów warsztatów pojawi się tutaj.',
      },
    ],
  },
};
