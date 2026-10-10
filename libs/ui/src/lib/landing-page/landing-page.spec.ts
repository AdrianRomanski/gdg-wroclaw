import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LandingPage } from './landing-page';
import type { LandingPageContent } from './landing-page-content';

const full: LandingPageContent = {
  heading: 'GDG Wrocław',
  hero: { src: '/hero.png', alt: 'Join our community' },
  events: { days: [{ label: '29.06', events: [{ title: 'Kotlin' }] }] },
  team: {
    members: [{ name: 'Ada Lovelace', role: 'organizer' }],
    ctaHeading: 'We’re hiring!',
    ctaHref: '/contact',
  },
  partners: { partners: [{ name: 'Acme' }] },
  faq: { entries: [{ question: 'Is it free?', answer: 'Yes.' }] },
};

@Component({
  imports: [LandingPage],
  template: `<gdg-landing-page [content]="content()" />`,
})
class Host {
  readonly content = signal<LandingPageContent>(full);
}

describe('LandingPage', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return {
      fixture,
      host: fixture.componentInstance,
      element: fixture.nativeElement as HTMLElement,
    };
  }

  it('renders the heading, hero and every section in Figma order with anchor ids', async () => {
    const { element } = await setup();
    expect(element.querySelector('h1')?.textContent).toBe('GDG Wrocław');
    const hero = element.querySelector('.hero-image') as HTMLImageElement;
    expect(hero.getAttribute('src')).toBe('/hero.png');
    expect(hero.alt).toBe('Join our community');

    const sections = Array.from(element.querySelectorAll('.section'));
    expect(sections.map((section) => section.tagName.toLowerCase())).toEqual([
      'gdg-events-section',
      'gdg-team-section',
      'gdg-partners-section',
      'gdg-faq-section',
    ]);
    expect(sections.map((section) => section.id)).toEqual([
      'events',
      'team',
      'partners',
      'faq',
    ]);
    expect(
      Array.from(element.querySelectorAll('h2')).map((h) => h.textContent),
    ).toEqual(['Events', 'Our team', 'Partners', 'FAQs']);
  });

  it('uses the Landing variants: circle team, yellow team button, carousel, green puzzle FAQ', async () => {
    const { element } = await setup();
    expect(element.querySelector('.gdg-person-card--circle')).not.toBeNull();
    expect(element.querySelector('#team a[gdg-button]')?.classList).toContain(
      'gdg-button--yellow',
    );
    expect(
      element.querySelector('.gdg-partners-section--carousel'),
    ).not.toBeNull();
    expect(
      element.querySelector('.gdg-faq-item--puzzle.gdg-faq-item--green'),
    ).not.toBeNull();
  });

  it('leaves out missing sections and the hero', async () => {
    const { fixture, host, element } = await setup();
    host.content.set({ heading: 'GDG Wrocław', faq: full.faq });
    await fixture.whenStable();

    expect(element.querySelector('.hero')).toBeNull();
    expect(
      Array.from(element.querySelectorAll('.section')).map((s) => s.id),
    ).toEqual(['faq']);
  });
});
