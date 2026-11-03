import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { SessionPerson } from '../devfest-session/devfest-session';
import { PersonBio } from './person-bio';

@Component({
  imports: [PersonBio],
  template: `<gdg-person-bio [person]="person()" />`,
})
class Host {
  readonly person = signal<SessionPerson>({
    name: 'Ada Lovelace',
    bio: ['First paragraph.', 'Second paragraph.'],
  });
}

describe('PersonBio', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      host: fixture.componentInstance,
      element,
      button: element.querySelector('button.open') as HTMLButtonElement,
      dialog: element.querySelector('dialog') as HTMLDialogElement,
    };
  }

  it('opens a dialog named after the person with their bio', async () => {
    const { element, button, dialog } = await setup();
    expect(button.textContent?.trim()).toBe('Show bio');
    expect(button.getAttribute('aria-label')).toBe('Show bio: Ada Lovelace');
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(dialog.hasAttribute('open')).toBe(false);

    button.click();
    expect(dialog.hasAttribute('open')).toBe(true);
    const name = element.querySelector(
      `#${dialog.getAttribute('aria-labelledby')}`,
    );
    expect(name?.textContent).toBe('Ada Lovelace');
    expect(
      Array.from(dialog.querySelectorAll('.bio p')).map((p) => p.textContent),
    ).toEqual(['First paragraph.', 'Second paragraph.']);
    expect(
      (dialog.querySelector('gdg-avatar') as HTMLElement).dataset['shape'],
    ).toBe('square');

    (dialog.querySelector('button.close') as HTMLButtonElement).click();
    expect(dialog.hasAttribute('open')).toBe(false);
  });

  it('says the bio is coming soon when there is none', async () => {
    const { fixture, host, dialog } = await setup();
    host.person.set({ name: 'Alan Turing' });
    await fixture.whenStable();

    expect(dialog.querySelector('.empty')?.textContent).toBe(
      'Bio coming soon.',
    );
  });
});
