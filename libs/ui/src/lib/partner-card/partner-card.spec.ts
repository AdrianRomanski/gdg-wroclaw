import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Partner } from './partner';
import { PartnerCard, type PartnerCardVariant } from './partner-card';

const acme: Partner = {
  name: 'Acme',
  logo: { src: '/acme.svg' },
  url: 'https://acme.example',
};

@Component({
  imports: [PartnerCard],
  template: `<gdg-partner-card [partner]="partner()" [variant]="variant()" />`,
})
class Host {
  readonly partner = signal<Partner>(acme);
  readonly variant = signal<PartnerCardVariant>('tile');
}

describe('PartnerCard', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      host: fixture.componentInstance,
      element,
      card: element.querySelector('gdg-partner-card') as HTMLElement,
    };
  }

  it('links the logo and name to the partner site in a new tab', async () => {
    const { element, card } = await setup();
    const link = element.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('https://acme.example');
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe('noopener noreferrer');
    expect(link.textContent?.trim()).toBe('Acme');
    const logo = link.querySelector('img') as HTMLImageElement;
    expect(logo.getAttribute('src')).toBe('/acme.svg');
    expect(logo.alt).toBe('');
    expect(card.classList).toContain('gdg-partner-card--tile');
  });

  it('renders the card variant without a link or logo', async () => {
    const { fixture, host, element, card } = await setup();
    host.partner.set({ name: 'wrocław tech' });
    host.variant.set('card');
    await fixture.whenStable();

    expect(element.querySelector('a')).toBeNull();
    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('.placeholder')?.textContent).toBe('W');
    expect(element.querySelector('.name')?.textContent).toBe('wrocław tech');
    expect(card.classList).toContain('gdg-partner-card--card');
  });
});
