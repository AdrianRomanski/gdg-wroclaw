import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Sponsor } from './sponsor';
import { SponsorsSection } from './sponsors-section';

@Component({
  imports: [SponsorsSection],
  template: `
    <gdg-sponsors-section
      description="Companies that make it possible."
      [sponsors]="sponsors()"
      [ctaHeading]="ctaHeading()"
      ctaText="Support the community."
      [ctaHref]="ctaHref()"
    />
  `,
})
class Host {
  readonly sponsors = signal<Sponsor[]>([
    { name: 'Initech', tier: 'gold' },
    { name: 'Acme', tier: 'platinum' },
    { name: 'Hooli', tier: 'silver' },
    { name: 'Globex', tier: 'platinum' },
  ]);
  readonly ctaHeading = signal('Become a sponsor');
  readonly ctaHref = signal<string | undefined>('/contact');
}

describe('SponsorsSection', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return {
      fixture,
      host: fixture.componentInstance,
      element: fixture.nativeElement as HTMLElement,
    };
  }

  const names = (tier: Element) =>
    Array.from(tier.querySelectorAll('li gdg-partner-card .name')).map(
      (name) => name.textContent,
    );

  it('groups the sponsors by tier, highest first, as labelled tile lists', async () => {
    const { element } = await setup();
    expect(element.querySelector('h2')?.textContent).toBe('Sponsors');
    expect(element.querySelector('.description')?.textContent).toBe(
      'Companies that make it possible.',
    );

    const tiers = Array.from(element.querySelectorAll('section.tier'));
    expect(
      tiers.map((tier) => tier.querySelector('h3')?.textContent?.trim()),
    ).toEqual(['Platinum', 'Gold', 'Silver']);
    expect(tiers.map(names)).toEqual([
      ['Acme', 'Globex'],
      ['Initech'],
      ['Hooli'],
    ]);
    for (const tier of tiers) {
      const heading = tier.querySelector('h3') as HTMLElement;
      expect(tier.getAttribute('aria-labelledby')).toBe(heading.id);
    }
    expect(element.querySelectorAll('.gdg-partner-card--tile')).toHaveLength(4);
  });

  it('leaves out empty tiers', async () => {
    const { fixture, host, element } = await setup();
    host.sponsors.set([{ name: 'Hooli', tier: 'silver' }]);
    await fixture.whenStable();

    expect(
      Array.from(element.querySelectorAll('section.tier')).map(
        (t) => t.className,
      ),
    ).toEqual(['tier tier--silver']);
  });

  it('renders a red call to action, and leaves it out without a heading or link', async () => {
    const { fixture, host, element } = await setup();
    expect(element.querySelector('.cta-heading')?.textContent).toBe(
      'Become a sponsor',
    );
    const cta = element.querySelector('a[gdg-button]') as HTMLAnchorElement;
    expect(cta.getAttribute('href')).toBe('/contact');
    expect(cta.classList).toContain('gdg-button--red');

    host.ctaHeading.set('');
    host.ctaHref.set(undefined);
    await fixture.whenStable();
    expect(element.querySelector('.cta')).toBeNull();
  });
});
