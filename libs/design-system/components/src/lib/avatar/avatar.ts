import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import type { Accent } from '../accent/accent';

export type AvatarSize = 's' | 'm' | 'l' | 'xl';

/** `circle` crops the photo round (Figma); `square` shows the whole photo with rounded corners (ADR-0034). */
export type AvatarShape = 'circle' | 'square';

/**
 * Avatar from the Figma **DevFest components** page (`Avatar`, 9024:27), see ADR-0028: a
 * person's initials in a raised circle, 40px (`s`), 64px (`m`) or 112px (`l`), and 224px (`xl`,
 * ADR-0033), which shrinks to fit a narrower container. An `accent`
 * draws a 1.5px colored ring instead of the 1px subtle border. A `src` shows the person's photo
 * in the circle instead (ADR-0031); the initials come back if the photo cannot load. `shape="square"`
 * shows the whole photo in a rounded square instead of cropping it round (ADR-0034).
 *
 * Decorative by default (the name is shown next to it); give a `label` when it stands alone.
 */
@Component({
  selector: 'gdg-avatar',
  template: `@if (photo(); as src) {
      <img
        [src]="src"
        alt=""
        [attr.width]="pixels()"
        [attr.height]="pixels()"
        loading="lazy"
        decoding="async"
        (error)="failed.set(true)"
      />
    } @else {
      <ng-container>{{ initials() }}</ng-container>
    }`,
  styleUrl: './avatar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
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

  readonly shape = input<AvatarShape>('circle');

  /** Ring color, e.g. the session track. */
  readonly accent = input<Accent>();

  /** Accessible name, e.g. the person's name. Omit when the name is shown next to it. */
  readonly label = input<string>();

  /** Photo URL, ideally square; cropped to the circle, or shown whole in the `square` shape. */
  readonly src = input<string>();

  /** Set when the photo fails to load, to fall back to the initials. */
  protected readonly failed = signal(false);

  protected readonly photo = computed(() =>
    this.failed() ? undefined : this.src(),
  );

  protected readonly pixels = computed(
    () => ({ s: 40, m: 64, l: 112, xl: 224 })[this.size()],
  );

  constructor() {
    // A new photo gets a new chance to load.
    effect(() => {
      this.src();
      this.failed.set(false);
    });
  }
}
