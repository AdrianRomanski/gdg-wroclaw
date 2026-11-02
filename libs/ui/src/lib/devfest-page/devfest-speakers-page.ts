import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DevfestHero } from '../devfest-hero/devfest-hero';
import { DevfestSpeakers } from '../devfest-speakers/devfest-speakers';
import type { DevfestSpeakersPageContent } from './devfest-content';

/**
 * DevFest speakers page from the Figma **DevFest** page (`Speaker directory — Desktop`,
 * 9044:2755, and `— Mobile`, 9044:3192), see ADR-0029: the hero and the speaker directory.
 */
@Component({
  selector: 'gdg-devfest-speakers-page',
  imports: [DevfestHero, DevfestSpeakers],
  template: `@let c = content();
    <h1 class="visually-hidden">{{ c.title }}</h1>
    <gdg-devfest-hero [hero]="c.hero" />
    <gdg-devfest-speakers [content]="c.speakers" />`,
  styleUrl: './devfest-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevfestSpeakersPage {
  readonly content = input.required<DevfestSpeakersPageContent>();
}
