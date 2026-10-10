import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The GDG logo from the Figma Landing Page (Navbar `Group` 143:2901, Footer 143:3121), see
 * ADR-0020: four rounded bars in the Google colors, 68.8 × 40.
 *
 * Decorative by default, for use next to the "Google Developer Groups" wordmark or inside a link
 * that is already named. Set `label` when the logo stands alone.
 */
@Component({
  selector: 'gdg-logo',
  templateUrl: './gdg-logo.html',
  styleUrl: './gdg-logo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': "label() ? 'img' : null",
    '[attr.aria-label]': 'label() || null',
    '[style.--gdg-logo-height]': "height() / 16 + 'rem'",
  },
})
export class GdgLogo {
  /** Accessible name; leave empty when the logo is decorative. */
  readonly label = input('');

  /** Height in px; the width follows the 68.8 : 40 ratio. */
  readonly height = input(40);
}
