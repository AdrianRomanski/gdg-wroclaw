import type {
  DevfestAgendaPageContent,
  DevfestSpeakersPageContent,
} from './devfest-content';
import type { DevfestTalk } from '../devfest-session/devfest-session';

// Story and test fixtures with the Figma DevFest page copy (ADR-0029), shortened.

const TBA = 'Prelegent i temat zostaną ogłoszeni wkrótce';

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
  title: 'DevFest Wrocław 2026 — Harmonogram',
  hero: {
    // A neutral placeholder: Storybook has no app assets.
    image: {
      src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"%3E%3Crect width="16" height="9" fill="%23f0f0f0"/%3E%3C/svg%3E',
      alt: 'DevFest 2026',
    },
    overline: 'WROCŁAW · 2026',
    caption: 'Google Developer Groups — DevFest 2026',
    action: { label: 'Zarejestruj się', href: '#' },
  },
  agenda: {
    overline: 'AGENDA / DEVFEST 2026',
    heading: 'Harmonogram & Sceny',
    mainStage: {
      label: 'Dzień 1: Panele Dyskusyjne & Keynotes',
      description:
        'Dzień 1 / Rozmowy, które inspirują · Panele Dyskusyjne & Keynotes · Scena Główna',
      sessions: [
        {
          keynote: {
            title: 'Who Let the Dogs Out? The State of AI Robotics',
            time: '15:50',
            room: 'Scena Główna',
            speaker: { name: 'Grzegorz Piotrowski' },
          },
        },
        {
          panel: {
            title: 'AI Panel',
            track: 'ai',
            time: '16:00',
            room: 'Scena Główna',
            host: { name: 'Dawid Perdek' },
            panelists: [{ name: 'Greg Radzio' }, { name: 'Łukasz Jaźwa' }],
          },
        },
        {
          panel: {
            title: 'Web Panel',
            track: 'web',
            time: '17:00',
            room: 'Scena Główna',
            host: { name: 'Adrian Romański' },
            panelists: [{ name: 'Dominika Zajac' }],
          },
        },
      ],
    },
    parallel: {
      label: 'Dzień 2: Warsztaty & Prezentacje',
      description: 'Dzień 2 / Prezentacje · Sala A / Sala B',
      rooms: ['Sala A', 'Sala B'],
      talksLabel: 'Prezentacje (2 Sale Równolegle)',
      workshopsLabel: 'Warsztaty (Hands-on Labs)',
      workshopsNote: 'Harmonogram warsztatów pojawi się tutaj.',
      entries: [
        {
          type: 'shared',
          title: 'Otwarcie eventu',
          time: '07:30',
          rooms: 'Sala A + Sala B',
        },
        {
          type: 'slot',
          time: '08:00 - 08:30',
          talks: [
            talk('mobile', 'Sala A', 'Oleksandr Tilnyi'),
            talk('cloud', 'Sala B', 'Ankur Roy'),
          ],
        },
        {
          type: 'slot',
          time: '09:10 / 09:45',
          groupedTime: '09:10 - 09:40 / 09:45 - 10:15',
          groupedNote: 'Wspólny blok harmonogramu · dwa zakresy godzin',
          talks: [
            talk('robotics', 'Sala A', 'Marcin Wysocki'),
            talk('ai', 'Sala B', 'Paweł Kubiak', {
              title: 'From Human-Friendly to Agent-Friendly: WebMCP in Action',
              description: undefined,
              abstract:
                'Exposing web app capabilities to AI agents as structured tools using WebMCP and Angular',
            }),
          ],
        },
        {
          type: 'break',
          title: 'PRZERWA JEDZENIOWA',
          time: '12:00 - 12:45',
          rooms: 'Sala A + Sala B',
        },
        {
          type: 'slot',
          time: '17:25 - 17:45',
          talks: [
            talk('generic', 'Sala: TBA', 'Mathias Weber', {
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
      workshopRooms: ['Warsztaty'],
      workshops: [
        {
          type: 'shared',
          title: 'Welcome',
          time: '07:30',
          rooms: 'Warsztaty',
        },
        {
          type: 'slot',
          time: '08:00 - 08:45',
          talks: [
            talk('cloud', 'Warsztaty', 'Goran Minov', {
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
            talk('ai', 'Warsztaty', 'Michał Jabłoński', {
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
  title: 'DevFest Wrocław 2026 — Prelegenci & Prowadzący',
  hero: { image: SAMPLE_AGENDA_PAGE.hero.image },
  speakers: {
    heading: {
      overline: 'LUDZIE / DEVFEST 2026',
      heading: 'Prelegenci & Prowadzący',
      description: 'Poznaj osoby, które tworzą program DevFest Wrocław 2026.',
    },
    allLabel: 'Wszyscy',
    groups: [
      {
        id: 'keynote',
        label: 'Keynote',
        keynote: {
          title: 'Who Let the Dogs Out? The State of AI Robotics',
          time: 'Dzień 1 · 15:50',
          room: 'Robotyka / AI',
          speaker: { name: 'Grzegorz Piotrowski' },
        },
      },
      {
        id: 'hosts',
        label: 'Prowadzący',
        heading: { overline: '2 OSOBY', heading: 'Prowadzący paneli' },
        speakers: [
          { name: 'Dawid Perdek', track: 'ai', role: 'Prowadzący AI panel' },
          {
            name: 'Michał Jabłoński',
            track: 'cloud',
            role: 'Prowadzący Cloud panel',
            talk: 'GDG Warszawa',
          },
        ],
      },
      {
        id: 'panelists',
        label: 'Paneliści',
        heading: { overline: '2 OSOBY', heading: 'Paneliści & prelegenci' },
        speakers: [
          {
            name: 'Paweł Kubiak',
            track: 'ai',
            role: ['Panelista · AI panel', 'Prelegent · AI prezentacja'],
            talk: 'From Human-Friendly to Agent-Friendly: WebMCP in Action',
          },
          {
            name: 'Mathias Weber',
            track: 'generic',
            trackLabel: 'Generic',
            role: 'Prelegent · Generic prezentacja',
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
