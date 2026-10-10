import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EventCard } from './event-card';
import type { GdgEvent } from './gdg-event';

@Component({
  imports: [EventCard],
  template: `<gdg-event-card [event]="event()" />`,
})
class Host {
  readonly event = signal<GdgEvent>({
    title: 'DevFest',
    time: '18:00',
    dateTime: '2026-06-29T18:00',
    location: 'Wrocław',
    description: 'The biggest event of the year.',
    tag: 'Sold out',
    href: '/events/devfest',
  });
}

describe('EventCard', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return {
      fixture,
      host: fixture.componentInstance,
      element: fixture.nativeElement as HTMLElement,
    };
  }

  it('shows the title, tag, time, location, description and link', async () => {
    const { element } = await setup();
    const title = element.querySelector('h3') as HTMLElement;
    expect(title.textContent).toBe('DevFest');
    expect(element.querySelector('.tag')?.textContent).toBe('Sold out');
    const time = element.querySelector('time') as HTMLTimeElement;
    expect(time.textContent).toBe('18:00');
    expect(time.getAttribute('datetime')).toBe('2026-06-29T18:00');
    expect(element.querySelector('.meta')?.textContent).toContain('Wrocław');
    expect(
      element.querySelector('.separator')?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(element.querySelector('.description')?.textContent).toBe(
      'The biggest event of the year.',
    );
    const link = element.querySelector('a') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('Read more');
    expect(link.getAttribute('href')).toBe('/events/devfest');
    expect(link.getAttribute('aria-describedby')).toBe(title.id);
  });

  it('leaves out missing parts', async () => {
    const { fixture, host, element } = await setup();
    host.event.set({ title: 'Meetup' });
    await fixture.whenStable();

    for (const selector of ['.tag', '.meta', '.description', 'a']) {
      expect(element.querySelector(selector)).toBeNull();
    }
  });
});
