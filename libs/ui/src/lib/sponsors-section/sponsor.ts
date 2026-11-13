import type { Partner } from '../partner-card/partner';

export type SponsorTier = 'platinum' | 'gold' | 'silver';

/** A sponsor on the Landing page (ADR-0037): a partner with a tier. */
export interface Sponsor extends Partner {
  tier: SponsorTier;
}

/** Tiers in display order, highest first, with their visible labels. */
export const SPONSOR_TIERS: readonly { tier: SponsorTier; label: string }[] = [
  { tier: 'platinum', label: 'Platinum' },
  { tier: 'gold', label: 'Gold' },
  { tier: 'silver', label: 'Silver' },
];
