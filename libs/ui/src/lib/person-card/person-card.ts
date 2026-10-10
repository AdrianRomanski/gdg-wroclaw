import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { initials } from '../person/initials';
import type { Person } from '../person/person';
import { PERSON_ROLE_LABELS, RoleBadge } from '../role-badge/role-badge';
import { SocialLinks } from '../social-links/social-links';
import { PUZZLE_FRAME_PATH, PUZZLE_FRAME_SIZE } from './puzzle-frame';

/** `circle` is Figma `Color border=False`, `puzzle` is `Color border=True`. */
export type PersonCardFrame = 'circle' | 'puzzle';

let nextId = 0;

/**
 * Person card from the Figma **Team/Partners** page (`Person` component set 180:3087), see
 * ADR-0018: a square photo, the name, the bio and social links, centered.
 *
 * - `frame`: a round photo, or a puzzle-piece frame outlined in the role color.
 * - With a `role` and `badge` on (Figma `Badge=True`), the role badge sits next to the name and
 *   the role is the subtitle; otherwise the job title is.
 */
@Component({
  selector: 'gdg-person-card',
  imports: [RoleBadge, SocialLinks],
  templateUrl: './person-card.html',
  styleUrl: './person-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
})
export class PersonCard {
  readonly person = input.required<Person>();

  readonly frame = input<PersonCardFrame>('circle');

  /** Show the role badge and role (Figma `Badge`); needs `person.role`. */
  readonly badge = input(true, { transform: booleanAttribute });

  protected readonly hostClass = computed(() =>
    [
      'gdg-person-card',
      `gdg-person-card--${this.frame()}`,
      this.person().role ? `gdg-person-card--${this.person().role}` : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected readonly showBadge = computed(
    () => this.badge() && !!this.person().role,
  );

  protected readonly subtitle = computed(() => {
    const { role, jobTitle } = this.person();
    return this.showBadge() && role ? PERSON_ROLE_LABELS[role] : jobTitle;
  });

  protected readonly initials = initials;

  protected readonly frameSize = PUZZLE_FRAME_SIZE;

  protected readonly framePath = PUZZLE_FRAME_PATH;

  protected readonly clipId = `gdg-person-card-clip-${nextId++}`;
}
