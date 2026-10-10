import type { SocialLink } from '../person/person';
import type { NavAction, NavLink } from './nav-link';

/**
 * Story-only sample of the Figma Landing Page navigation (ADR-0020); this file is not exported
 * from the library.
 */
export const SAMPLE_NAV_LINKS: NavLink[] = [
  { label: 'Agenda', href: '#agenda' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Organizers', href: '#organizers' },
  { label: 'Q&A', href: '#faq' },
  { label: 'About us', href: '#about' },
];

export const SAMPLE_NAV_ACTIONS: NavAction[] = [
  { label: 'Register', href: '#register' },
  { label: 'Contact us', href: '#contact', variant: 'secondary' },
];

export const SAMPLE_COMMUNITY_SOCIALS: SocialLink[] = [
  { network: 'facebook', url: 'https://www.facebook.com/' },
  { network: 'instagram', url: 'https://www.instagram.com/' },
  { network: 'x', url: 'https://x.com/' },
  { network: 'linkedin', url: 'https://www.linkedin.com/' },
  { network: 'youtube', url: 'https://www.youtube.com/' },
];

export const SAMPLE_LEGAL_LINKS: NavLink[] = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms of Service', href: '#terms' },
  { label: 'Cookies Settings', href: '#cookies' },
];
