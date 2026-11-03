import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { DevfestTalk } from '../devfest-session/devfest-session';
import { PresentationCard } from './presentation-card';

@Component({
  imports: [PresentationCard],
  template: `<gdg-presentation-card [talk]="talk()" [(expanded)]="expanded" />`,
})
class Host {
  readonly talk = signal<DevfestTalk>({
    title: 'Gemini in production',
    track: 'mobile',
    time: '08:00 – 08:30',
    dateTime: '2026-11-21T08:00',
    room: 'Room A',
    description: 'A short teaser.',
    abstract: 'The long abstract.',
    speakers: [{ name: 'Grace Hopper' }],
  });
  readonly expanded = signal(false);
}

describe('PresentationCard', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      host: fixture.componentInstance,
      element,
      card: element.querySelector('gdg-presentation-card') as HTMLElement,
      button: () => element.querySelector('button') as HTMLButtonElement,
      abstract: () => element.querySelector('.abstract') as HTMLElement,
    };
  }

  it('shows the track, time, room, title, description and speakers', async () => {
    const { element, card } = await setup();
    expect(card.dataset['track']).toBe('mobile');
    const tag = element.querySelector('gdg-tag') as HTMLElement;
    expect(tag.textContent?.trim()).toBe('Mobile');
    expect(tag.dataset['accent']).toBe('green');
    expect(element.querySelector('time')?.getAttribute('datetime')).toBe(
      '2026-11-21T08:00',
    );
    expect(element.querySelector('.when')?.textContent).toContain('Room A');
    expect(element.querySelector('h3')?.textContent).toBe(
      'Gemini in production',
    );
    expect(element.querySelector('.description')?.textContent).toBe(
      'A short teaser.',
    );
    expect(element.querySelector('.speaker')?.textContent).toContain(
      'Grace Hopper',
    );
    expect(element.querySelector('gdg-avatar')?.textContent).toBe('GH');
  });

  it('expands and collapses the abstract', async () => {
    const { fixture, host, button, abstract } = await setup();
    expect(abstract().hidden).toBe(true);
    expect(button().getAttribute('aria-expanded')).toBe('false');
    expect(button().getAttribute('aria-controls')).toBe(abstract().id);
    expect(button().textContent).toContain('Show abstract');
    expect(button().classList).toContain('gdg-button--green');

    button().click();
    await fixture.whenStable();

    expect(host.expanded()).toBe(true);
    expect(abstract().hidden).toBe(false);
    expect(abstract().textContent).toContain('The long abstract.');
    expect(button().getAttribute('aria-expanded')).toBe('true');
    expect(button().textContent).toContain('Hide abstract');
  });

  it('has no tag for a generic session, no button without an abstract, and a blue button for Robotics', async () => {
    const { fixture, host, element } = await setup();
    host.talk.set({ title: 'Lunch talk', track: 'generic' });
    await fixture.whenStable();

    expect(element.querySelector('gdg-tag')).toBeNull();
    expect(element.querySelector('button')).toBeNull();
    expect(element.querySelector('.speakers')).toBeNull();

    host.talk.set({ title: 'Lunch talk', track: 'robotics', abstract: 'x' });
    await fixture.whenStable();
    expect(element.querySelector('button')?.classList).toContain(
      'gdg-button--blue',
    );
  });
});
