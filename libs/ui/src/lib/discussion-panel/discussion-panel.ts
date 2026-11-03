import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Tag } from '@gdg-wroclaw/design-system-components';
import {
  type DevfestPanel,
  TRACK_ACCENTS,
  TRACK_BUTTON_COLORS,
  trackLabel,
} from '../devfest-session/devfest-session';
import { Panelist } from '../panelist/panelist';

let nextId = 0;

/** "Paneliści / 5 osób", with the Polish plural of "osoba". */
export function defaultPanelistsLabel(count: number): string {
  const lastTwo = count % 100;
  const last = count % 10;
  const noun =
    count === 1
      ? 'osoba'
      : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)
        ? 'osoby'
        : 'osób';
  return `Paneliści / ${count} ${noun}`;
}

/**
 * Discussion panel from the Figma **DevFest components** page (`Discussion panel`, 9041:602), see
 * ADR-0028: bordered in the track color, tags for the time, track and room, the title (`<h3>`)
 * after a track rule, the host in a bordered box and the panelists. Narrower than 48rem it
 * switches to the Figma mobile layout: wrapping tags, the host stacked, inline panelists.
 * ADR-0034: the host is as large as a panelist, every photo is shown whole (square), and each
 * person has a bio button. Beside the host: the host tag, the panel description and its topics.
 */
@Component({
  selector: 'gdg-discussion-panel',
  imports: [Panelist, Tag],
  templateUrl: './discussion-panel.html',
  styleUrls: ['../devfest-session/track.css', './discussion-panel.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-track]': 'panel().track',
  },
})
export class DiscussionPanel {
  readonly panel = input.required<DevfestPanel>();

  /** Tag next to the host. */
  readonly hostLabel = input('Prowadzący / Host');

  /** Heading of the topic list beside the host. */
  readonly topicsLabel = input('O czym porozmawiamy');

  /** Heading of the panelist list; defaults to "Paneliści / N osób". */
  readonly panelistsLabel = input<string>();

  protected readonly label = computed(() => trackLabel(this.panel()));

  protected readonly accent = computed(() => TRACK_ACCENTS[this.panel().track]);

  protected readonly listLabel = computed(
    () =>
      this.panelistsLabel() ??
      defaultPanelistsLabel(this.panel().panelists.length),
  );

  protected readonly buttonColor = computed(
    () => TRACK_BUTTON_COLORS[this.panel().track],
  );

  /** Panelist columns on desktop; the host takes the width of one. */
  protected readonly columns = computed(() =>
    Math.max(1, this.panel().panelists.length),
  );

  protected readonly listLabelId = `gdg-discussion-panel-list-${nextId}`;

  protected readonly topicsLabelId = `gdg-discussion-panel-topics-${nextId++}`;
}
