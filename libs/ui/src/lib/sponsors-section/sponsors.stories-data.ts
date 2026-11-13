import type { Sponsor, SponsorTier } from './sponsor';

const sample = (tier: SponsorTier): Sponsor => ({
  name: 'Full name',
  tier,
  logo: { src: 'partners/placeholder.svg' },
  url: 'https://gdg.community.dev/gdg-wroclaw/',
});

/**
 * Story-only sample sponsors with the Partners placeholder logo (ADR-0019, ADR-0037); this file
 * is not exported from the library.
 */
export const SAMPLE_SPONSORS: Sponsor[] = [
  ...Array.from({ length: 2 }, () => sample('platinum')),
  ...Array.from({ length: 3 }, () => sample('gold')),
  ...Array.from({ length: 4 }, () => sample('silver')),
];
