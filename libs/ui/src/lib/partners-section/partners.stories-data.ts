import type { Partner } from '../partner-card/partner';

/**
 * Story-only sample partners: Figma uses an image placeholder, so a neutral placeholder logo is
 * served by apps/storybook/public/partners (ADR-0019); this file is not exported from the library.
 */
export const SAMPLE_PARTNERS: Partner[] = Array.from({ length: 8 }, () => ({
  name: 'Full name',
  logo: { src: 'partners/placeholder.svg' },
  url: 'https://gdg.community.dev/gdg-wroclaw/',
}));
