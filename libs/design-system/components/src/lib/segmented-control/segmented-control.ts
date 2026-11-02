import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  viewChildren,
} from '@angular/core';

export interface SegmentedOption {
  value: string;
  label: string;
}

/**
 * Segmented control from the Figma **DevFest components** page, see ADR-0028: `Toggle`
 * (9037:1840, two options sharing the full width with `fullWidth`) and `Segment` (9040:251, any
 * number of options that hug their labels). The selected option has the brand blue fill.
 *
 * A single-choice WAI-ARIA radio group: one tab stop, the arrow keys (and Home/End) move and
 * select. Give it a `label`.
 */
@Component({
  selector: 'gdg-segmented-control',
  templateUrl: './segmented-control.html',
  styleUrl: './segmented-control.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'radiogroup',
    '[attr.aria-label]': 'label()',
    '[class.gdg-segmented-control--full-width]': 'fullWidth()',
  },
})
export class SegmentedControl {
  readonly options = input.required<readonly SegmentedOption[]>();

  /** The selected option's `value`; two-way bindable. */
  readonly value = model<string>();

  /** Accessible name of the group, e.g. "Conference day". */
  readonly label = input.required<string>();

  /** Options share the full width (Figma `Toggle`). */
  readonly fullWidth = input(false, { transform: booleanAttribute });

  private readonly buttons =
    viewChildren<ElementRef<HTMLButtonElement>>('option');

  /** Index of the tab stop: the selected option, or the first one. */
  protected focusIndex(): number {
    return Math.max(
      0,
      this.options().findIndex((o) => o.value === this.value()),
    );
  }

  protected select(index: number): void {
    const option = this.options()[index];
    if (option) {
      this.value.set(option.value);
    }
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const last = this.options().length - 1;
    const next: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in next)) {
      return;
    }
    event.preventDefault();
    this.select(next[event.key]);
    this.buttons()[next[event.key]]?.nativeElement.focus();
  }
}
