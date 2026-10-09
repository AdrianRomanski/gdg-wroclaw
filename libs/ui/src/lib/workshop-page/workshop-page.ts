import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EventBanner } from '../event-banner/event-banner';
import { WorkshopDetails } from '../workshop-details/workshop-details';
import type { Workshop } from './workshop';

/**
 * Workshop page template from the Figma **Workshop Page** (`Event Header / 1 /`, 143:5973), see
 * ADR-0017: the banner, then the workshop details in the section container.
 *
 * Presentational (ADR-0013): the app routes to it and loads the `Workshop`. Navbar and footer
 * belong to the app shell.
 */
@Component({
  selector: 'gdg-workshop-page',
  imports: [EventBanner, WorkshopDetails],
  templateUrl: './workshop-page.html',
  styleUrl: './workshop-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkshopPage {
  readonly workshop = input.required<Workshop>();
}
