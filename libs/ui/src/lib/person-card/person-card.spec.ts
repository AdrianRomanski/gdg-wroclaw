import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Person } from '../person/person';
import { PersonCard, type PersonCardFrame } from './person-card';

const ada: Person = {
  name: 'Ada Lovelace',
  jobTitle: 'Analyst',
  bio: 'Wrote the first program.',
  photo: { src: '/ada.jpg' },
  role: 'speaker',
  socials: [{ network: 'github', url: 'https://github.com/ada' }],
};

@Component({
  imports: [PersonCard],
  template: `<gdg-person-card
    [person]="person()"
    [frame]="frame()"
    [badge]="badge()"
  />`,
})
class Host {
  readonly person = signal<Person>(ada);
  readonly frame = signal<PersonCardFrame>('circle');
  readonly badge = signal(true);
}

describe('PersonCard', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      host: fixture.componentInstance,
      element,
      card: element.querySelector('gdg-person-card') as HTMLElement,
    };
  }

  it('shows a round photo, the badge, the role, the bio and social links', async () => {
    const { element, card } = await setup();
    const photo = element.querySelector('img.circle') as HTMLImageElement;
    expect(photo.getAttribute('src')).toBe('/ada.jpg');
    expect(photo.alt).toBe('');
    expect(
      element.querySelector('gdg-role-badge')?.getAttribute('aria-label'),
    ).toBe('Speaker');
    expect(element.querySelector('h3')?.textContent).toBe('Ada Lovelace');
    expect(element.querySelector('.subtitle')?.textContent).toBe('Speaker');
    expect(element.querySelector('.bio')?.textContent).toBe(
      'Wrote the first program.',
    );
    expect(element.querySelector('a')?.getAttribute('aria-label')).toBe(
      'Ada Lovelace on GitHub',
    );
    expect(card.classList).toContain('gdg-person-card--circle');
    expect(card.classList).toContain('gdg-person-card--speaker');
  });

  it('shows the job title instead of the badge and role when the badge is off', async () => {
    const { fixture, host, element } = await setup();
    host.badge.set(false);
    await fixture.whenStable();

    expect(element.querySelector('gdg-role-badge')).toBeNull();
    expect(element.querySelector('.subtitle')?.textContent).toBe('Analyst');
  });

  it('clips the photo to the puzzle frame with a unique clip path', async () => {
    const { fixture, host, element, card } = await setup();
    host.frame.set('puzzle');
    await fixture.whenStable();

    const svg = element.querySelector('svg.puzzle') as SVGSVGElement;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    const clipId = svg.querySelector('clipPath')?.id;
    expect(clipId).toMatch(/^gdg-person-card-clip-\d+$/);
    const image = svg.querySelector('image') as SVGImageElement;
    expect(image.getAttribute('href')).toBe('/ada.jpg');
    expect(image.getAttribute('clip-path')).toBe(`url(#${clipId})`);
    expect(svg.querySelector('.puzzle-stroke')).not.toBeNull();
    expect(card.classList).toContain('gdg-person-card--puzzle');
  });

  it('names the puzzle photo when it has alt text', async () => {
    const { fixture, host, element } = await setup();
    host.frame.set('puzzle');
    host.person.set({ ...ada, photo: { src: '/ada.jpg', alt: 'Ada at work' } });
    await fixture.whenStable();

    const svg = element.querySelector('svg.puzzle') as SVGSVGElement;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Ada at work');
    expect(svg.hasAttribute('aria-hidden')).toBe(false);
  });

  it('shows initials without a photo and leaves out missing parts', async () => {
    const { fixture, host, element } = await setup();
    host.person.set({ name: 'grace brewster hopper' });
    await fixture.whenStable();

    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('.placeholder')?.textContent?.trim()).toBe(
      'GB',
    );
    for (const selector of [
      'gdg-role-badge',
      '.subtitle',
      '.bio',
      'gdg-social-links',
    ]) {
      expect(element.querySelector(selector)).toBeNull();
    }

    host.frame.set('puzzle');
    await fixture.whenStable();
    expect(element.querySelector('image')).toBeNull();
    expect(element.querySelector('.puzzle-initials')?.textContent).toBe('GB');
  });
});
