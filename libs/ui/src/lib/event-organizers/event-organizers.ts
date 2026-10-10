import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Button } from '@gdg-wroclaw/design-system-components';
import type { EventDetail } from '../event-page/event-detail';
import { PersonCard } from '../person-card/person-card';
import { SectionIntro } from '../section-intro/section-intro';

export type EventOrganizersInfo = NonNullable<EventDetail['organizers']>;

let nextId = 0;

/**
 * Organizers section from the Figma **Event detail** page (`Event organizers`, 8927:6332), see
 * ADR-0025: the introduction, the event team as `PersonCard`s and a contact block beside them
 * (below them once the cards fill the row).
 */
@Component({
  selector: 'gdg-event-organizers',
  imports: [Button, PersonCard, SectionIntro],
  templateUrl: './event-organizers.html',
  styleUrl: './event-organizers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventOrganizers {
  readonly organizers = input.required<EventOrganizersInfo>();

  protected readonly headingId = `gdg-event-organizers-${nextId++}`;
}
