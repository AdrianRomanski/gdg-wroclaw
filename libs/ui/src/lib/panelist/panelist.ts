import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { type Accent, Avatar } from '@gdg-wroclaw/design-system-components';
import {
  personInitials,
  type SessionPerson,
} from '../devfest-session/devfest-session';

export type PanelistLayout = 'stacked' | 'inline';

/**
 * Panelist from the Figma **DevFest components** page (`Panelist`, 9041:272), see ADR-0028: an
 * S avatar and the name, `stacked` (desktop panel) or `inline` (mobile panel).
 */
@Component({
  selector: 'gdg-panelist',
  imports: [Avatar],
  template: `<gdg-avatar
      [initials]="initials()"
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

  /** Avatar ring, e.g. the panel's track. */
  readonly accent = input<Accent>();

  protected readonly initials = computed(() => personInitials(this.person()));
}
