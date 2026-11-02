import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DevfestSpeakersPage } from '@gdg-wroclaw/ui';
import { DEVFEST_SPEAKERS } from '../content/devfest';

/** `/devfest/speakers`: the DevFest speaker directory (ADR-0029). */
@Component({
  selector: 'gdg-devfest-speakers-route',
  imports: [DevfestSpeakersPage],
  template: `<gdg-devfest-speakers-page [content]="content" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevfestSpeakersRoute {
  protected readonly content = DEVFEST_SPEAKERS;
}
