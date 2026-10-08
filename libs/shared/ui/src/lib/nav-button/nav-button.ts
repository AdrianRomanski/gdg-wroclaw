import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
} from '@angular/core';

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
  host: {
    class: 'gdg-nav-button',
    '[attr.aria-current]': "active() ? 'page' : null",
    '[attr.disabled]': "disabled() && isButton ? '' : null",
    '[attr.aria-disabled]': "disabled() && !isButton ? 'true' : null",
    '[attr.tabindex]': 'tabIndex()',
    '(click)': 'onClick($event)',
  },
})
export class NavButton {
  /** Marks the item as the current page (`aria-current="page"`). */
  readonly active = input(false, { transform: booleanAttribute });

  /** Disables the item. Links get `aria-disabled` and leave the tab order. */
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isButton =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName ===
    'BUTTON';

  protected readonly tabIndex = computed(() =>
    this.disabled() && !this.isButton ? -1 : null,
  );

  protected onClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
