import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { NavAction, NavLink } from './nav-link';
import { Navbar } from './navbar';

@Component({
  imports: [Navbar],
  template: `<gdg-navbar
    homeHref="/home"
    [links]="links()"
    [actions]="actions()"
  />`,
})
class Host {
  readonly links = signal<NavLink[]>([
    { label: 'Agenda', href: '/agenda' },
    { label: 'Speakers', href: '/speakers', current: true },
  ]);
  readonly actions = signal<NavAction[]>([
    { label: 'Register', href: '/register' },
    { label: 'Contact us', href: '/contact', variant: 'secondary' },
  ]);
}

describe('Navbar', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return { fixture, host: fixture.componentInstance, element };
  }

  it('links home with the wordmark and renders the links and actions', async () => {
    const { element } = await setup();
    const home = element.querySelector('a.home') as HTMLAnchorElement;
    expect(home.getAttribute('href')).toBe('/home');
    expect(home.textContent?.trim()).toBe('Google Developer Groups');

    const nav = element.querySelector('nav') as HTMLElement;
    expect(nav.getAttribute('aria-label')).toBe('Main');
    const links = Array.from(nav.querySelectorAll('a'));
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      'Agenda',
      'Speakers',
    ]);
    expect(links[1].getAttribute('aria-current')).toBe('page');
    expect(links[0].hasAttribute('aria-current')).toBe(false);

    const actions = Array.from(element.querySelectorAll('.actions a'));
    expect(actions.map((action) => action.className)).toEqual([
      expect.stringContaining('gdg-button--primary'),
      expect.stringContaining('gdg-button--secondary'),
    ]);
  });

  it('toggles the menu and closes it on Escape', async () => {
    const { fixture, element } = await setup();
    const toggle = element.querySelector('.menu-toggle') as HTMLButtonElement;
    const menu = element.querySelector('.menu') as HTMLElement;
    expect(toggle.getAttribute('aria-controls')).toBe(menu.id);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(element.querySelector('gdg-navbar')?.classList).toContain(
      'gdg-navbar--open',
    );

    element
      .querySelector('gdg-navbar')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('leaves out the menu without links or actions', async () => {
    const { fixture, host, element } = await setup();
    host.links.set([]);
    host.actions.set([]);
    await fixture.whenStable();

    expect(element.querySelector('.menu-toggle')).toBeNull();
    expect(element.querySelector('nav')).toBeNull();
  });
});
