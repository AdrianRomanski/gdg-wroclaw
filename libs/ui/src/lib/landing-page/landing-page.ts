import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EventsSection } from '../events-section/events-section';
import { FaqSection } from '../faq/faq-section';
import { PartnersSection } from '../partners-section/partners-section';
import { TeamSection } from '../team-section/team-section';
import {
  LANDING_SECTION_IDS,
  type LandingPageContent,
} from './landing-page-content';

/**
 * Landing page template from the Figma **Landing Page** (143:2897), see ADR-0022: the hero image,
 * then the Events, Team, Partners (carousel) and FAQ sections, in Figma order.
 *
 * Presentational (ADR-0013): the app routes to it and passes the content. The Navbar and Footer
 * belong to the app shell (ADR-0017, ADR-0020). Sections carry anchor ids
 * (`LANDING_SECTION_IDS`) for in-page navigation.
 */
@Component({
  selector: 'gdg-landing-page',
  imports: [EventsSection, FaqSection, PartnersSection, TeamSection],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  readonly content = input.required<LandingPageContent>();

  protected readonly ids = LANDING_SECTION_IDS;
}
