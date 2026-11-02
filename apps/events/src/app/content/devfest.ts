import type {
  DevfestAgendaPageContent,
  DevfestHeroContent,
  DevfestKeynote,
  DevfestPanel,
  DevfestParallelEntry,
  DevfestScheduleItem,
  DevfestSessionSlot,
  DevfestSpeaker,
  DevfestSpeakersPageContent,
  DevfestTalk,
  SessionPerson,
  Track,
} from '@gdg-wroclaw/ui';
import { TRACK_LABELS } from '@gdg-wroclaw/ui';
import { DEVFEST_ABSTRACTS } from './devfest-abstracts';
import { DEVFEST_BIOS } from './devfest-bios';

/*
 * DevFest Wrocław 2026 (13–14 November, Uniwersytet Ekonomiczny we Wrocławiu): the agenda and
 * the people from the GDG community event page (https://gdg.community.dev/e/m8h9cm/, as of
 * 2026-11-02), laid out as on the Figma **DevFest** page (ADR-0029, ADR-0030). Day 1 is one
 * stage; day 2 runs the talks and the workshops side by side, each in its own room.
 */

/** RSVP on the GDG community platform. */
export const DEVFEST_EVENT_URL = 'https://gdg.community.dev/e/m8h9cm/';

const DAY_1 = '2026-11-13';
const DAY_2 = '2026-11-14';
const STAGE = 'Scena Główna';
const TALKS_ROOM = 'Prezentacje';
const WORKSHOPS_ROOM = 'Warsztaty';

const TBA: SessionPerson = { name: 'TBA', initials: 'TBA' };

