import type { NavAction, NavLink, SocialLink } from '@gdg-wroclaw/ui';
import { LANDING_SECTION_IDS } from '@gdg-wroclaw/ui';

/** The GDG Wrocław chapter page on the official community platform. */
export const COMMUNITY_URL = 'https://gdg.community.dev/gdg-wroclaw/';

/** The DevFest agenda and speakers (ADR-0029), then in-page links to the Landing page sections, which work from every route. */
export const NAV_LINKS: NavLink[] = [
  { label: 'DevFest', href: '/devfest' },
  { label: 'Speakers', href: '/devfest/speakers' },
  { label: 'Events', href: `/#${LANDING_SECTION_IDS.events}` },
  { label: 'Team', href: `/#${LANDING_SECTION_IDS.team}` },
  { label: 'Sponsors', href: `/#${LANDING_SECTION_IDS.sponsors}` },
  { label: 'Partners', href: `/#${LANDING_SECTION_IDS.partners}` },
  { label: 'FAQ', href: `/#${LANDING_SECTION_IDS.faq}` },
];

export const NAV_ACTIONS: NavAction[] = [
  { label: 'Register', href: COMMUNITY_URL },
  { label: 'Contact us', href: '/contact', variant: 'secondary' },
];

/** The chapter's social profiles. Empty until the real accounts are listed. */
export const COMMUNITY_SOCIALS: SocialLink[] = [];

/** Footer legal links. Empty until the pages exist. */
export const LEGAL_LINKS: NavLink[] = [];

/** Terms the contact form asks visitors to accept. */
export const TERMS_URL = 'https://developers.google.com/community-guidelines';
