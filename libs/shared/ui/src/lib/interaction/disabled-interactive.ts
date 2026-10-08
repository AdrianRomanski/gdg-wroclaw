import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';

/**
 * Disabled behavior for components applied to native `<a>` or `<button>` (ADR-0009).
 * Used as a host directive: buttons get the native `disabled` attribute; links, which have
 * none, get `aria-disabled="true"`, leave the tab order and swallow clicks.
 */
@Directive({
  host: {
    '[attr.disabled]': "disabled() && isButton ? '' : null",
    '[attr.aria-disabled]': "disabled() && !isButton ? 'true' : null",
    '[attr.tabindex]': 'tabIndex()',
    '(click)': 'onClick($event)',
  },
})
export class DisabledInteractive {
  /** Disables the element. Links get `aria-disabled` and leave the tab order. */
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly isButton =
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
