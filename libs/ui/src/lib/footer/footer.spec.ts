import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Footer } from './footer';

@Component({
  imports: [Footer],
  template: `
    <gdg-footer
      [links]="[{ label: 'Agenda', href: '/agenda' }]"
      [socials]="[{ network: 'youtube', url: 'https://youtube.com/@gdg' }]"
      [legalLinks]="[{ label: 'Privacy Policy', href: '/privacy' }]"
    />
  `,
})
class Host {}

describe('Footer', () => {
  it('renders the home logo, navigation, social and legal links', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    const home = element.querySelector('a.home') as HTMLAnchorElement;
    expect(home.getAttribute('href')).toBe('/');
    expect(home.getAttribute('aria-label')).toBe(
      'Google Developer Groups Wrocław, home',
    );
    expect(home.querySelector('gdg-logo')?.hasAttribute('role')).toBe(false);

    const [nav, legal] = Array.from(element.querySelectorAll('nav'));
    expect(nav.getAttribute('aria-label')).toBe('Footer');
    expect(nav.querySelector('a')?.textContent?.trim()).toBe('Agenda');
    expect(legal.getAttribute('aria-label')).toBe('Legal');
    expect(legal.querySelector('a')?.getAttribute('href')).toBe('/privacy');

    expect(
      element.querySelector('gdg-social-links a')?.getAttribute('aria-label'),
    ).toBe('GDG Wrocław on YouTube');
  });
});
