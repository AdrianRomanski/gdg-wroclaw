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
import { DEVFEST_PANELS } from './devfest-panels';

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
const STAGE = 'Main Stage';
const TALKS_ROOM = 'Talks';
const WORKSHOPS_ROOM = 'Workshops';

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
  return { name, photo: photoOf(name), bio: DEVFEST_BIOS[name] };
}

const HERO: DevfestHeroContent = {
  image: {
    src: '/banners/devfest-2026.jpg',
    alt: 'DevFest 2026 — Join us! Google Developer Groups',
  },
  overline: 'WROCŁAW · 13–14 NOVEMBER 2026',
  caption:
    'Google Developer Groups — DevFest 2026 · Wrocław University of Economics and Business',
  action: { label: 'Register', href: DEVFEST_EVENT_URL },
};

/** "16:00" or "08:00 - 08:30" on `day` → "2026-11-13T16:00" for `<time datetime>`. */
function at(day: string, time: string): string {
  return `${day}T${time.slice(0, 5)}`;
}

function keynote(
  time: string,
  title: string,
  speaker: SessionPerson | string,
  track?: Track,
): { keynote: DevfestKeynote } {
  return {
    keynote: {
      title,
      ...(track ? { track } : {}),
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
      ...DEVFEST_PANELS[track],
      host: who(host),
      panelists: panelists.map(who),
    },
  };
}

