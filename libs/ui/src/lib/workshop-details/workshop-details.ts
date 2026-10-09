import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Person } from '../person/person';
import { PersonRow } from '../person-row/person-row';

let nextId = 0;

/**
 * Workshop details from the Figma **Workshop Page** (`Container`, 143:5975), see ADR-0017: the
 * topic as the page heading, the description, and the trainers as `PersonRow`s.
 */
@Component({
  selector: 'gdg-workshop-details',
  imports: [PersonRow],
  templateUrl: './workshop-details.html',
  styleUrl: './workshop-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkshopDetails {
  /** The workshop topic; rendered as the page's `<h1>`. */
  readonly topic = input.required<string>();

  /** Plain text; line breaks start new lines. */
  readonly description = input('');

  readonly trainers = input<readonly Person[]>([]);

  readonly trainersHeading = input('Trainers');

  protected readonly trainersHeadingId = `gdg-workshop-trainers-${nextId++}`;
}
