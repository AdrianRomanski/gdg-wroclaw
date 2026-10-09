import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Person } from '../person/person';
import { PersonRow } from './person-row';

const ada: Person = {
  name: 'Ada Lovelace',
  jobTitle: 'Analyst',
  bio: 'Wrote the first program.',
  photo: { src: '/ada.jpg' },
  role: 'speaker',
  socials: [{ network: 'github', url: 'https://github.com/ada' }],
};

@Component({
  imports: [PersonRow],
  template: `<gdg-person-row [person]="person()" />`,
})
class Host {
  readonly person = signal<Person>(ada);
}

describe('PersonRow', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  it('shows the photo, badge, name, job title, bio and social links', async () => {
    const { element } = await setup();
    const photo = element.querySelector('img') as HTMLImageElement;
    expect(photo.getAttribute('src')).toBe('/ada.jpg');
    expect(photo.alt).toBe('');
    expect(
      element.querySelector('gdg-role-badge')?.getAttribute('aria-label'),
    ).toBe('Speaker');
    expect(element.querySelector('h3')?.textContent).toBe('Ada Lovelace');
    expect(element.querySelector('.job-title')?.textContent).toBe('Analyst');
    expect(element.querySelector('.bio')?.textContent).toBe(
      'Wrote the first program.',
    );
    expect(element.querySelector('a')?.getAttribute('aria-label')).toBe(
      'Ada Lovelace on GitHub',
    );
  });

  it('shows initials without a photo and leaves out missing parts', async () => {
    const { fixture, element } = await setup();
    fixture.componentInstance.person.set({ name: 'grace brewster hopper' });
    await fixture.whenStable();

    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('.placeholder')?.textContent).toBe('GB');
    for (const selector of [
      'gdg-role-badge',
      '.job-title',
      '.bio',
      'gdg-social-links',
    ]) {
      expect(element.querySelector(selector)).toBeNull();
    }
  });
});
