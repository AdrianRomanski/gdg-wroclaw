import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';

@Component({ template: '<h1>Contact</h1>' })
class StubPage {}

describe('App', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          { path: '', component: StubPage },
          { path: 'contact', component: StubPage },
        ]),
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const router = TestBed.inject(Router);
    return { fixture, element, router };
  }

  it('renders the navbar, main landmark and footer', async () => {
    const { element } = await setup();
    expect(
      element.querySelector('gdg-navbar nav')?.getAttribute('aria-label'),
    ).toBe('Main');
    expect(element.querySelector('main#main')).not.toBeNull();
    expect(element.querySelector('gdg-footer')).not.toBeNull();
  });

  it('routes same-origin links through the router', async () => {
    const { element, router } = await setup();
    const navigate = vi.spyOn(router, 'navigateByUrl');
    const contact = Array.from(element.querySelectorAll('a')).find(
      (a) => a.textContent?.trim() === 'Contact us',
    ) as HTMLAnchorElement;

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    contact.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(navigate).toHaveBeenCalledWith('/contact');
  });

  it('leaves external links and modified clicks to the browser', async () => {
    const { element, router } = await setup();
    const navigate = vi.spyOn(router, 'navigateByUrl');
    const register = Array.from(element.querySelectorAll('a')).find(
      (a) => a.textContent?.trim() === 'Register',
    ) as HTMLAnchorElement;
    const external = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    register.dispatchEvent(external);
    expect(external.defaultPrevented).toBe(false);

    const contact = Array.from(element.querySelectorAll('a')).find(
      (a) => a.textContent?.trim() === 'Contact us',
    ) as HTMLAnchorElement;
    const newTab = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
    });
    contact.dispatchEvent(newTab);
    expect(newTab.defaultPrevented).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('moves focus to main for the skip link without navigating', async () => {
    const { element, router } = await setup();
    const navigate = vi.spyOn(router, 'navigateByUrl');
    const skip = element.querySelector('.skip-link') as HTMLAnchorElement;
    skip.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );

    expect(navigate).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(element.querySelector('main'));
  });
});
