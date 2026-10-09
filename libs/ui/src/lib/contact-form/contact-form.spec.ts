import { Component, signal, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactForm, type ContactFormValue } from './contact-form';

@Component({
  imports: [ContactForm],
  template: `
    <gdg-contact-form
      description="Write to the organizers."
      termsUrl="/terms"
      [pending]="pending()"
      (submitted)="sent.push($event)"
    />
  `,
})
class Host {
  readonly form = viewChild.required(ContactForm);
  readonly pending = signal(false);
  readonly sent: ContactFormValue[] = [];
}

describe('ContactForm', () => {
  let fixture: ComponentFixture<Host>;
  let element: HTMLElement;

  const field = (label: string) => {
    const labelElement = Array.from(element.querySelectorAll('label')).find(
      (candidate) => candidate.textContent?.trim().startsWith(label),
    );
    return element.querySelector<HTMLInputElement>(
      `#${labelElement?.htmlFor}`,
    ) as HTMLInputElement;
  };
  const type = (label: string, value: string) => {
    const control = field(label);
    control.value = value;
    control.dispatchEvent(new Event('input'));
  };
  const submit = async () => {
    (element.querySelector('button[type=submit]') as HTMLButtonElement).click();
    await fixture.whenStable();
  };
  const errors = () =>
    Array.from(element.querySelectorAll('.error')).map((error) =>
      error.textContent?.trim(),
    );

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  it('renders the Figma section title and labelled fields', () => {
    expect(element.querySelector('h2')?.textContent).toBe('Contact us');
    expect(element.querySelector('.description')?.textContent).toBe(
      'Write to the organizers.',
    );
    expect(field('Name').type).toBe('text');
    expect(field('Email').type).toBe('email');
    expect(field('Message').tagName).toBe('TEXTAREA');
    expect(field('I accept').type).toBe('checkbox');
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/terms');
  });

  it('shows errors and focuses the first invalid field instead of submitting', async () => {
    expect(errors()).toEqual([]);

    await submit();

    expect(fixture.componentInstance.sent).toEqual([]);
    expect(errors()).toEqual([
      'Enter your name.',
      'Enter your email.',
      'Enter a message.',
      'Accept the terms to send your message.',
    ]);
    const name = field('Name');
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(name.getAttribute('aria-describedby')).toBe(
      element.querySelector('.error')?.id,
    );
    expect(document.activeElement).toBe(name);
  });

  it('rejects a malformed email', async () => {
    type('Email', 'not-an-email');
    await submit();
    expect(errors()).toContain('Enter a valid email, e.g. name@example.com.');
  });

  it('emits the trimmed values once the form is valid', async () => {
    type('Name', ' Ada Lovelace ');
    type('Email', 'ada@example.com');
    type('Message', 'Hello GDG!');
    field('I accept').click();

    await submit();

    expect(errors()).toEqual([]);
    expect(fixture.componentInstance.sent).toEqual([
      { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello GDG!' },
    ]);
  });

  it('does not submit while pending and clears on reset', async () => {
    type('Name', 'Ada');
    fixture.componentInstance.pending.set(true);
    await fixture.whenStable();
    const button = element.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');

    fixture.componentInstance.form().reset();
    await fixture.whenStable();
    expect(field('Name').value).toBe('');
  });
});
