import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { EventCard } from '../event-card/event-card';
import type { GdgEvent } from '../event-card/gdg-event';

/** One date filter and its events. */
export interface EventDay {
  /** As shown on the filter, e.g. "29.06". */
  label: string;
  /** Full date for screen readers, e.g. "29 June 2026". Defaults to `label`. */
  ariaLabel?: string;
  events: readonly GdgEvent[];
}

let nextId = 0;

/**
 * Events section from the Figma **Landing Page** (`Container`, 143:2918), see ADR-0021: a centered
 * title, the days as filter tabs, and the selected day's events as `EventCard`s.
 *
 * The filters follow the WAI-ARIA tabs pattern: one tab stop, arrow keys, Home and End.
 * Presentational (ADR-0013): the schedule comes from the consumer; `dayChange` reports the
 * selected index.
 */
@Component({
  selector: 'gdg-events-section',
  imports: [EventCard],
  templateUrl: './events-section.html',
  styleUrl: './events-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsSection {
  readonly heading = input('Event');

  readonly description = input('');

  readonly days = input.required<readonly EventDay[]>();

  /** Index of the day shown first. */
  readonly initialDay = input(0);

  /** Accessible name of the filter tabs. */
  readonly filtersLabel = input('Event days');

  readonly emptyText = input('No events on this day.');

  readonly readMoreLabel = input('Read more');

  readonly dayChange = output<number>();

  protected readonly selected = linkedSignal(() =>
    Math.min(
      Math.max(this.initialDay(), 0),
      Math.max(this.days().length - 1, 0),
    ),
  );

  protected readonly selectedDay = computed(
    () => this.days()[this.selected()] as EventDay | undefined,
  );

  protected readonly idPrefix = `gdg-events-${nextId++}`;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected select(index: number): void {
    if (index === this.selected()) {
      return;
    }
    this.selected.set(index);
    this.dayChange.emit(index);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.days().length;
    const moves: Record<string, number> = {
      ArrowRight: (this.selected() + 1) % count,
      ArrowLeft: (this.selected() - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const next = moves[event.key];
    if (next === undefined) {
      return;
    }
    event.preventDefault();
    this.select(next);
    this.host.nativeElement
      .querySelector<HTMLElement>(`#${this.idPrefix}-tab-${next}`)
      ?.focus();
  }
}
