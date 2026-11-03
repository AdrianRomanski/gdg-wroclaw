import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from '@angular/core';
import {
  FilterChips,
  type FilterChip,
  SegmentedControl,
  type SegmentedOption,
} from '@gdg-wroclaw/design-system-components';
import type { DevfestAgendaContent } from '../devfest-page/devfest-content';
import {
  FILTER_TRACKS,
  type Track,
  TRACK_ACCENTS,
  TRACK_LABELS,
} from '../devfest-session/devfest-session';
import { DevfestNote } from '../devfest-note/devfest-note';
import { MainStageTimeline } from '../main-stage-timeline/main-stage-timeline';
import { ParallelSchedule } from '../parallel-schedule/parallel-schedule';
import { SectionHeading } from '../section-heading/section-heading';

/** The agenda days: day 1 on the main stage, day 2 in parallel rooms. */
export type DevfestDay = 'main-stage' | 'parallel';

const ALL = 'all';

let nextId = 0;

/**
 * DevFest agenda from the Figma **DevFest** page (`Agenda`, 9043:2054 and 9028:1245), see
 * ADR-0029: the section heading, the Day toggle, on day 2 the Format navigation (talks or
 * workshops), the track filter, then the main stage timeline (day 1) or the parallel-rooms
 * schedule (day 2).
 */
@Component({
  selector: 'gdg-devfest-agenda',
  imports: [
    DevfestNote,
    FilterChips,
    MainStageTimeline,
    ParallelSchedule,
    SectionHeading,
    SegmentedControl,
  ],
  templateUrl: './devfest-agenda.html',
  styleUrl: './devfest-agenda.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevfestAgenda {
  readonly agenda = input.required<DevfestAgendaContent>();

  /** The day shown; two-way bindable. */
  readonly day = model<DevfestDay>('main-stage');

  /** "All" chip of the track filter. */
  readonly allLabel = input('All');

  readonly dayGroupLabel = input('Day');

  readonly formatGroupLabel = input('Format');

  readonly trackGroupLabel = input('Track');

  protected readonly format = signal<'talks' | 'workshops'>('talks');

  protected readonly trackValue = signal(ALL);

  protected readonly track = computed(() =>
    this.trackValue() === ALL ? undefined : (this.trackValue() as Track),
  );

  protected readonly dayOptions = computed<SegmentedOption[]>(() => [
    { value: 'main-stage', label: this.agenda().mainStage.label },
    { value: 'parallel', label: this.agenda().parallel.label },
  ]);

  protected readonly formatChips = computed<FilterChip[]>(() => {
    const day = this.agenda().parallel;
    return day.workshopsLabel
      ? [
          { value: 'talks', label: day.talksLabel },
          { value: 'workshops', label: day.workshopsLabel },
        ]
      : [];
  });

  protected readonly trackChips = computed<FilterChip[]>(() => [
    { value: ALL, label: this.allLabel() },
    ...FILTER_TRACKS.map((track) => ({
      value: track,
      label: TRACK_LABELS[track],
      appearance: 'tag' as const,
      accent: TRACK_ACCENTS[track],
    })),
  ]);

  protected readonly description = computed(() =>
    this.day() === 'main-stage'
      ? this.agenda().mainStage.description
      : this.agenda().parallel.description,
  );

  protected readonly headingId = `gdg-devfest-agenda-heading-${nextId++}`;

  protected selectDay(value: string | undefined): void {
    this.day.set(value === 'parallel' ? 'parallel' : 'main-stage');
  }

  protected selectFormat(value: string | undefined): void {
    this.format.set(value === 'workshops' ? 'workshops' : 'talks');
  }

  protected selectTrack(value: string | undefined): void {
    this.trackValue.set(value ?? ALL);
  }
}
