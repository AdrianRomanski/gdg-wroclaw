import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { DisabledInteractive } from '../interaction/disabled-interactive';

/**
 * Navigation item from the Figma **Button / Nav Button** page (node 143:2869).
 *
 * Applied to a native `<a>` (navigation) or `<button>` (in-page action), so links keep their
 * semantics and work with `routerLink`. With the router, prefer
 * `routerLinkActive ariaCurrentWhenActive="page"` over the `active` input; both style the
 * current page through `aria-current`.
 */
@Component({
  selector: 'a[gdg-nav-button], button[gdg-nav-button]',
  templateUrl: './nav-button.html',
  styleUrl: './nav-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: DisabledInteractive, inputs: ['disabled'] }],
  host: {
    class: 'gdg-nav-button',
    '[attr.aria-current]': "active() ? 'page' : null",
  },
})
export class NavButton {
  /** Marks the item as the current page (`aria-current="page"`). */
  readonly active = input(false, { transform: booleanAttribute });
}
