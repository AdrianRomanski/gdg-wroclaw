import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@gdg-wroclaw/design-system-components';

/** Shown for unknown URLs and unknown workshops. */
@Component({
  selector: 'gdg-not-found-page',
  imports: [Button],
  template: `
    <h1 class="heading">Page not found</h1>
    <p class="text">
      The page you are looking for does not exist or has moved.
    </p>
    <a gdg-button href="/">Go to the home page</a>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--gdg-spacing-24);
      padding: var(--gdg-layout-padding-section-large) var(--gdg-spacing-20);
      background: var(--gdg-color-background-default);
      color: var(--gdg-color-content-default);
      text-align: center;
    }

    .heading {
      margin: 0;
      font: var(--gdg-font-display-1);
    }

    .text {
      margin: 0;
      font: var(--gdg-font-paragraph-6);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
