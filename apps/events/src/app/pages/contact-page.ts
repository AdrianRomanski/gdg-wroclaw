import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from '@angular/core';
import { ContactForm } from '@gdg-wroclaw/ui';
import { TERMS_URL } from '../content/site';

/**
 * `/contact`: the Contact form. Sending is not wired up yet (it arrives with the Firebase
 * backend, ADR-0023), so a submitted form shows a notice instead.
 */
@Component({
  selector: 'gdg-contact-page',
  imports: [ContactForm],
  template: `
    <h1 class="visually-hidden">Contact GDG Wrocław</h1>
    <gdg-contact-form [termsUrl]="termsUrl" (submitted)="onSubmitted()" />
    @if (notice()) {
      <p class="notice" role="status">{{ notice() }}</p>
    }
  `,
  styles: `
    :host {
      display: block;
      background: var(--gdg-color-background-default);
      color: var(--gdg-color-content-default);
    }

    .notice {
      max-inline-size: var(--gdg-layout-max-width-medium);
      margin: 0 auto;
      padding: 0 var(--gdg-spacing-20) var(--gdg-layout-padding-section-large);
      font: var(--gdg-font-paragraph-7);
      text-align: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage {
  protected readonly termsUrl = TERMS_URL;

  protected readonly notice = signal('');

  private readonly form = viewChild.required(ContactForm);

  protected onSubmitted(): void {
    this.notice.set(
      'Thanks! Sending messages from the website is not available yet. Please reach us through our chapter page.',
    );
    this.form().reset();
  }
}
