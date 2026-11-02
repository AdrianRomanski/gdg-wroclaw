import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Section heading from the Figma **DevFest components** page (`Section heading`, 9041:607), see
 * ADR-0028: a centered yellow overline, the `<h2>` and a description, as on the Landing page.
 * Unlike `SectionIntro` (Event detail page) it is centered and the description is not muted.
 */
@Component({
  selector: 'gdg-section-heading',
  templateUrl: './section-heading.html',
  styleUrl: './section-heading.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeading {
  /** E.g. "AGENDA / DEVFEST 2026". */
  readonly overline = input('');

  readonly heading = input.required<string>();

  readonly description = input('');

  /** Id of the `<h2>`, for `aria-labelledby` on the section. */
  readonly headingId = input<string>();
}
