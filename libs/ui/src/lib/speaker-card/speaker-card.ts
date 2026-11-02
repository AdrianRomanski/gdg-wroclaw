import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { Avatar, Button, Tag } from '@gdg-wroclaw/design-system-components';
import {
  type DevfestSpeaker,
  personInitials,
  TRACK_ACCENTS,
  TRACK_BUTTON_COLORS,
  trackLabel,
} from '../devfest-session/devfest-session';

let nextId = 0;

/**
 * Speaker card from the Figma **DevFest components** page (`Speaker card`, 9040:373), see
 * ADR-0028: an M avatar ringed in the track color with the track tag beside it, then the name
 * (`<h3>`), the role and the talk title. A bio, when given, sits behind a disclosure button in the
 * style of the Presentation card abstract (ADR-0030).
 */
@Component({
  selector: 'gdg-speaker-card',
  imports: [Avatar, Button, Tag],
  templateUrl: './speaker-card.html',
  styleUrl: './speaker-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeakerCard {
  readonly speaker = input.required<DevfestSpeaker>();

  /** Whether the bio is shown; two-way bindable. */
  readonly expanded = model(false);

  readonly expandLabel = input('Pokaż bio');

  readonly collapseLabel = input('Ukryj bio');

  protected readonly buttonColor = computed(
    () => TRACK_BUTTON_COLORS[this.speaker().track],
  );

  protected readonly nameId = `gdg-speaker-card-name-${nextId}`;

  protected readonly bioId = `gdg-speaker-card-bio-${nextId++}`;

  protected readonly label = computed(() => trackLabel(this.speaker()));

  protected readonly accent = computed(
    () => TRACK_ACCENTS[this.speaker().track],
  );

  protected readonly initials = computed(() => personInitials(this.speaker()));

  protected readonly roles = computed(() => {
    const role = this.speaker().role;
    return typeof role === 'string' ? [role] : (role ?? []);
  });

  protected toggle(): void {
    this.expanded.update((expanded) => !expanded);
  }
}
