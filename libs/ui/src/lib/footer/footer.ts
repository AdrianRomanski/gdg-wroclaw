import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NavButton } from '@gdg-wroclaw/design-system-components';
import { GdgLogo } from '../gdg-logo/gdg-logo';
import type { NavLink } from '../navbar/nav-link';
import type { SocialLink } from '../person/person';
import { SocialLinks } from '../social-links/social-links';

/**
 * Footer from the Figma **Landing Page** (`Footer / 4 /`, 143:3117), see ADR-0020: the GDG logo
 * linking home, the navigation links and the community's social links in one row, then a divider
 * and the legal links.
 *
 * Presentational (ADR-0013): links are plain `href`s from the consumer.
 */
@Component({
  selector: 'gdg-footer',
  imports: [GdgLogo, NavButton, SocialLinks],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  /** Accessible name of the logo's home link. */
  readonly homeLabel = input('Google Developer Groups Wrocław, home');

  readonly homeHref = input('/');

  readonly links = input<readonly NavLink[]>([]);

  /** The community's profiles, e.g. Facebook, Instagram, X, LinkedIn, YouTube. */
  readonly socials = input<readonly SocialLink[]>([]);

  /** Whose profiles the social links are, used in their names ("GDG Wrocław on X"). */
  readonly owner = input('GDG Wrocław');

  /** Privacy Policy, Terms of Service, Cookies Settings. */
  readonly legalLinks = input<readonly NavLink[]>([]);

  readonly navLabel = input('Footer');

  readonly legalLabel = input('Legal');
}
