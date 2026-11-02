import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { DevfestAgendaPage, type DevfestDay } from '@gdg-wroclaw/ui';
import { DEVFEST_AGENDA } from '../content/devfest';

/**
 * `/devfest`: the DevFest agenda (ADR-0029). `?day=2` opens on day 2, so each day can be
 * linked to.
 */
@Component({
  selector: 'gdg-devfest-agenda-route',
  imports: [DevfestAgendaPage],
  template: `<gdg-devfest-agenda-page
    [content]="content"
    [day]="initialDay()"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevfestAgendaRoute {
  /** Bound from the `day` query parameter (`withComponentInputBinding`). */
  readonly day = input<string>();

  protected readonly content = DEVFEST_AGENDA;

  protected readonly initialDay = computed<DevfestDay>(() =>
    this.day() === '2' ? 'parallel' : 'main-stage',
  );
}
