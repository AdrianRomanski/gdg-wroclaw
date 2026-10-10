import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { Button, Icon, NavButton } from '@gdg-wroclaw/design-system-components';
import { GdgLogo } from '../gdg-logo/gdg-logo';
import type { NavAction, NavLink } from './nav-link';

let nextId = 0;

/**
 * Navbar from the Figma **Landing Page** (`Container`, 143:2899), see ADR-0020: the GDG logo and
 * wordmark linking home, the navigation links as `NavButton`s and the call-to-action buttons.
 *
 * Below 64rem the links and actions move into a disclosure menu opened by a menu button (not in
 * Figma). Presentational (ADR-0013): links are plain `href`s from the consumer.
 */
@Component({
  selector: 'gdg-navbar',
  imports: [Button, GdgLogo, Icon, NavButton],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.gdg-navbar--open]': 'menuOpen()',
    '(keydown.escape)': 'closeMenu()',
  },
})
export class Navbar {
  /** Wordmark next to the logo; also the home link's accessible name. */
  readonly brand = input('Google Developer Groups');

  readonly homeHref = input('/');

  readonly links = input<readonly NavLink[]>([]);

  readonly actions = input<readonly NavAction[]>([]);

  /** Accessible name of the navigation landmark. */
  readonly navLabel = input('Main');

  readonly menuLabel = input('Menu');

  protected readonly menuOpen = signal(false);

  protected readonly menuId = `gdg-navbar-menu-${nextId++}`;

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
