import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Button, Icon } from '@gdg-wroclaw/design-system-components';
import { EventGraphic } from '../event-graphic/event-graphic';
import type { EventDetail } from '../event-page/event-detail';

/**
 * Event overview from the Figma **Event detail** page (`Event overview`, 8927:6046), see
 * ADR-0025: a breadcrumb, the hero (label, `<h1>` title, summary and buttons) next to the
 * community graphic, and the essentials (date, time, location) between two dividers.
 */
@Component({
  selector: 'gdg-event-overview',
  imports: [Button, EventGraphic, Icon],
  templateUrl: './event-overview.html',
  styleUrl: './event-overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventOverview {
  readonly event = input.required<EventDetail>();

  readonly breadcrumbLabel = input('Breadcrumb');
}
