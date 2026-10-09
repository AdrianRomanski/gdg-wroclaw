import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  type AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Button,
  Checkbox,
  TextInput,
} from '@gdg-wroclaw/design-system-components';

/** What the visitor sent, emitted by `submitted` once every field is valid. */
export interface ContactFormValue {
  name: string;
  email: string;
  message: string;
}

let nextId = 0;

/**
 * Contact section from the Figma **Contact Form** page (`Contact / 3 /`, 181:9133), see ADR-0014.
 *
 * Presentational (ADR-0013): it validates the fields and emits `submitted`; sending the message
 * is up to the consumer, which sets `pending` while it is in flight and calls `reset()` after.
 */
@Component({
  selector: 'gdg-contact-form',
  imports: [ReactiveFormsModule, Button, Checkbox, TextInput],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm {
  readonly heading = input('Contact us');

  readonly description = input('');

  /** Link to the terms the visitor has to accept. */
  readonly termsUrl = input.required<string>();

  readonly submitLabel = input('Submit');

  /** Disables the submit button while the consumer sends the message. */
  readonly pending = input(false);

  readonly submitted = output<ContactFormValue>();

  protected readonly id = `gdg-contact-form-${nextId++}`;

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
    terms: [false, Validators.requiredTrue],
  });

  /** Errors show after a field is left or after the first submit attempt. */
  protected readonly attempted = signal(false);

  private readonly host =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.attempted());
  }

  protected submit(): void {
    if (this.pending()) {
      return;
    }
    this.attempted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }
    const { name, email, message } = this.form.getRawValue();
    this.submitted.emit({ name: name.trim(), email: email.trim(), message });
  }

  /** Clears the fields and errors, e.g. after the message was sent. */
  reset(): void {
    this.form.reset();
    this.attempted.set(false);
  }

  private focusFirstInvalid(): void {
    const first = Object.entries(this.form.controls).find(
      ([, control]) => control.invalid,
    );
    if (first) {
      this.host.querySelector<HTMLElement>(`#${this.id}-${first[0]}`)?.focus();
    }
  }
}
