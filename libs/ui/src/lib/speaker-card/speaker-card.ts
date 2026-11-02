import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Avatar, Tag } from '@gdg-wroclaw/design-system-components';
import {
  type DevfestSpeaker,
  personInitials,
  TRACK_ACCENTS,
  trackLabel,
} from '../devfest-session/devfest-session';

/**
 * Speaker card from the Figma **DevFest components** page (`Speaker card`, 9040:373), see
 * ADR-0028: an M avatar ringed in the track color with the track tag beside it, then the name
 * (`<h3>`), the role and the talk title.
 */
@Component({
  selector: 'gdg-speaker-card',
  imports: [Avatar, Tag],
  templateUrl: './speaker-card.html',
  styleUrl: './speaker-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeakerCard {
  readonly speaker = input.required<DevfestSpeaker>();

  protected readonly label = computed(() => trackLabel(this.speaker()));

  protected readonly accent = computed(
    () => TRACK_ACCENTS[this.speaker().track],
  );

  protected readonly initials = computed(() => personInitials(this.speaker()));

  protected readonly roles = computed(() => {
    const role = this.speaker().role;
    return typeof role === 'string' ? [role] : (role ?? []);
  });
}
