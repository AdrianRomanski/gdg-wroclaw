import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Partner } from '../partner-card/partner';
import {
  PartnersSection,
  type PartnersSectionLayout,
} from './partners-section';

@Component({
  imports: [PartnersSection],
  template: `
    <gdg-partners-section
      description="Companies that support us."
      [partners]="partners"
      [layout]="layout()"
      [ctaHeading]="ctaHeading()"
      ctaText="Become a partner."
      [ctaHref]="ctaHref()"
    />
  `,
})
class Host {
  readonly partners: Partner[] = [
    'Acme',
    'Globex',
    'Initech',
    'Umbrella',
    'Hooli',
  ].map((name) => ({ name }));
  readonly layout = signal<PartnersSectionLayout>('grid');
  readonly ctaHeading = signal('Join us!');
  readonly ctaHref = signal<string | undefined>('/contact');
}

describe('PartnersSection', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return {
      fixture,
      host: fixture.componentInstance,
      element: fixture.nativeElement as HTMLElement,
    };
  }

  it('renders the title, a tile per partner and the call to action', async () => {
    const { element } = await setup();
    expect(element.querySelector('h2')?.textContent).toBe('Partners');
    expect(element.querySelector('.description')?.textContent).toBe(
      'Companies that support us.',
    );
    const cards = element.querySelectorAll('li > gdg-partner-card');
    expect(cards).toHaveLength(5);
    expect(
      Array.from(cards).every((card) =>
        card.classList.contains('gdg-partner-card--tile'),
      ),
    ).toBe(true);
    expect(element.querySelector('.carousel')).toBeNull();

    expect(element.querySelector('.cta-heading')?.textContent).toBe('Join us!');
    const cta = element.querySelector('a[gdg-button]') as HTMLAnchorElement;
    expect(cta.textContent?.trim()).toBe('Contact');
    expect(cta.getAttribute('href')).toBe('/contact');
  });

  it('renders the carousel with labelled controls for the scrolling region', async () => {
    const { fixture, host, element } = await setup();
    host.layout.set('carousel');
    await fixture.whenStable();

    const region = element.querySelector('[role="region"]') as HTMLElement;
    expect(region.getAttribute('aria-label')).toBe('Partners');
    expect(region.tabIndex).toBe(0);
    expect(region.querySelectorAll('.gdg-partner-card--card')).toHaveLength(5);

    const [previous, next] = Array.from(
      element.querySelectorAll<HTMLButtonElement>('.buttons button'),
    );
    expect(previous.getAttribute('aria-label')).toBe('Previous partners');
    expect(next.getAttribute('aria-label')).toBe('Next partners');
    expect(previous.getAttribute('aria-controls')).toBe(region.id);
    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(false);
    // jsdom has no layout, so the default of three visible cards gives three positions.
    expect(element.querySelectorAll('.dot')).toHaveLength(3);
    expect(element.querySelector('.dots')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
  });

  it('leaves out the call to action without a heading or link', async () => {
    const { fixture, host, element } = await setup();
    host.ctaHeading.set('');
    host.ctaHref.set(undefined);
    await fixture.whenStable();

    expect(element.querySelector('.cta')).toBeNull();
  });
});
