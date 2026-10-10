import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EventOrganizers } from '../event-organizers/event-organizers';
import { EventOverview } from '../event-overview/event-overview';
import { EventRegistration } from '../event-registration/event-registration';
import { EventSchedule } from '../event-schedule/event-schedule';
import { EventSpeakers } from '../event-speakers/event-speakers';
import { EventSupporters } from '../event-supporters/event-supporters';
import { EventVenue } from '../event-venue/event-venue';
import { EVENT_SECTION_IDS, type EventDetail } from './event-detail';

/**
 * Event page template from the Figma **Event detail** page (`DevFest • Event detail`, 8927:6018),
 * see ADR-0025: the overview, then speakers, schedule, venue, organizers, partners and sponsors,
 * and the registration callout. Sections without data are left out.
 *
 * Presentational (ADR-0013): the app routes to it and loads the `EventDetail`. The Navbar and
 * Footer belong to the app shell.
 */
@Component({
  selector: 'gdg-event-page',
  imports: [
    EventOrganizers,
    EventOverview,
    EventRegistration,
    EventSchedule,
    EventSpeakers,
    EventSupporters,
    EventVenue,
  ],
  templateUrl: './event-page.html',
  styleUrl: './event-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventPage {
  readonly event = input.required<EventDetail>();

  protected readonly ids = EVENT_SECTION_IDS;
}
