import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Button } from '@gdg-wroclaw/design-system-components';
import type { GdgEvent } from './gdg-event';

let nextId = 0;

/**
 * Event card from the Figma **Landing Page** (`Card`, 143:2932), see ADR-0021: a divider above,
 * the title with an optional tag ("Sold out"), the start time and location in brand blue, the
 * description, and a "Read more" link at the end.
 */
@Component({
  selector: 'gdg-event-card',
  imports: [Button],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCard {
  readonly event = input.required<GdgEvent>();

  readonly readMoreLabel = input('Read more');

  protected readonly titleId = `gdg-event-card-title-${nextId++}`;
}
