import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Section introduction from the Figma **Event detail** page (`Section introduction`, e.g.
 * 8927:6098), see ADR-0025: a blue eyebrow, the `<h2>` heading and a muted description,
 * start-aligned.
 */
@Component({
  selector: 'gdg-section-intro',
  templateUrl: './section-intro.html',
  styleUrl: './section-intro.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionIntro {
  readonly eyebrow = input('');

  readonly heading = input.required<string>();

  readonly description = input('');

  /** Id of the `<h2>`, for `aria-labelledby` on the section. */
  readonly headingId = input<string>();
}
