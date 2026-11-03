import type {
  DevfestAgendaPageContent,
  DevfestSpeakersPageContent,
} from './devfest-content';
import type { DevfestTalk } from '../devfest-session/devfest-session';

// Story and test fixtures with the Figma DevFest page copy (ADR-0029), shortened.

const TBA = 'Speaker and topic to be announced soon';

function talk(
  track: DevfestTalk['track'],
  room: string,
  name: string,
  extra: Partial<DevfestTalk> = {},
): DevfestTalk {
  return {
    title: 'Topic: TBA',
    track,
    time: '08:00 - 08:30',
    room,
    description: TBA,
    speakers: [{ name }],
    ...extra,
  };
}

export const SAMPLE_AGENDA_PAGE: DevfestAgendaPageContent = {
  title: 'DevFest Wrocław 2026 — Agenda',
  hero: {
    // A neutral placeholder: Storybook has no app assets.
    image: {
      src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"%3E%3Crect width="16" height="9" fill="%23f0f0f0"/%3E%3C/svg%3E',
      alt: 'DevFest 2026',
    },
    overline: 'WROCŁAW · 2026',
    caption: 'Google Developer Groups — DevFest 2026',
    action: { label: 'Register', href: '#' },
  },
  agenda: {
    overline: 'AGENDA / DEVFEST 2026',
    heading: 'Agenda & Stages',
    mainStage: {
      label: 'Day 1: Discussion Panels & Keynotes',
      description:
        'Day 1 / Conversations that inspire · Discussion Panels & Keynotes · Main Stage',
      sessions: [
        {
          keynote: {
            title: 'Who Let the Dogs Out? The State of AI Robotics',
            time: '15:50',
            room: 'Main Stage',
            speaker: { name: 'Grzegorz Piotrowski' },
          },
        },
        {
          panel: {
            title: 'AI Panel',
            track: 'ai',
            time: '16:00',
            room: 'Main Stage',
            host: { name: 'Dawid Perdek' },
            panelists: [{ name: 'Greg Radzio' }, { name: 'Łukasz Jaźwa' }],
          },
        },
        {
          panel: {
            title: 'Web Panel',
            track: 'web',
            time: '17:00',
            room: 'Main Stage',
            host: { name: 'Adrian Romański' },
            panelists: [{ name: 'Dominika Zajac' }],
          },
        },
      ],
    },
    parallel: {
      label: 'Day 2: Workshops & Talks',
      description: 'Day 2 / Talks · Room A / Room B',
      rooms: ['Room A', 'Room B'],
      talksLabel: 'Talks (2 Rooms in Parallel)',
      workshopsLabel: 'Workshops (Hands-on Labs)',
      workshopsNote: 'The workshop schedule will appear here.',
      entries: [
        {
          type: 'shared',
          title: 'Opening',
          time: '07:30',
          rooms: 'Room A + Room B',
        },
        {
          type: 'slot',
          time: '08:00 - 08:30',
          talks: [
            talk('mobile', 'Room A', 'Oleksandr Tilnyi'),
            talk('cloud', 'Room B', 'Ankur Roy'),
          ],
        },
        {
          type: 'slot',
          time: '09:10 / 09:45',
          groupedTime: '09:10 - 09:40 / 09:45 - 10:15',
          groupedNote: 'Shared schedule block · two time ranges',
          talks: [
            talk('robotics', 'Room A', 'Marcin Wysocki'),
            talk('ai', 'Room B', 'Paweł Kubiak', {
              title: 'From Human-Friendly to Agent-Friendly: WebMCP in Action',
              description: undefined,
              abstract:
                'Exposing web app capabilities to AI agents as structured tools using WebMCP and Angular',
            }),
          ],
        },
        {
          type: 'break',
          title: 'MEAL BREAK',
          time: '12:00 - 12:45',
          rooms: 'Room A + Room B',
        },
        {
          type: 'slot',
          time: '17:25 - 17:45',
          talks: [
            talk('generic', 'Room: TBA', 'Mathias Weber', {
              trackLabel: 'Generic',
            }),
            null,
          ],
        },
      ],
    },
  },
};

/** Day 2 with a published workshop agenda in its own room. */
export const SAMPLE_AGENDA_PAGE_WITH_WORKSHOPS: DevfestAgendaPageContent = {
  ...SAMPLE_AGENDA_PAGE,
  agenda: {
    ...SAMPLE_AGENDA_PAGE.agenda,
    parallel: {
      ...SAMPLE_AGENDA_PAGE.agenda.parallel,
      workshopsNote: undefined,
      workshopRooms: ['Workshops'],
      workshops: [
        {
          type: 'shared',
          title: 'Welcome',
          time: '07:30',
          rooms: 'Workshops',
        },
        {
          type: 'slot',
          time: '08:00 - 08:45',
          talks: [
            talk('cloud', 'Workshops', 'Goran Minov', {
              title: 'Zero Infrastructure, Zero Phishing',
              time: '08:00 - 08:45',
              description: undefined,
            }),
          ],
        },
        {
          type: 'slot',
          time: '14:30 - 15:15',
          talks: [
            talk('ai', 'Workshops', 'Michał Jabłoński', {
              title: 'The Agents Optimization Lab',
              time: '14:30 - 15:15',
              description: undefined,
            }),
          ],
        },
      ],
    },
  },
};

export const SAMPLE_SPEAKERS_PAGE: DevfestSpeakersPageContent = {
  title: 'DevFest Wrocław 2026 — Speakers & Hosts',
  hero: { image: SAMPLE_AGENDA_PAGE.hero.image },
  speakers: {
    heading: {
      overline: 'PEOPLE / DEVFEST 2026',
      heading: 'Speakers & Hosts',
      description: 'Meet the people behind the DevFest Wrocław 2026 programme.',
    },
    allLabel: 'All',
    groups: [
      {
        id: 'keynote',
        label: 'Keynote',
        keynote: {
          title: 'Who Let the Dogs Out? The State of AI Robotics',
          time: 'Day 1 · 15:50',
          room: 'Robotics / AI',
          speaker: { name: 'Grzegorz Piotrowski' },
        },
      },
      {
        id: 'hosts',
        label: 'Hosts',
        heading: { overline: '2 PEOPLE', heading: 'Panel hosts' },
        speakers: [
          { name: 'Dawid Perdek', track: 'ai', role: 'Host · AI panel' },
          {
            name: 'Michał Jabłoński',
            track: 'cloud',
            role: 'Host · Cloud panel',
            talk: 'GDG Warszawa',
          },
        ],
      },
      {
        id: 'panelists',
        label: 'Panelists',
        heading: { overline: '2 PEOPLE', heading: 'Panelists & speakers' },
        speakers: [
          {
            name: 'Paweł Kubiak',
            track: 'ai',
            role: ['Panelist · AI panel', 'Speaker · AI talk'],
            talk: 'From Human-Friendly to Agent-Friendly: WebMCP in Action',
          },
          {
            name: 'Mathias Weber',
            track: 'generic',
            trackLabel: 'Generic',
            role: 'Speaker · Generic talk',
          },
        ],
      },
      {
        id: 'trainers',
        label: 'Trainers',
        heading: { overline: 'DAY 2', heading: 'Workshop trainers' },
        emptyNote: 'The list of workshop trainers will appear here.',
      },
    ],
  },
};
