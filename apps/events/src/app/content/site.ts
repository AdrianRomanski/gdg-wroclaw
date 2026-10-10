import type { NavAction, NavLink, SocialLink } from '@gdg-wroclaw/ui';
import { LANDING_SECTION_IDS } from '@gdg-wroclaw/ui';

/** The GDG Wrocław chapter page on the official community platform. */
export const COMMUNITY_URL = 'https://gdg.community.dev/gdg-wroclaw/';

/** In-page links to the Landing page sections; they work from every route. */
export const NAV_LINKS: NavLink[] = [
  { label: 'Events', href: `/#${LANDING_SECTION_IDS.events}` },
  { label: 'Team', href: `/#${LANDING_SECTION_IDS.team}` },
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
