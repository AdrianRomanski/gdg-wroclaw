import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Avatar, Tag } from '@gdg-wroclaw/design-system-components';
import {
  type DevfestKeynote,
  personInitials,
  TRACK_ACCENTS,
  TRACK_LABELS,
} from '../devfest-session/devfest-session';
import { PersonBio } from '../person-bio/person-bio';

/**
 * Keynote card from the Figma **DevFest components** page (`Keynote card`, 9040:511), see
 * ADR-0028: on brand blue, neutral tags for the time, the session type and the room, then the
 * title (`<h3>`), the abstract and the speaker. ADR-0034: the speaker's whole photo at the
 * panelists' XL size, and a bio button. ADR-0035: a keynote on a track takes the track color
 * (Robotics off-white, AI red; the others stay brand blue) and a track tag after the type.
 */
@Component({
  selector: 'gdg-keynote-card',
  imports: [Avatar, PersonBio, Tag],
  templateUrl: './keynote-card.html',
  styleUrl: './keynote-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-track]': 'keynote().track ?? null',
  },
})
export class KeynoteCard {
  readonly keynote = input.required<DevfestKeynote>();

  /** Session type tag. */
  readonly typeLabel = input('Keynote');

  protected readonly label = computed(() => {
    const { track, trackLabel } = this.keynote();
    return trackLabel ?? (track ? TRACK_LABELS[track] : '');
  });

  protected readonly accent = computed(() => {
    const track = this.keynote().track;
    return track ? TRACK_ACCENTS[track] : undefined;
  });

  protected readonly speakerInitials = computed(() => {
    const speaker = this.keynote().speaker;
    return speaker ? personInitials(speaker) : '';
  });
}
