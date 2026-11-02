import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  type DevfestStageSession,
  type Track,
} from '../devfest-session/devfest-session';
import { DiscussionPanel } from '../discussion-panel/discussion-panel';
import { KeynoteCard } from '../keynote-card/keynote-card';
import { TimeMarker } from '../time-marker/time-marker';

/**
 * Main stage timeline from the Figma **DevFest** page (`Main stage timeline`, 9043:2083), see
 * ADR-0029: day 1 as a list of keynotes and discussion panels, each behind a time marker. With a
 * `track`, only the panels of that track stay; keynotes belong to every track. Narrower than
 * 48rem the time sits above the card (Figma `Day 1 mobile`).
 */
@Component({
  selector: 'gdg-main-stage-timeline',
  imports: [DiscussionPanel, KeynoteCard, TimeMarker],
  templateUrl: './main-stage-timeline.html',
  styleUrl: './main-stage-timeline.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainStageTimeline {
  readonly sessions = input.required<readonly DevfestStageSession[]>();

  /** Shows only this track's panels; none shows everything. */
  readonly track = input<Track>();

  protected readonly visible = computed(() => {
    const track = this.track();
    return this.sessions()
      .filter((s) => !track || !('panel' in s) || s.panel.track === track)
      .map((s) => {
        const keynote = 'keynote' in s ? s.keynote : undefined;
        const panel = 'panel' in s ? s.panel : undefined;
        return {
          session: s,
          keynote,
          panel,
          at: 'keynote' in s ? s.keynote : s.panel,
        };
      });
  });
}
