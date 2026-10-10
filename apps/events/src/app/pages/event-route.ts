import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { EventPage } from '@gdg-wroclaw/ui';
import { EVENTS } from '../content/events';
import { NotFoundPage } from './not-found-page';

/** `/events/:slug`: the Event page template, or Not found for an unknown slug. */
@Component({
  selector: 'gdg-event-route',
  imports: [EventPage, NotFoundPage],
  template: `
    @if (event(); as event) {
      <gdg-event-page [event]="event" />
    } @else {
      <gdg-not-found-page />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventRoute {
  /** Bound from the route parameter (`withComponentInputBinding`). */
  readonly slug = input('');

  protected readonly event = computed(() =>
    Object.hasOwn(EVENTS, this.slug()) ? EVENTS[this.slug()] : undefined,
  );
}
