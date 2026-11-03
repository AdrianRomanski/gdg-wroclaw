import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { Avatar, Button, Tag } from '@gdg-wroclaw/design-system-components';
import {
  type DevfestTalk,
  personInitials,
  TRACK_ACCENTS,
  TRACK_BUTTON_COLORS,
  trackLabel,
} from '../devfest-session/devfest-session';

let nextId = 0;

/**
 * Presentation card from the Figma **DevFest components** page (`Presentation card`, 9025:192),
 * see ADR-0028: a talk in the agenda, bordered in its track color. The track tag, time and room,
 * the title, a short description, the speakers, and the abstract behind a disclosure button
 * (Figma `Abstract=Collapsed/Expanded`).
 */
@Component({
  selector: 'gdg-presentation-card',
  imports: [Avatar, Button, Tag],
  templateUrl: './presentation-card.html',
  styleUrls: ['../devfest-session/track.css', './presentation-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-track]': 'talk().track',
  },
})
export class PresentationCard {
  readonly talk = input.required<DevfestTalk>();

  /** Whether the abstract is shown; two-way bindable. */
  readonly expanded = model(false);

  readonly expandLabel = input('Show abstract');

  readonly collapseLabel = input('Hide abstract');

  readonly abstractLabel = input('Abstract');

  protected readonly label = computed(() => trackLabel(this.talk()));

  protected readonly accent = computed(() => TRACK_ACCENTS[this.talk().track]);

  protected readonly buttonColor = computed(
    () => TRACK_BUTTON_COLORS[this.talk().track],
  );

  protected readonly initials = personInitials;

  protected readonly titleId = `gdg-presentation-card-title-${nextId}`;

  protected readonly abstractId = `gdg-presentation-card-abstract-${nextId++}`;

  protected toggle(): void {
    this.expanded.update((expanded) => !expanded);
  }
}
