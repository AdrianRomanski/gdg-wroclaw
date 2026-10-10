import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Button, Icon } from '@gdg-wroclaw/design-system-components';
import type { EventDetail } from '../event-page/event-detail';
import { SectionIntro } from '../section-intro/section-intro';

export type EventVenueInfo = NonNullable<EventDetail['venue']>;

let nextId = 0;

/**
 * Venue section from the Figma **Event detail** page (`Event location`, 8927:6314), see ADR-0025:
 * on a raised band, the venue photo next to the name, address, arrival instructions, access and
 * travel notes and a button (e.g. a map link). Without a photo the details take the full width.
 */
@Component({
  selector: 'gdg-event-venue',
  imports: [Button, Icon, SectionIntro],
  templateUrl: './event-venue.html',
  styleUrl: './event-venue.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventVenue {
  readonly venue = input.required<EventVenueInfo>();

  protected readonly headingId = `gdg-event-venue-${nextId++}`;
}
