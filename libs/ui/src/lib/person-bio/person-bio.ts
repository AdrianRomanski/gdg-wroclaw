import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  input,
  viewChild,
} from '@angular/core';
import {
  Avatar,
  Button,
  type ButtonColor,
} from '@gdg-wroclaw/design-system-components';
import {
  personInitials,
  type SessionPerson,
} from '../devfest-session/devfest-session';

let nextId = 0;

/**
 * A "Show bio" button for a person on a DevFest session (ADR-0034) that opens their bio in a
 * modal dialog: the whole photo, the name (`<h2>`) and the bio paragraphs. Without a bio the
 * dialog says it is coming soon, so every person gets the same button. Escape, the close button
 * or a click on the backdrop closes it, and focus returns to the button.
 */
@Component({
  selector: 'gdg-person-bio',
  imports: [Avatar, Button],
  templateUrl: './person-bio.html',
  styleUrl: './person-bio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonBio {
  readonly person = input.required<SessionPerson>();

  /** Button color, e.g. the session track's. */
  readonly color = input<ButtonColor>('blue');

  /** A white outline button, for brand-colored surfaces such as the Keynote card. */
  readonly onBrand = input(false, { transform: booleanAttribute });

  readonly openLabel = input('Show bio');

  readonly closeLabel = input('Close');

  /** Shown in the dialog when the person has no bio yet. */
  readonly emptyLabel = input('Bio coming soon.');

  protected readonly initials = computed(() => personInitials(this.person()));

  protected readonly paragraphs = computed(() => this.person().bio ?? []);

  protected readonly nameId = `gdg-person-bio-name-${nextId++}`;

  private readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected open(): void {
    const dialog = this.dialog().nativeElement;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  protected close(): void {
    const dialog = this.dialog().nativeElement;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  /** A click on the backdrop lands on the dialog itself, outside its content. */
  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }
}
