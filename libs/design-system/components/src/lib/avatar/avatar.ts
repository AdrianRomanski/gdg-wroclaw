import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Accent } from '../accent/accent';

export type AvatarSize = 's' | 'm' | 'l';

/**
 * Avatar from the Figma **DevFest components** page (`Avatar`, 9024:27), see ADR-0028: a
 * person's initials in a raised circle, 40px (`s`), 64px (`m`) or 112px (`l`). An `accent`
 * draws a 1.5px colored ring instead of the 1px subtle border.
 *
 * Decorative by default (the name is shown next to it); give a `label` when it stands alone.
 */
@Component({
  selector: 'gdg-avatar',
  template: '{{ initials() }}',
  styleUrl: './avatar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-accent]': 'accent() ?? null',
    '[attr.role]': "label() ? 'img' : null",
    '[attr.aria-label]': 'label() ?? null',
    '[attr.aria-hidden]': "label() ? null : 'true'",
  },
})
export class Avatar {
  /** Up to two letters (Figma `Initials`). */
  readonly initials = input.required<string>();

  readonly size = input<AvatarSize>('s');

  /** Ring color, e.g. the session track. */
  readonly accent = input<Accent>();

  /** Accessible name, e.g. the person's name. Omit when the name is shown next to it. */
  readonly label = input<string>();
}
