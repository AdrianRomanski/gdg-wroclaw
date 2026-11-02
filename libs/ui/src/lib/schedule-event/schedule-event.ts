import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '@gdg-wroclaw/design-system-components';
import type { DevfestScheduleItem } from '../devfest-session/devfest-session';

/**
 * Schedule event from the Figma **DevFest components** page (`Schedule event`, 9027:147), see
 * ADR-0028: an agenda entry across all rooms. `shared` (opening, closing) is brand blue with a
 * flag; `break` is subtle yellow with a fork and knife. It stacks when narrower than 40rem.
 */
@Component({
  selector: 'gdg-schedule-event',
  imports: [Icon],
  templateUrl: './schedule-event.html',
  styleUrl: './schedule-event.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-type]': 'item().type',
  },
})
export class ScheduleEvent {
  readonly item = input.required<DevfestScheduleItem>();
}
