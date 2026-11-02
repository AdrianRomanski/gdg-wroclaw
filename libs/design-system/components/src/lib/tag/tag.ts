import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Accent } from '../accent/accent';

/**
 * Tag from the Figma **DevFest components** page (`Tag`, 9024:20), see ADR-0028: a pill with an
 * optional 8px accent dot and a 12px bold label. Without `accent` it is the neutral tag (rooms,
 * times, session types).
 */
@Component({
  selector: 'gdg-tag',
  template: `@if (accent()) {
      <span class="dot" aria-hidden="true"></span>
    }
    <ng-content />`,
  styleUrl: './tag.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-accent]': 'accent() ?? null',
  },
})
export class Tag {
  /** Color of the dot (Figma `Track`); none for the neutral tag. */
  readonly accent = input<Accent>();
}
