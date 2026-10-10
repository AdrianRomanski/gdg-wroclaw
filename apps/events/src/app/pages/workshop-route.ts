import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { WorkshopPage } from '@gdg-wroclaw/ui';
import { WORKSHOPS } from '../content/workshops';
import { NotFoundPage } from './not-found-page';

/** `/workshops/:slug`: the Workshop page template, or Not found for an unknown slug. */
@Component({
  selector: 'gdg-workshop-route',
  imports: [WorkshopPage, NotFoundPage],
  template: `
    @if (workshop(); as workshop) {
      <gdg-workshop-page [workshop]="workshop" />
    } @else {
      <gdg-not-found-page />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkshopRoute {
  /** Bound from the route parameter (`withComponentInputBinding`). */
  readonly slug = input('');

  protected readonly workshop = computed(() =>
    Object.hasOwn(WORKSHOPS, this.slug()) ? WORKSHOPS[this.slug()] : undefined,
  );
}
