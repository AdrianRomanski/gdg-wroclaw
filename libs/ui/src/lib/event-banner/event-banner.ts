import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Full-width event banner from the Figma **Workshop Page** (143:5974), see ADR-0017. Shows the
 * image the page passes in, e.g. the event's GDG brand-kit header, cropped to Figma's
 * 1440 × 449 frame.
 */
@Component({
  selector: 'gdg-event-banner',
  templateUrl: './event-banner.html',
  styleUrl: './event-banner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventBanner {
  readonly src = input.required<string>();

  /** Describe the image only if it carries information beyond the page heading. */
  readonly alt = input('');
}
