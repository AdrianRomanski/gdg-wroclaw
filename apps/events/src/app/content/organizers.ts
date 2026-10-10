import type { Person } from '@gdg-wroclaw/ui';

const organizer = (
  name: string,
  photo: string,
  jobTitle?: string,
  linkedin?: string,
): Person => ({
  name,
  jobTitle,
  photo: { src: `/team/${photo}.jpg` },
  role: 'organizer',
  socials: linkedin ? [{ network: 'linkedin', url: linkedin }] : undefined,
});

/** The chapter organizers, as listed on gdg.community.dev/gdg-wroclaw (October 2026). */
export const ORGANIZER = {
  karol: organizer(
    'Karol Wrótniak',
    'karol-wrotniak',
    'GDG Organizer',
    'https://www.linkedin.com/in/karol-wrotniak/',
  ),
  artur: organizer(
    'Artur Skrzypczyk',
    'artur-skrzypczyk',
    undefined,
    'https://www.linkedin.com/in/artur-skrzypczyk/',
  ),
  adrian: organizer(
    'Adrian Romański',
    'adrian-romanski',
    'Software Engineer, Push-Based',
    'https://www.linkedin.com/in/adrianromanski/',
  ),
  dawid: organizer(
    'Dawid Perdek',
    'dawid-perdek',
    'Staff Software Engineer, Altium',
    'https://www.linkedin.com/in/perdekdawid',
  ),
  luka: organizer('Luka Malakhau', 'luka-malakhau', 'Software Developer'),
  jan: organizer('Jan Łuczka', 'jan-luczka', 'Android Developer'),
  szymon: organizer(
    'Szymon Mazanik',
    'szymon-mazanik',
    'Flutter Lead',
    'https://www.linkedin.com/in/szymonmazanik/',
  ),
} as const satisfies Record<string, Person>;

/** The whole team, in the order shown on the landing page. */
export const ORGANIZERS: readonly Person[] = [
  ORGANIZER.karol,
  ORGANIZER.artur,
  ORGANIZER.adrian,
  ORGANIZER.dawid,
  ORGANIZER.luka,
  ORGANIZER.jan,
  ORGANIZER.szymon,
];
