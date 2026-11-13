import type { Sponsor, SponsorTier } from '@gdg-wroclaw/ui';

const sponsor = (
  name: string,
  tier: SponsorTier,
  url: string,
  logo: string,
): Sponsor => ({
  name,
  tier,
  url,
  logo: { src: logo },
});

export const SPONSORS: readonly Sponsor[] = [
  sponsor(
    'PushBased',
    'platinum',
    'https://push-based.io/',
    '/sponsors/pushbased.webp',
  ),
  sponsor(
    'Wroclaw University of Economics',
    'platinum',
    'https://uew.pl/',
    '/sponsors/uew.webp',
  ),
  sponsor(
    'Synergy Codes',
    'gold',
    'https://www.synergycodes.com/',
    '/sponsors/synergycodes.webp',
  ),
];
