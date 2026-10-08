import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICON_VIEW_BOX, icons, type IconName } from './generated/icons';

export type { IconName } from './generated/icons';

/**
 * Phosphor icon (regular weight) from the generated registry (see ADR-0011).
 *
 * Icons take the current text color. They are decorative (`aria-hidden`) unless a
 * `label` is given. Add new icons to `icons.json` and run `nx run design-system-components:generate-icons`.
 */
@Component({
  selector: 'gdg-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--gdg-icon-size]': "size() / 16 + 'rem'",
    '[attr.role]': "label() ? 'img' : null",
    '[attr.aria-label]': 'label() ?? null',
    '[attr.aria-hidden]': "label() ? null : 'true'",
  },
})
export class Icon {
  /** Icon name from the registry, e.g. `caret-right`. */
  readonly name = input.required<IconName>();

  /** Size in px (Figma icons are 24px). */
  readonly size = input(24);

  /** Accessible name. Omit for decorative icons next to visible text. */
  readonly label = input<string>();

  protected readonly viewBox = ICON_VIEW_BOX;

  private readonly sanitizer = inject(DomSanitizer);

  // Safe: markup comes from the build-time registry, never from user input.
  protected readonly markup = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(icons[this.name()]),
  );
}