/** "Jarosław Żołnowski" → "/speakers/jaroslaw-zolnowski.jpg" (`public/speakers`, ADR-0031). */
export function photoOf(name: string): string {
  const slug = name
    .replace(/[łŁ]/g, 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  return `/speakers/${slug}.jpg`;
}

/** A person on the programme, with their photo. */
function who(name: string): SessionPerson {
  return { name, photo: photoOf(name) };
}

const HERO: DevfestHeroContent = {
  image: {
    src: '/banners/devfest-2026.jpg',
    alt: 'DevFest 2026 — Join us! Google Developer Groups',
  },
  overline: 'WROCŁAW · 13–14 LISTOPADA 2026',
  caption:
    'Google Developer Groups — DevFest 2026 · Uniwersytet Ekonomiczny we Wrocławiu',
  action: { label: 'Zarejestruj się', href: DEVFEST_EVENT_URL },
};

/** "16:00" or "08:00 - 08:30" on `day` → "2026-11-13T16:00" for `<time datetime>`. */
function at(day: string, time: string): string {
  return `${day}T${time.slice(0, 5)}`;
}

function keynote(
  time: string,
  title: string,
  speaker: SessionPerson | string,
): { keynote: DevfestKeynote } {
  return {
    keynote: {
      title,
      time,
      dateTime: at(DAY_1, time),
      room: STAGE,
      abstract: DEVFEST_ABSTRACTS[title],
      speaker: typeof speaker === 'string' ? who(speaker) : speaker,
    },
  };
}

function panel(
  track: Track,
  time: string,
  host: string,
  panelists: readonly string[],
): { panel: DevfestPanel } {
  return {
    panel: {
      title: `${TRACK_LABELS[track]} Panel`,
      track,
      time,
      dateTime: at(DAY_1, time),
      room: STAGE,
      host: who(host),
      panelists: panelists.map(who),
    },
  };
}

/**
 * A day 2 session alone in its room: a talk or a workshop. Without a title the topic is still
 * to be announced.
 */
function session(
  time: string,
  track: Track,
  speaker: string,
  title?: string,
  extra: Partial<DevfestTalk> = {},
): DevfestSessionSlot {
  const dateTime = at(DAY_2, time);
  return {
    type: 'slot',
    time,
    dateTime,
    talks: [
      {
        title: title ?? 'Temat: TBA',
        track,
        time,
        dateTime,
        speakers: [who(speaker)],
        ...(title
          ? { abstract: DEVFEST_ABSTRACTS[title] }
          : { description: 'Temat zostanie ogłoszony wkrótce' }),
        ...extra,
      },
    ],
  };
}

function event(
  type: DevfestScheduleItem['type'],
  time: string,
  title: string,
  room: string,
): DevfestScheduleItem {
  return { type, title, time, dateTime: at(DAY_2, time), rooms: room };
}

const GENERIC = { trackLabel: 'Generic' } as const;

const TALKS: readonly DevfestParallelEntry[] = [
  event('shared', '07:30', 'Otwarcie eventu', TALKS_ROOM),
  session(
    '08:00 - 08:30',
    'mobile',
    'Oleksandr Tilnyi',
    'Trust, But Verify: Certificate Pinning in Flutter',
  ),
  session(
    '08:35 - 09:05',
    'cloud',
    'Ankur Roy',
    'BigQuery, the best non-AI focused AI platform in the world: a deep dive',
  ),
  session(
    '09:10 - 09:40',
    'web',
    'Jakub Andrzejewski',
    "It's Lights Out and Away We Go: Observability, Inspired by Formula 1",
  ),
  session(
    '09:45 - 10:15',
    'ai',
    'Paweł Kubiak',
    'From Human-Friendly to Agent-Friendly: WebMCP in Action',
  ),
  session(
    '10:20 - 10:50',
    'robotics',
    'Marcin Wysocki',
    'Three AIs walk into a bar',
  ),
  session('10:55 - 11:25', 'ai', 'Marcin Czarkowski'),
  session(
    '11:30 - 12:00',
    'web',
    'Tomasz Flis',
    'Beyond Chatbots: Streaming Structured JSON from Gemini to Angular Forms',
  ),
  event('break', '12:00 - 12:45', 'PRZERWA JEDZENIOWA', TALKS_ROOM),
  session('12:45 - 13:15', 'web', 'Dominika Zajac'),
  session(
    '13:20 - 13:50',
    'generic',
    'Artur Wojnar',
    'Implementing production-ready systems: DDD is not enough',
    GENERIC,
  ),
  session('13:55 - 14:25', 'ai', 'Przemysław Nowak'),
  session(
    '14:30 - 15:00',
    'mobile',
    'Elaine Dias Batista',
    'The State of Voice Interactions on Android',
  ),
  session(
    '15:05 - 15:35',
    'cloud',
    'Pawel Ostromecki',
    'My Barber Shipped While I Debated Architecture: Agentic AI in minutes with Firebase',
  ),
  session(
    '15:40 - 16:10',
    'web',
    'Jarosław Żołnowski',
    'Earn Your Complexity: Designing Angular Systems That Grow With the Product',
  ),
  session('16:15 - 16:45', 'ai', 'Julia Rapczyńska'),
  session(
    '16:50 - 17:20',
    'ai',
    'Tarun Jain',
    'Run On-device AI Applications without internet using Google LiteRT and Qdrant Edge',
  ),
  session(
    '17:25 - 17:45',
    'generic',
    'Mathias Weber',
    "Field Notes of a Technology Scout: What 200+ Tech Events Reveal About Europe's Tech Scene",
    GENERIC,
  ),
  event('break', '17:45 - 18:30', 'PRZERWA JEDZENIOWA', TALKS_ROOM),
  session(
    '18:30 - 19:00',
    'mobile',
    'Dominik Šimoník',
    'Building a Production Video Feed in Flutter',
  ),
  session(
    '19:05 - 19:35',
    'cloud',
    'Çalgan Aygün',
    'Event-Driven AI Pipelines on GCP: From Eventarc to LLMs',
  ),
  event(
    'shared',
    '19:50 - 20:15',
    'Oficjalne Zakończenie Wydarzenia',
    TALKS_ROOM,
  ),
];

const WORKSHOPS: readonly DevfestParallelEntry[] = [
  event('shared', '07:30', 'Otwarcie eventu', WORKSHOPS_ROOM),
  session(
    '08:00 - 08:45',
    'cloud',
    'Goran Minov',
    'Zero Infrastructure, Zero Phishing: Building a Serverless Security Framework on GCP',
  ),
  session(
    '09:00 - 09:45',
    'robotics',
    'Łukasz Janiec',
    'From Hallucination to Proof: Trustworthy AI Agents with Lean 4',
  ),
  session(
    '10:00 - 10:45',
    'web',
    'Muhammad Ahsan Ayaz',
    'Build a Travel agent using Google Gemini, MCP Servers, and Google Agent Development Kit (ADK)',
  ),
  event('break', '11:45 - 12:30', 'PRZERWA JEDZENIOWA', WORKSHOPS_ROOM),
  session(
    '12:30 - 13:15',
    'ai',
    'Greg Radzio',
    'Building the Agent Was the Easy Part',
  ),
  session(
    '13:30 - 14:15',
    'mobile',
    'Piotr Prus',
    'Scratch to Reveal: Building a Holographic Card with AGSL, Sensors and Canvas',
  ),
  session(
    '14:30 - 15:15',
    'ai',
    'Michał Jabłoński',
    'The Agents Optimization Lab',
  ),
  session(
    '15:30 - 16:15',
    'ai',
    'Hrishikesh Yadav',
    'Practical Introduction to DiffusionGemma via Google Cloud',
  ),
  session(
    '16:30 - 17:15',
    'mobile',
    'Renata Wietrzyńska',
    'Mobile A11y First Aid: A Practical Accessibility Workshop for Flutter Developers',
  ),
  event('break', '17:15 - 18:00', 'PRZERWA JEDZENIOWA', WORKSHOPS_ROOM),
  session(
    '18:00 - 18:45',
    'ai',
    'Bianca Ximenes',
    'Scaling AI systems and teams around the world: what actually breaks and why',
  ),
  session(
    '19:00 - 19:45',
    'cloud',
    'Piotr Biniecki',
    'Google Agent Platform in Action: Capabilities, Patterns, and Production Architecture',
  ),
  event('shared', '20:00', 'Oficjalne Zakończenie Wydarzenia', WORKSHOPS_ROOM),
];

const ROBOTICS_KEYNOTE = keynote(
  '16:50',
  'Who Let the Dogs Out? The State of AI Robotics',
  'Grzegorz Piotrowski',
).keynote;

export const DEVFEST_AGENDA: DevfestAgendaPageContent = {
  title: 'DevFest Wrocław 2026 — Harmonogram',
  hero: HERO,
  agenda: {
    overline: 'AGENDA / DEVFEST 2026',
    heading: 'Harmonogram & Sceny',
    mainStage: {
      label: 'Dzień 1: Panele Dyskusyjne & Keynotes',
      description:
        'Piątek, 13 listopada · Panele Dyskusyjne & Keynotes · Scena Główna',
      sessions: [
        panel('web', '16:00', 'Adrian Romański', [
          'Dominika Zajac',
          'Muhammad Ahsan Ayaz',
          'Jarosław Żołnowski',
          'Julia Rapczyńska',
          'Jakub Andrzejewski',
        ]),
        { keynote: ROBOTICS_KEYNOTE },
        panel('cloud', '17:00', 'Michał Jabłoński', [
          'Goran Minov',
          'Çalgan Aygün',
          'Pawel Ostromecki',
          'Piotr Biniecki',
          'Ankur Roy',
        ]),
        keynote('17:50', 'RoboPies', 'Przemysław Nowak'),
        panel('mobile', '18:00', 'Artur Skrzypczyk', [
          'Piotr Prus',
          'Elaine Dias Batista',
          'Dominik Šimoník',
          'Oleksandr Tilnyi',
          'Renata Wietrzyńska',
        ]),
        keynote('18:50', 'Synergy Codes', TBA),
        panel('ai', '19:00', 'Dawid Perdek', [
          'Greg Radzio',
          'Łukasz Jaźwa',
          'Paweł Kubiak',
          'Marcin Czarkowski',
          'Tarun Jain',
        ]),
        keynote('19:50', 'Humanoid', 'Michal Pogoda Rosikon'),
      ],
    },
    parallel: {
      label: 'Dzień 2: Warsztaty & Prezentacje',
      description:
        'Sobota, 14 listopada · Prezentacje (20–30 min) i warsztaty (45 min) równolegle',
      rooms: [TALKS_ROOM],
      entries: TALKS,
      talksLabel: 'Prezentacje',
      workshopsLabel: 'Warsztaty (Hands-on Labs)',
      workshopRooms: [WORKSHOPS_ROOM],
      workshops: WORKSHOPS,
    },
  },
};

const PANELIST = (track: string) => `Panelista · ${track} panel`;
const PANELIST_F = (track: string) => `Panelistka · ${track} panel`;
const PRESENTER = (track: string) => `Prelegent · ${track} prezentacja`;
const PRESENTER_F = (track: string) => `Prelegentka · ${track} prezentacja`;
const TRAINER = (track: string) => `Trener · ${track} warsztat`;
const TRAINER_F = (track: string) => `Trenerka · ${track} warsztat`;

function people(
  track: Track,
  entries: readonly [string, DevfestSpeaker['role'], string?][],
): DevfestSpeaker[] {
  return entries.map(([name, role, talk]) => ({
    ...who(name),
    track,
    role,
    talk,
    bio: DEVFEST_BIOS[name],
  }));
}

export const DEVFEST_SPEAKERS: DevfestSpeakersPageContent = {
  title: 'DevFest Wrocław 2026 — Prelegenci & Prowadzący',
  hero: { image: HERO.image },
  speakers: {
    heading: {
      overline: 'LUDZIE / DEVFEST 2026',
      heading: 'Prelegenci & Prowadzący',
      description:
        'Poznaj osoby, które tworzą program DevFest Wrocław 2026 — 34 osoby w programie.',
    },
    allLabel: 'Wszyscy',
    groups: [
      {
        id: 'keynote',
        label: 'Keynote',
        heading: {
          overline: 'DZIEŃ 1',
          heading: 'Keynotes',
          description:
            'Dziesięciominutowe wystąpienia przed każdym panelem. Keynote Synergy Codes zostanie ogłoszony wkrótce.',
        },
        keynote: {
          ...ROBOTICS_KEYNOTE,
          time: 'Dzień 1 · 16:50',
          room: 'Robotyka / AI',
        },
        speakers: [
          ...people('ai', [
            ['Przemysław Nowak', ['Keynote · RoboPies', PRESENTER('AI')]],
          ]),
          ...people('robotics', [
            ['Michal Pogoda Rosikon', 'Keynote · Humanoid'],
          ]),
        ],
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
          ...people('web', [['Adrian Romański', 'Prowadzący Web panel']]),
          ...people('cloud', [
            [
              'Michał Jabłoński',
              ['Prowadzący Cloud panel', TRAINER('AI')],
              'The Agents Optimization Lab',
            ],
          ]),
          ...people('mobile', [
            ['Artur Skrzypczyk', 'Prowadzący Mobile panel'],
          ]),
          ...people('ai', [['Dawid Perdek', 'Prowadzący AI panel']]),
        ],
      },
      {
        id: 'panelists',
        label: 'Paneliści',
        heading: {
          overline: '20 OSÓB',
          heading: 'Paneliści & prelegenci',
          description:
            'Uczestnicy paneli. Osoby występujące także z prezentacją lub warsztatem mają wszystkie role na jednej karcie.',
        },
        speakers: [
          ...people('web', [
            ['Dominika Zajac', [PANELIST_F('Web'), PRESENTER_F('Web')]],
            [
              'Muhammad Ahsan Ayaz',
              [PANELIST('Web'), TRAINER('Web')],
              'Build a Travel agent using Google Gemini, MCP Servers, and Google Agent Development Kit (ADK)',
            ],
            [
              'Jarosław Żołnowski',
              [PANELIST('Web'), PRESENTER('Web')],
              'Earn Your Complexity: Designing Angular Systems That Grow With the Product',
            ],
            ['Julia Rapczyńska', [PANELIST_F('Web'), PRESENTER_F('AI')]],
            [
              'Jakub Andrzejewski',
              [PANELIST('Web'), PRESENTER('Web')],
              "It's Lights Out and Away We Go: Observability, Inspired by Formula 1",
            ],
          ]),
          ...people('cloud', [
            [
              'Goran Minov',
              [PANELIST('Cloud'), TRAINER('Cloud')],
              'Zero Infrastructure, Zero Phishing: Building a Serverless Security Framework on GCP',
            ],
            [
              'Çalgan Aygün',
              [PANELIST('Cloud'), PRESENTER('Cloud')],
              'Event-Driven AI Pipelines on GCP: From Eventarc to LLMs',
            ],
            [
              'Pawel Ostromecki',
              [PANELIST('Cloud'), PRESENTER('Cloud')],
              'My Barber Shipped While I Debated Architecture: Agentic AI in minutes with Firebase',
            ],
            [
              'Piotr Biniecki',
              [PANELIST('Cloud'), TRAINER('Cloud')],
              'Google Agent Platform in Action: Capabilities, Patterns, and Production Architecture',
            ],
            [
              'Ankur Roy',
              [PANELIST('Cloud'), PRESENTER('Cloud')],
              'BigQuery, the best non-AI focused AI platform in the world: a deep dive',
            ],
          ]),
          ...people('mobile', [
            [
              'Piotr Prus',
              [PANELIST('Mobile'), TRAINER('Mobile')],
              'Scratch to Reveal: Building a Holographic Card with AGSL, Sensors and Canvas',
            ],
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
            [
              'Oleksandr Tilnyi',
              [PANELIST('Mobile'), PRESENTER('Mobile')],
              'Trust, But Verify: Certificate Pinning in Flutter',
            ],
            [
              'Renata Wietrzyńska',
              [PANELIST_F('Mobile'), TRAINER_F('Mobile')],
              'Mobile A11y First Aid: A Practical Accessibility Workshop for Flutter Developers',
            ],
          ]),
          ...people('ai', [
            [
              'Greg Radzio',
              [PANELIST('AI'), TRAINER('AI')],
              'Building the Agent Was the Easy Part',
            ],
            ['Łukasz Jaźwa', PANELIST('AI')],
            [
              'Paweł Kubiak',
              [PANELIST('AI'), PRESENTER('AI')],
              'From Human-Friendly to Agent-Friendly: WebMCP in Action',
            ],
            ['Marcin Czarkowski', [PANELIST('AI'), PRESENTER('AI')]],
            [
              'Tarun Jain',
              [PANELIST('AI'), PRESENTER('AI')],
              'Run On-device AI Applications without internet using Google LiteRT and Qdrant Edge',
            ],
          ]),
        ],
      },
      {
        id: 'presenters',
        label: 'Prezentacje',
        heading: {
          overline: '4 OSOBY',
          heading: 'Prelegenci prezentacji',
          description:
            'Pozostali prelegenci drugiego dnia — prezentacje na ścieżkach tematycznych.',
        },
        speakers: [
          ...people('robotics', [
            [
              'Marcin Wysocki',
              PRESENTER('Robotyka'),
              'Three AIs walk into a bar',
            ],
          ]),
          ...people('web', [
            [
              'Tomasz Flis',
              PRESENTER('Web'),
              'Beyond Chatbots: Streaming Structured JSON from Gemini to Angular Forms',
            ],
          ]),
          ...people('generic', [
            [
              'Artur Wojnar',
              PRESENTER('Generic'),
              'Implementing production-ready systems: DDD is not enough',
            ],
            [
              'Mathias Weber',
              PRESENTER('Generic'),
              "Field Notes of a Technology Scout: What 200+ Tech Events Reveal About Europe's Tech Scene",
            ],
          ]).map((speaker) => ({ ...speaker, ...GENERIC })),
        ],
      },
      {
        id: 'trainers',
        label: 'Trenerzy',
        heading: {
          overline: 'DZIEŃ 2 · 3 OSOBY',
          heading: 'Trenerzy warsztatów',
          description:
            'Pozostałe osoby prowadzące warsztaty. Trenerzy, którzy są też w panelach, mają tę rolę na swojej karcie.',
        },
        speakers: [
          ...people('robotics', [
            [
              'Łukasz Janiec',
              TRAINER('Robotyka'),
              'From Hallucination to Proof: Trustworthy AI Agents with Lean 4',
            ],
          ]),
          ...people('ai', [
            [
              'Hrishikesh Yadav',
              TRAINER('AI'),
              'Practical Introduction to DiffusionGemma via Google Cloud',
            ],
            [
              'Bianca Ximenes',
              TRAINER_F('AI'),
              'Scaling AI systems and teams around the world: what actually breaks and why',
            ],
          ]),
        ],
      },
    ],
  },
};
