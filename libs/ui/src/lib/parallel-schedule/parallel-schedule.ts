import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import {
  SegmentedControl,
  type SegmentedOption,
} from '@gdg-wroclaw/design-system-components';
import type {
  DevfestParallelEntry,
  DevfestScheduleItem,
  DevfestSessionSlot,
  DevfestTalk,
  Track,
} from '../devfest-session/devfest-session';
import { PresentationCard } from '../presentation-card/presentation-card';
import { ScheduleEvent } from '../schedule-event/schedule-event';
import { TimeMarker } from '../time-marker/time-marker';

/** A row as rendered: an event for all rooms, or a slot with one cell per room. */
interface ScheduleRow {
  entry: DevfestParallelEntry;
  event?: DevfestScheduleItem;
  slot?: DevfestSessionSlot;
  /** One per room: the talk, or `null` for an empty or filtered-out room. */
  cells: readonly (DevfestTalk | null)[];
}

/**
 * Parallel-rooms schedule from the Figma **DevFest** page (`Schedule`, 9029:1260), see ADR-0029:
 * day 2 with a column per room under its header, a time marker per row of talks, and the opening
 * and breaks across all rooms. With a `track`, only that track's talks stay and empty rows go.
 *
 * Narrower than 48rem (Figma `Day 2 mobile`, 9042:1715) the room headers become a Room toggle
 * that shows one room at a time, the time sits above the talks, and a grouped block shows its two
 * time ranges in a yellow box.
 */
@Component({
  selector: 'gdg-parallel-schedule',
  imports: [PresentationCard, ScheduleEvent, SegmentedControl, TimeMarker],
  templateUrl: './parallel-schedule.html',
  styleUrl: './parallel-schedule.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--_rooms]': 'rooms().length',
  },
})
export class ParallelSchedule {
  /** Column headers, e.g. ["Room A", "Room B"]. */
  readonly rooms = input.required<readonly string[]>();

  readonly entries = input.required<readonly DevfestParallelEntry[]>();

  /** Shows only this track's talks; none shows everything. */
  readonly track = input<Track>();

  /** Index of the room shown on narrow screens; two-way bindable. */
  readonly room = model(0);

  /** Accessible name of the Room toggle. */
  readonly roomLabel = input('Room');

  protected readonly roomOptions = computed<SegmentedOption[]>(() =>
    this.rooms().map((label, i) => ({ value: String(i), label })),
  );

  protected readonly visible = computed<ScheduleRow[]>(() => {
    const track = this.track();
    const matches = (talk: DevfestTalk | null): talk is DevfestTalk =>
      !!talk && (!track || talk.track === track);
    return this.entries().flatMap((entry): ScheduleRow[] => {
      if (entry.type !== 'slot') {
        return [{ entry, event: entry, cells: [] }];
      }
      const cells = this.rooms().map((_, i) => {
        const talk = entry.talks[i] ?? null;
        return matches(talk) ? talk : null;
      });
      return cells.some(Boolean) ? [{ entry, slot: entry, cells }] : [];
    });
  });

  protected selectRoom(value: string | undefined): void {
    this.room.set(Number(value ?? 0));
  }
}
