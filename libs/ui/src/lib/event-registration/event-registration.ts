import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Button } from '@gdg-wroclaw/design-system-components';
import type { EventDetail } from '../event-page/event-detail';

export type EventRegistrationInfo = NonNullable<EventDetail['registration']>;

let nextId = 0;

/**
 * Registration callout from the Figma **Event detail** page (`Registration callout`, 8927:6451),
 * see ADR-0025: on a blue-tinted band, the invitation (heading, date and place, details) and the
 * registration button with a note below it.
 */
@Component({
  selector: 'gdg-event-registration',
  imports: [Button],
  templateUrl: './event-registration.html',
  styleUrl: './event-registration.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventRegistration {
  readonly registration = input.required<EventRegistrationInfo>();

  protected readonly headingId = `gdg-event-registration-${nextId++}`;
}
