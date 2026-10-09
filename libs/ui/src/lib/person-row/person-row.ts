import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Person } from '../person/person';
import { RoleBadge } from '../role-badge/role-badge';
import { SocialLinks } from '../social-links/social-links';

/**
 * Person row from the Figma **Workshop Page** (trainer `Card`, 143:6008), see ADR-0016: photo,
 * role badge, name, job title and bio, with social links at the end. Rows are separated by a
 * divider above each one.
 */
@Component({
  selector: 'gdg-person-row',
  imports: [RoleBadge, SocialLinks],
  templateUrl: './person-row.html',
  styleUrl: './person-row.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonRow {
  readonly person = input.required<Person>();

  protected initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }
}
