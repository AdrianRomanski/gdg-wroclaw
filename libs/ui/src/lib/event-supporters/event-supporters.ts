import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type {
  EventSectionIntro,
  EventSupporterGroup,
} from '../event-page/event-detail';
import { PartnerCard } from '../partner-card/partner-card';
import { SectionIntro } from '../section-intro/section-intro';

let nextId = 0;

/**
 * Partners and sponsors section from the Figma **Event detail** page (`Event partners and
 * sponsors`, 8927:6405), see ADR-0025: the introduction, then groups such as "Partners" and
 * "Sponsors", side by side, each a row of `PartnerCard`s (card variant) with what they contribute.
 */
@Component({
  selector: 'gdg-event-supporters',
  imports: [PartnerCard, SectionIntro],
  templateUrl: './event-supporters.html',
  styleUrl: './event-supporters.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSupporters {
  readonly intro = input.required<EventSectionIntro>();

  readonly groups = input.required<readonly EventSupporterGroup[]>();

  protected readonly headingId = `gdg-event-supporters-${nextId++}`;
}
