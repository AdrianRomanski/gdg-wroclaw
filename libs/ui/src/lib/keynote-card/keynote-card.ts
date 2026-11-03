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
} from '../devfest-session/devfest-session';
import { PersonBio } from '../person-bio/person-bio';

/**
 * Keynote card from the Figma **DevFest components** page (`Keynote card`, 9040:511), see
 * ADR-0028: on brand blue, neutral tags for the time, the session type and the room, then the
 * title (`<h3>`), the abstract and the speaker. ADR-0034: the speaker's whole photo at the
 * panelists' XL size, and a bio button.
 */
@Component({
  selector: 'gdg-keynote-card',
  imports: [Avatar, PersonBio, Tag],
  templateUrl: './keynote-card.html',
  styleUrl: './keynote-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeynoteCard {
  readonly keynote = input.required<DevfestKeynote>();

  /** Session type tag. */
  readonly typeLabel = input('Keynote');

  protected readonly speakerInitials = computed(() => {
    const speaker = this.keynote().speaker;
    return speaker ? personInitials(speaker) : '';
  });
}
