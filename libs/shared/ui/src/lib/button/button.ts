import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  inject,
  input,
  isDevMode,
} from '@angular/core';
import { Icon } from '../icon/icon';
import { DisabledInteractive } from '../interaction/disabled-interactive';

export type ButtonColor = 'blue' | 'green' | 'yellow' | 'red';
export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'l' | 'm';

/**
 * Button from the Figma **Button / Nav Button** page (component set 143:2772), see ADR-0011.
 *
 * Applied to a native `<button>` (actions) or `<a>` (navigation). A projected `<gdg-icon>` is
 * always placed after the label. For an icon-only button, set `iconOnly` and give the
 * element an `aria-label`. `type` is left to the native default (`submit` inside forms).
 */
@Component({
  selector: 'button[gdg-button], a[gdg-button]',
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: DisabledInteractive, inputs: ['disabled'] }],
  host: {
    '[class]': 'hostClass()',
  },
})
export class Button {
  /** Brand color (Figma `Color`). */
  readonly color = input<ButtonColor>('blue');

  /** Filled (`primary`) or outlined (`secondary`), Figma `Variant`. */
  readonly variant = input<ButtonVariant>('primary');

  /** `l` is 48px tall, `m` is 40px (Figma `Size`). */
  readonly size = input<ButtonSize>('l');

  /** Square button with only an icon (Figma `Property=ikon`). Needs an `aria-label`. */
  readonly iconOnly = input(false, { transform: booleanAttribute });

  private readonly icon = contentChild(Icon);

  protected readonly hostClass = computed(() =>
    [
      'gdg-button',
      `gdg-button--${this.variant()}`,
      `gdg-button--${this.color()}`,
      `gdg-button--${this.size()}`,
      this.icon() && !this.iconOnly() ? 'gdg-button--with-icon' : '',
      this.iconOnly() ? 'gdg-button--icon-only' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  constructor() {
    if (isDevMode()) {
      const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
      afterNextRender(() => {
        if (
          this.iconOnly() &&
          !host.hasAttribute('aria-label') &&
          !host.hasAttribute('aria-labelledby')
        ) {
          console.warn(
            '[gdg-button] Icon-only buttons need an aria-label or aria-labelledby.',
            host,
          );
        }
      });
    }
  }
}
