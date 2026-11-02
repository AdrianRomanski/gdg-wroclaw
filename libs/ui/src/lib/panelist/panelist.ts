import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  type Accent,
  Avatar,
  type AvatarSize,
} from '@gdg-wroclaw/design-system-components';
import {
  personInitials,
  type SessionPerson,
} from '../devfest-session/devfest-session';

export type PanelistLayout = 'stacked' | 'inline';

/**
 * Panelist from the Figma **DevFest components** page (`Panelist`, 9041:272), see ADR-0028: an
 * avatar (S in Figma; any Avatar size, see ADR-0032) and the name, `stacked` (desktop panel) or
 * `inline` (mobile panel).
 */
@Component({
  selector: 'gdg-panelist',
  imports: [Avatar],
  template: `<gdg-avatar
      [initials]="initials()"
      [size]="size()"
      [accent]="accent()"
      [src]="person().photo"
    /><span class="name">{{ person().name }}</span>`,
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

  /** Avatar ring, e.g. the panel's track. */
  readonly accent = input<Accent>();

  protected readonly initials = computed(() => personInitials(this.person()));
}
