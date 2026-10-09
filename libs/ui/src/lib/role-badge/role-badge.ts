import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ROLE_BADGE_ARTWORK, ROLE_BADGE_VIEW_BOX } from './role-badge-artwork';

export type PersonRole = 'member' | 'organizer' | 'speaker';

const DEFAULT_LABELS: Record<PersonRole, string> = {
  member: 'Member',
  organizer: 'Organizer',
  speaker: 'Speaker',
};

let nextId = 0;

/**
 * Role badge from the Figma **Team/Partners** page (Badge component set 180:2682), see ADR-0016:
 * the GDG logo above a role icon on a dark disc. Member is blue (people), Organizer green
 * (globe), Speaker yellow (quotes).
 *
 * It is an image named after the role (`label`), since the role is often not written next to it.
 */
@Component({
  selector: 'gdg-role-badge',
  templateUrl: './role-badge.html',
  styleUrl: './role-badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'img',
    '[attr.aria-label]': 'label() ?? defaultLabel()',
    '[style.--gdg-role-badge-size]': "size() / 16 + 'rem'",
  },
})
export class RoleBadge {
  readonly role = input.required<PersonRole>();

  /** White ring around the disc (Figma `Stroke`). */
  readonly ring = input(true, { transform: booleanAttribute });

  /** Diameter in px; the Workshop trainer rows use 55. */
  readonly size = input(55);

  /** Accessible name, e.g. a translation. Defaults to the role in English. */
  readonly label = input<string>();

  protected readonly viewBox = ROLE_BADGE_VIEW_BOX;

  protected readonly defaultLabel = computed(() => DEFAULT_LABELS[this.role()]);

  private readonly clipId = `gdg-role-badge-clip-${nextId++}`;

  private readonly sanitizer = inject(DomSanitizer);

  // Safe: markup comes from the committed artwork file, never from user input.
  protected readonly artwork = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(
      `<defs><clipPath id="${this.clipId}"><circle cx="241.5" cy="241.5" r="226.5"/></clipPath></defs>` +
        ROLE_BADGE_ARTWORK[this.role()].replaceAll('{clipId}', this.clipId),
    ),
  );
}
