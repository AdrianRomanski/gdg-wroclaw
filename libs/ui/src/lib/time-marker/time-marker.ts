import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Time marker from the Figma **DevFest components** page (`Time marker`, 9024:28), see ADR-0028:
 * the time slot in the agenda's left column, with a connector line down to the next slot. It
 * fills the height its row gives it.
 */
@Component({
  selector: 'gdg-time-marker',
  template: `<time class="time" [attr.datetime]="dateTime() ?? null">{{
      time()
    }}</time
    ><span class="connector" aria-hidden="true"></span>`,
  styleUrl: './time-marker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeMarker {
  /** As shown, e.g. "08:00 – 08:30". */
  readonly time = input.required<string>();

  /** For `<time datetime>`, e.g. "2026-11-21T08:00". */
  readonly dateTime = input<string>();
}
