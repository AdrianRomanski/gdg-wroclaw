import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Footer, Navbar } from '@gdg-wroclaw/ui';
import {
  COMMUNITY_SOCIALS,
  LEGAL_LINKS,
  NAV_ACTIONS,
  NAV_LINKS,
} from './content/site';

/**
 * App shell (ADR-0023): the sticky Navbar, the routed page in `<main>`, and the Footer.
 *
 * The `ui` components render plain `href`s (ADR-0013, ADR-0020). The shell routes clicks on
 * same-origin links through the Angular router, so they navigate without a full page reload.
 */
@Component({
  imports: [Footer, Navbar, RouterOutlet],
  selector: 'gdg-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'routeLink($event)',
  },
})
export class App {
  protected readonly links = NAV_LINKS;
  protected readonly actions = NAV_ACTIONS;
  protected readonly socials = COMMUNITY_SOCIALS;
  protected readonly legalLinks = LEGAL_LINKS;

  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  protected routeLink(event: MouseEvent): void {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const anchor = (event.target as Element | null)?.closest('a[href]');
    if (
      !(anchor instanceof HTMLAnchorElement) ||
      (anchor.target && anchor.target !== '_self') ||
      anchor.hasAttribute('download')
    ) {
      return;
    }
    // "#id" links (the skip link) target the current page, not the <base href>.
    const raw = anchor.getAttribute('href') ?? '';
    if (raw.startsWith('#')) {
      event.preventDefault();
      // Focusing the target also scrolls it into view.
      this.document.getElementById(raw.slice(1))?.focus();
      return;
    }
    const url = new URL(anchor.href, this.document.baseURI);
    if (url.origin !== this.document.location.origin) {
      return;
    }
    event.preventDefault();
    this.router.navigateByUrl(url.pathname + url.search + url.hash);
  }
}
