import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import {
  DevfestAgenda,
  type DevfestDay,
} from '../devfest-agenda/devfest-agenda';
import { DevfestHero } from '../devfest-hero/devfest-hero';
import type { DevfestAgendaPageContent } from './devfest-content';

/** Anchor of the agenda section, e.g. for "/devfest#agenda". */
export const DEVFEST_AGENDA_ID = 'agenda';

/**
 * DevFest agenda page from the Figma **DevFest** page (`Day 1 desktop — Main stage`, 9043:2020,
 * and `Day 2 desktop — Presentations`, 9028:1211, with their mobile frames), see ADR-0029: the
 * hero and the agenda, whose Day toggle switches between the two frames.
 */
@Component({
  selector: 'gdg-devfest-agenda-page',
  imports: [DevfestAgenda, DevfestHero],
  template: `@let c = content();
    <h1 class="visually-hidden">{{ c.title }}</h1>
    <gdg-devfest-hero [hero]="c.hero" />
    <gdg-devfest-agenda [id]="agendaId" [agenda]="c.agenda" [(day)]="day" />`,
  styleUrl: './devfest-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevfestAgendaPage {
  readonly content = input.required<DevfestAgendaPageContent>();

  /** The agenda day shown; two-way bindable. */
  readonly day = model<DevfestDay>('main-stage');

  protected readonly agendaId = DEVFEST_AGENDA_ID;
}
