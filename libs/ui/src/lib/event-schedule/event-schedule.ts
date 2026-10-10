import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type {
  EventSectionIntro,
  EventSession,
} from '../event-page/event-detail';
import { SectionIntro } from '../section-intro/section-intro';

let nextId = 0;

/**
 * Schedule section from the Figma **Event detail** page (`Event schedule`, 8927:6232), see
 * ADR-0025: the introduction, a timezone pill and a note on the left; the agenda on the right,
 * one row per session (start and length, title and details, type label).
 */
@Component({
  selector: 'gdg-event-schedule',
  imports: [SectionIntro],
  templateUrl: './event-schedule.html',
  styleUrl: './event-schedule.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSchedule {
  readonly intro = input.required<EventSectionIntro>();

  readonly sessions = input.required<readonly EventSession[]>();

  readonly timezoneNote = input('');

  readonly note = input('');

  protected readonly headingId = `gdg-event-schedule-${nextId++}`;
}
