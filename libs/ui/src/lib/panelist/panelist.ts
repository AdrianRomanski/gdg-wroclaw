import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  type Accent,
  Avatar,
  type AvatarShape,
  type AvatarSize,
  type ButtonColor,
} from '@gdg-wroclaw/design-system-components';
import {
  personInitials,
  type SessionPerson,
} from '../devfest-session/devfest-session';
import { PersonBio } from '../person-bio/person-bio';

export type PanelistLayout = 'stacked' | 'inline';

/**
 * Panelist from the Figma **DevFest components** page (`Panelist`, 9041:272), see ADR-0028: an
 * avatar (S in Figma; any Avatar size, see ADR-0032) and the name, `stacked` (desktop panel) or
 * `inline` (mobile panel). With `showBio`, a "Show bio" button under the name opens the bio
 * (ADR-0034).
 */
@Component({
  selector: 'gdg-panelist',
  imports: [Avatar, PersonBio],
  template: `<gdg-avatar
      [initials]="initials()"
      [size]="size()"
      [shape]="shape()"
      [accent]="accent()"
      [src]="person().photo"
    /><span class="name">{{ person().name }}</span>
    @if (showBio()) {
      <gdg-person-bio [person]="person()" [color]="bioColor()" />
    }`,
  styleUrl: './panelist.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-layout]': 'layout()',
  },
})
export class Panelist {
  readonly person = input.required<SessionPerson>();

  readonly layout = input<PanelistLayout>('stacked');

  /** Avatar size; the discussion panel uses XL so faces read at a glance (ADR-0033). */
  readonly size = input<AvatarSize>('s');

  /** `square` shows the whole photo (ADR-0034). */
  readonly shape = input<AvatarShape>('circle');

  /** Avatar ring, e.g. the panel's track. */
  readonly accent = input<Accent>();

  /** Adds the bio button (ADR-0034). */
  readonly showBio = input(false, { transform: booleanAttribute });

  /** Color of the bio button, e.g. the panel's track. */
  readonly bioColor = input<ButtonColor>('blue');

  protected readonly initials = computed(() => personInitials(this.person()));
}
