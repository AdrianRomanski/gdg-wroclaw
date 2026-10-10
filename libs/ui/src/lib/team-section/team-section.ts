import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { Button } from '@gdg-wroclaw/design-system-components';
import { PersonCard, type PersonCardFrame } from '../person-card/person-card';
import type { Person } from '../person/person';

/**
 * Team section from the Figma **Team/Partners** page (`Team / 2 /`, 181:5312 and 181:4620), see
 * ADR-0018: a centered title, the people as `PersonCard`s (four per row on desktop) and an
 * optional call to action below.
 *
 * Presentational (ADR-0013): people and the link target come from the consumer.
 */
@Component({
  selector: 'gdg-team-section',
  imports: [Button, PersonCard],
  templateUrl: './team-section.html',
  styleUrl: './team-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamSection {
  readonly heading = input('Our team');

  readonly description = input('');

  readonly members = input.required<readonly Person[]>();

  /** Photo frame of every card (the page shows both). */
  readonly frame = input<PersonCardFrame>('circle');

  /** Show the role badges (Figma `Badge`). */
  readonly badges = input(true, { transform: booleanAttribute });

  /** Call to action below the cards, e.g. "We're hiring!". Hidden when empty. */
  readonly ctaHeading = input('');

  readonly ctaText = input('');

  /** Target of the call to action button. The button is hidden without it. */
  readonly ctaHref = input<string>();

  readonly ctaLabel = input('Contact us');
}
