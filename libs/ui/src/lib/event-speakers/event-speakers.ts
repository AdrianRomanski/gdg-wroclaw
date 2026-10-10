import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { EventSectionIntro, EventTalk } from '../event-page/event-detail';
import { PersonCard } from '../person-card/person-card';
import { SectionIntro } from '../section-intro/section-intro';

let nextId = 0;

/**
 * Speakers section from the Figma **Event detail** page (`Speakers and talks`, 8927:6097), see
 * ADR-0025: the section introduction, then each speaker as a `PersonCard` above a card with their
 * talk (topic, time, title, description), two per row.
 */
@Component({
  selector: 'gdg-event-speakers',
  imports: [PersonCard, SectionIntro],
  templateUrl: './event-speakers.html',
  styleUrl: './event-speakers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSpeakers {
  readonly intro = input.required<EventSectionIntro>();

  readonly talks = input.required<readonly EventTalk[]>();

  protected readonly headingId = `gdg-event-speakers-${nextId++}`;
}
