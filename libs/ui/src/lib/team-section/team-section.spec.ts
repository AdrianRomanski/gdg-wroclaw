import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { PersonCardFrame } from '../person-card/person-card';
import type { Person } from '../person/person';
import { TeamSection } from './team-section';

@Component({
  imports: [TeamSection],
  template: `
    <gdg-team-section
      description="The people behind GDG Wrocław."
      [members]="members"
      [frame]="frame()"
      [badges]="badges()"
      [ctaHeading]="ctaHeading()"
      ctaText="Join the organizers."
      [ctaHref]="ctaHref()"
    />
  `,
})
class Host {
  readonly members: Person[] = [
    { name: 'Ada Lovelace', role: 'organizer' },
    { name: 'Grace Hopper', role: 'speaker' },
    { name: 'Alan Turing', role: 'member' },
  ];
  readonly frame = signal<PersonCardFrame>('circle');
  readonly badges = signal(true);
  readonly ctaHeading = signal('We’re hiring!');
  readonly ctaHref = signal<string | undefined>('/contact');
}

describe('TeamSection', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return {
      fixture,
      host: fixture.componentInstance,
      element: fixture.nativeElement as HTMLElement,
    };
  }

  it('renders the title, one card per member and the call to action', async () => {
    const { element } = await setup();
    expect(element.querySelector('h2')?.textContent).toBe('Our team');
    expect(element.querySelector('.description')?.textContent).toBe(
      'The people behind GDG Wrocław.',
    );
    const cards = element.querySelectorAll('li > gdg-person-card');
    expect(
      Array.from(cards).map((card) => card.querySelector('h3')?.textContent),
    ).toEqual(['Ada Lovelace', 'Grace Hopper', 'Alan Turing']);
    expect(element.querySelectorAll('gdg-role-badge')).toHaveLength(3);

    expect(element.querySelector('.cta-heading')?.textContent).toBe(
      'We’re hiring!',
    );
    expect(element.querySelector('.cta-text')?.textContent).toBe(
      'Join the organizers.',
    );
    const cta = element.querySelector('a[gdg-button]') as HTMLAnchorElement;
    expect(cta.textContent?.trim()).toBe('Contact us');
    expect(cta.getAttribute('href')).toBe('/contact');
  });

  it('passes the frame and badges to every card', async () => {
    const { fixture, host, element } = await setup();
    host.frame.set('puzzle');
    host.badges.set(false);
    await fixture.whenStable();

    expect(element.querySelectorAll('.gdg-person-card--puzzle')).toHaveLength(
      3,
    );
    expect(element.querySelector('gdg-role-badge')).toBeNull();
  });

  it('leaves out the call to action without a heading or link', async () => {
    const { fixture, host, element } = await setup();
    host.ctaHeading.set('');
    host.ctaHref.set(undefined);
    await fixture.whenStable();

    expect(element.querySelector('.cta')).toBeNull();
  });
});
