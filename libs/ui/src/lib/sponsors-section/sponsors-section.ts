import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  Button,
  type ButtonColor,
} from '@gdg-wroclaw/design-system-components';
import { PartnerCard } from '../partner-card/partner-card';
import { SPONSOR_TIERS, type Sponsor } from './sponsor';

let nextId = 0;

/**
 * Sponsors section of the Landing page, see ADR-0037 (no Figma frame): a centered title, then one
 * group per tier (Platinum, Gold, Silver) of `PartnerCard` tiles, larger for higher tiers, under an
 * uppercase tier label with a pastel red underline, and an optional call to action. Empty tiers
 * are left out. Presentational (ADR-0013).
 */
@Component({
  selector: 'gdg-sponsors-section',
  imports: [Button, PartnerCard],
  templateUrl: './sponsors-section.html',
  styleUrl: './sponsors-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'gdg-sponsors-section' },
})
export class SponsorsSection {
  readonly heading = input('Sponsors');

  readonly description = input('');

  readonly sponsors = input.required<readonly Sponsor[]>();

  /** Call to action below the sponsors, e.g. "Become a sponsor". Hidden when empty. */
  readonly ctaHeading = input('');

  readonly ctaText = input('');

  /** Target of the call to action button. The button is hidden without it. */
  readonly ctaHref = input<string>();

  readonly ctaLabel = input('Contact');

  readonly ctaColor = input<ButtonColor>('red');

  protected readonly idPrefix = `gdg-sponsors-${nextId++}`;

  protected readonly tiers = computed(() =>
    SPONSOR_TIERS.map(({ tier, label }) => ({
      tier,
      label,
      sponsors: this.sponsors().filter((sponsor) => sponsor.tier === tier),
    })).filter((group) => group.sponsors.length > 0),
  );
}
