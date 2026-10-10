import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import type { Partner } from './partner';

/** `tile` is Figma `Property 1=Partner`, `card` is `Property 1=Card`. */
export type PartnerCardVariant = 'tile' | 'card';

/**
 * Partner card from the Figma **Team/Partners** page (`Partners` component set 181:8588), see
 * ADR-0019: a square logo with the partner name below it.
 *
 * - `tile`: rounded logo tile with a centered name (the Partners grid).
 * - `card`: square logo with a start-aligned name (the Partners carousel).
 *
 * With a `url`, the whole card is a link to the partner's website.
 */
@Component({
  selector: 'gdg-partner-card',
  imports: [NgTemplateOutlet],
  templateUrl: './partner-card.html',
  styleUrl: './partner-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': "'gdg-partner-card gdg-partner-card--' + variant()",
  },
})
export class PartnerCard {
  readonly partner = input.required<Partner>();

  readonly variant = input<PartnerCardVariant>('tile');

  /** Shown in place of a missing logo. */
  protected readonly placeholder = computed(() =>
    this.partner().name.trim().charAt(0).toUpperCase(),
  );
}
