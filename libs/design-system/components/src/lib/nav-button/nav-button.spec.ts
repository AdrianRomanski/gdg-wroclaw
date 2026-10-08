import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavButton } from './nav-button';

@Component({
  imports: [NavButton],
  template: `
    <a gdg-nav-button href="/faq" [active]="active()" [disabled]="disabled()"
      >FAQ</a
    >
    <button gdg-nav-button type="button" [disabled]="disabled()">Menu</button>
  `,
})
class Host {
  readonly active = signal(false);
  readonly disabled = signal(false);
}

describe('NavButton', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      host: fixture.componentInstance,
      link: element.querySelector('a') as HTMLAnchorElement,
      button: element.querySelector('button') as HTMLButtonElement,
    };
  }

  it('projects its label', async () => {
    const { link } = await setup();
    expect(link.textContent?.trim()).toBe('FAQ');
    expect(link.classList).toContain('gdg-nav-button');
  });

  it('marks the current page with aria-current', async () => {
    const { fixture, host, link } = await setup();
    expect(link.hasAttribute('aria-current')).toBe(false);

    host.active.set(true);
    await fixture.whenStable();
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('disables links with aria-disabled and removes them from the tab order', async () => {
    const { fixture, host, link } = await setup();
    host.disabled.set(true);
    await fixture.whenStable();

    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('-1');
    expect(link.hasAttribute('disabled')).toBe(false);

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
  });

  it('disables buttons natively', async () => {
    const { fixture, host, button } = await setup();
    host.disabled.set(true);
    await fixture.whenStable();

    expect(button.disabled).toBe(true);
    expect(button.hasAttribute('aria-disabled')).toBe(false);
    expect(button.hasAttribute('tabindex')).toBe(false);
  });
});
