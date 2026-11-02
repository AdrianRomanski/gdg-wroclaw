import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import {
  FilterChips,
  type FilterChip,
  SegmentedControl,
  type SegmentedOption,
} from '@gdg-wroclaw/design-system-components';
import type { DevfestSpeakersContent } from '../devfest-page/devfest-content';
import {
  FILTER_TRACKS,
  type Track,
  TRACK_ACCENTS,
  trackLabel,
} from '../devfest-session/devfest-session';
import { DevfestNote } from '../devfest-note/devfest-note';
import { KeynoteCard } from '../keynote-card/keynote-card';
import { SectionHeading } from '../section-heading/section-heading';
import { SpeakerCard } from '../speaker-card/speaker-card';

const ALL = 'all';

const CHIP_ORDER: readonly Track[] = [...FILTER_TRACKS, 'generic'];

let nextId = 0;

/**
 * Speaker directory from the Figma **DevFest** page (`Speaker directory`, 9044:2755), see
 * ADR-0029: the heading, the Role navigation (everyone, or one group), the track chips, then each
 * group: the keynote card, or a section heading over a grid of Speaker cards, or a note while the
 * group is still empty. With a track, only that track's people stay and empty groups go.
 */
@Component({
  selector: 'gdg-devfest-speakers',
  imports: [
    DevfestNote,
    FilterChips,
    KeynoteCard,
    SectionHeading,
    SegmentedControl,
    SpeakerCard,
  ],
  templateUrl: './devfest-speakers.html',
  styleUrl: './devfest-speakers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevfestSpeakers {
  readonly content = input.required<DevfestSpeakersContent>();

  readonly roleGroupLabel = input('Pokaż');

  /** Label before the track chips. */
  readonly tracksLabel = input('Ścieżki');

  protected readonly role = signal(ALL);

  protected readonly track = signal<Track | undefined>(undefined);

  protected readonly roleOptions = computed<SegmentedOption[]>(() => {
    const { allLabel, groups } = this.content();
    const count = groups.reduce(
      (sum, g) => sum + (g.speakers?.length ?? 0) + (g.keynote ? 1 : 0),
      0,
    );
    return [
      { value: ALL, label: `${allLabel} (${count})` },
      ...groups.map((g) => ({ value: g.id, label: g.label })),
    ];
  });

  /** One chip per track of the listed people, in the order of `FILTER_TRACKS`, Generic last. */
  protected readonly trackChips = computed<FilterChip[]>(() => {
    const labels = new Map<Track, string>();
    for (const group of this.content().groups) {
      for (const speaker of group.speakers ?? []) {
        if (!labels.has(speaker.track)) {
          labels.set(speaker.track, trackLabel(speaker));
        }
      }
    }
    return CHIP_ORDER.filter((track) => labels.has(track)).map((track) => ({
      value: track,
      label: labels.get(track) ?? '',
      appearance: 'tag' as const,
      accent: TRACK_ACCENTS[track],
    }));
  });

  protected readonly visibleGroups = computed(() => {
    const role = this.role();
    const track = this.track();
    return this.content()
      .groups.filter((g) => role === ALL || g.id === role)
      .map((group) => ({
        group,
        speakers: (group.speakers ?? []).filter(
          (s) => !track || s.track === track,
        ),
      }))
      .filter(
        ({ group, speakers }) =>
          group.keynote ||
          speakers.length ||
          (group.emptyNote && !group.speakers?.length),
      );
  });

  protected readonly idPrefix = `gdg-devfest-speakers-${nextId++}`;

  protected selectRole(value: string | undefined): void {
    this.role.set(value ?? ALL);
  }

  protected selectTrack(value: string | undefined): void {
    this.track.set(value as Track | undefined);
  }
}