/**
 * A day 2 session alone in its room: a talk or a workshop. Without a title the topic is still
 * to be announced. The time is shown once, beside the card (ADR-0032).
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
        title: title ?? 'Topic: TBA',
        track,
        speakers: [who(speaker)],
        ...(title
          ? { abstract: DEVFEST_ABSTRACTS[title] }
          : { description: 'Topic to be announced soon' }),
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
  event('shared', '07:30', 'Opening', TALKS_ROOM),
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
  event('break', '12:00 - 12:45', 'MEAL BREAK', TALKS_ROOM),
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
  event('break', '17:45 - 18:30', 'MEAL BREAK', TALKS_ROOM),
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
  event('shared', '19:50 - 20:15', 'Official Closing', TALKS_ROOM),
];

const WORKSHOPS: readonly DevfestParallelEntry[] = [
  event('shared', '07:30', 'Opening', WORKSHOPS_ROOM),
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
  event('break', '11:45 - 12:30', 'MEAL BREAK', WORKSHOPS_ROOM),
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
  event('break', '17:15 - 18:00', 'MEAL BREAK', WORKSHOPS_ROOM),
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
  event('shared', '20:00', 'Official Closing', WORKSHOPS_ROOM),
];

const ROBOTICS_KEYNOTE = keynote(
  '16:50',
  'Who Let the Dogs Out? The State of AI Robotics',
  'Grzegorz Piotrowski',
  'robotics',
).keynote;

export const DEVFEST_AGENDA: DevfestAgendaPageContent = {
  title: 'DevFest Wrocław 2026 — Agenda',
  hero: HERO,
  agenda: {
    overline: 'AGENDA / DEVFEST 2026',
    heading: 'Agenda & Stages',
    mainStage: {
      label: 'Day 1: Discussion Panels & Keynotes',
      description:
        'Friday, 13 November · Discussion Panels & Keynotes · Main Stage',
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
        keynote('17:50', 'RoboPies', 'Przemysław Nowak', 'robotics'),
        panel('mobile', '18:00', 'Artur Skrzypczyk', [
          'Piotr Prus',
          'Elaine Dias Batista',
          'Dominik Šimoník',
          'Oleksandr Tilnyi',
          'Renata Wietrzyńska',
        ]),
        keynote(
          '18:50',
          'The World Is Your Next Runtime',
          'Michal Pogoda Rosikon',
          'robotics',
        ),
        panel('ai', '19:00', 'Dawid Perdek', [
          'Greg Radzio',
          'Łukasz Jaźwa',
          'Paweł Kubiak',
          'Marcin Czarkowski',
          'Tarun Jain',
        ]),
        keynote(
          '19:50',
          'The Road to Optimizing the AI Bill',
          'Łukasz Jaźwa',
          'ai',
        ),
      ],
    },
    parallel: {
      label: 'Day 2: Workshops & Talks',
      description:
        'Saturday, 14 November · Talks (20–30 min) and workshops (45 min) in parallel',
      rooms: [TALKS_ROOM],
      entries: TALKS,
      talksLabel: 'Talks',
      workshopsLabel: 'Workshops (Hands-on Labs)',
      workshopRooms: [WORKSHOPS_ROOM],
      workshops: WORKSHOPS,
    },
  },
};

const PANELIST = (track: string) => `Panelist · ${track} panel`;
const PRESENTER = (track: string) => `Speaker · ${track} talk`;
const TRAINER = (track: string) => `Trainer · ${track} workshop`;

function people(
  track: Track,
  entries: readonly [string, DevfestSpeaker['role'], string?][],
): DevfestSpeaker[] {
  return entries.map(([name, role, talk]) => ({
    ...who(name),
    track,
    role,
    talk,
  }));
}

export const DEVFEST_SPEAKERS: DevfestSpeakersPageContent = {
  title: 'DevFest Wrocław 2026 — Speakers & Hosts',
  hero: { image: HERO.image },
  speakers: {
    heading: {
      overline: 'PEOPLE / DEVFEST 2026',
      heading: 'Speakers & Hosts',
      description:
        'Meet the people behind the DevFest Wrocław 2026 programme: 34 people in the lineup.',
    },
    allLabel: 'All',
    groups: [
      {
        id: 'keynote',
        label: 'Keynote',
        heading: {
          overline: 'DAY 1',
          heading: 'Keynotes',
          description:
            'Ten-minute talks between the panels, on robotics and AI.',
        },
        keynote: {
          ...ROBOTICS_KEYNOTE,
          time: 'Day 1 · 16:50',
          room: 'Robotics / AI',
        },
        speakers: [
          ...people('ai', [
            ['Przemysław Nowak', ['Keynote · RoboPies', PRESENTER('AI')]],
          ]),
          ...people('robotics', [
            [
              'Michal Pogoda Rosikon',
              'Keynote · Robotics',
              'The World Is Your Next Runtime',
            ],
          ]),
        ],
      },
      {
        id: 'hosts',
        label: 'Hosts',
        heading: {
          overline: '4 PEOPLE',
          heading: 'Panel hosts',
          description:
            'The people moderating the conversations on the four tracks.',
        },
        speakers: [
          ...people('web', [['Adrian Romański', 'Host · Web panel']]),
          ...people('cloud', [
            [
              'Michał Jabłoński',
              ['Host · Cloud panel', TRAINER('AI')],
              'The Agents Optimization Lab',
            ],
          ]),
          ...people('mobile', [['Artur Skrzypczyk', 'Host · Mobile panel']]),
          ...people('ai', [['Dawid Perdek', 'Host · AI panel']]),
        ],
      },
      {
        id: 'panelists',
        label: 'Panelists',
        heading: {
          overline: '20 PEOPLE',
          heading: 'Panelists & speakers',
          description:
            'The panel participants. People who also give a talk or a workshop have all their roles on one card.',
        },
        speakers: [
          ...people('web', [
            ['Dominika Zajac', [PANELIST('Web'), PRESENTER('Web')]],
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
            ['Julia Rapczyńska', [PANELIST('Web'), PRESENTER('AI')]],
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
              [PANELIST('Mobile'), PRESENTER('Mobile')],
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
              [PANELIST('Mobile'), TRAINER('Mobile')],
              'Mobile A11y First Aid: A Practical Accessibility Workshop for Flutter Developers',
            ],
          ]),
          ...people('ai', [
            [
              'Greg Radzio',
              [PANELIST('AI'), TRAINER('AI')],
              'Building the Agent Was the Easy Part',
            ],
            [
              'Łukasz Jaźwa',
              [PANELIST('AI'), 'Keynote · AI'],
              'The Road to Optimizing the AI Bill',
            ],
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
        label: 'Talks',
        heading: {
          overline: '4 PEOPLE',
          heading: 'Talk speakers',
          description: 'The other day 2 speakers, with talks on the tracks.',
        },
        speakers: [
          ...people('robotics', [
            [
              'Marcin Wysocki',
              PRESENTER('Robotics'),
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
        label: 'Trainers',
        heading: {
          overline: 'DAY 2 · 3 PEOPLE',
          heading: 'Workshop trainers',
          description:
            'The other workshop trainers. Trainers who are also on a panel have this role on their card.',
        },
        speakers: [
          ...people('robotics', [
            [
              'Łukasz Janiec',
              TRAINER('Robotics'),
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
              TRAINER('AI'),
              'Scaling AI systems and teams around the world: what actually breaks and why',
            ],
          ]),
        ],
      },
    ],
  },
};
