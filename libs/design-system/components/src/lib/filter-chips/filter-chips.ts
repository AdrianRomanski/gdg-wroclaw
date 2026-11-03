import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import type { Accent } from '../accent/accent';

/** One chip of a `FilterChips` group. */
export interface FilterChip {
  value: string;
  label: string;
  /**
   * `pill` (default) is the Nav Button look, e.g. "All" or a format; `tag` is the Tag
   * look, e.g. a track.
   */
  appearance?: 'pill' | 'tag';
  /** Dot color of a `tag` chip; none for a neutral tag. */
  accent?: Accent;
}

/**
 * Filter chips from the Figma **DevFest** page (`Category filters`, `Format navigation` and
 * `Track browsing`, e.g. 9028:1261), see ADR-0029: a labelled group of toggle buttons
 * (`aria-pressed`) of which one at most is selected. Chips look like the Nav Button (`pill`) or
 * the Tag (`tag`); the selected one gets the Nav Button active background.
 */
@Component({
  selector: 'gdg-filter-chips',
  templateUrl: './filter-chips.html',
  styleUrl: './filter-chips.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    '[attr.aria-label]': 'label()',
  },
})
export class FilterChips {
  readonly chips = input.required<readonly FilterChip[]>();

  /** The selected chip's `value`; two-way bindable. */
  readonly value = model<string>();

  /** Accessible name of the group, e.g. "Tracks". */
  readonly label = input.required<string>();

  /** Pressing the selected chip again clears the selection. */
  readonly allowEmpty = input(false, { transform: booleanAttribute });

  protected toggle(chip: FilterChip): void {
    if (chip.value !== this.value()) {
      this.value.set(chip.value);
    } else if (this.allowEmpty()) {
      this.value.set(undefined);
    }
  }
}
