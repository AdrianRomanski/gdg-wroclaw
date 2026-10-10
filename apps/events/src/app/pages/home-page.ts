import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LandingPage } from '@gdg-wroclaw/ui';
import { LANDING_CONTENT } from '../content/landing';

/** `/`: the Landing page template with the site content (ADR-0022, ADR-0023). */
@Component({
  selector: 'gdg-home-page',
  imports: [LandingPage],
  template: `<gdg-landing-page [content]="content" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly content = LANDING_CONTENT;
}
