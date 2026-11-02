import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { DevfestScheduleItem } from '../devfest-session/devfest-session';
import { ScheduleEvent } from './schedule-event';

const SAMPLE_BREAK: DevfestScheduleItem = {
  type: 'break',
  title: 'Przerwa obiadowa',
  time: '12:30',
  rooms: 'Sala A + Sala B',
};

const SAMPLE_OPENING: DevfestScheduleItem = {
  type: 'shared',
  title: 'Otwarcie eventu',
  time: '07:30',
  rooms: 'Sala A + Sala B',
};

async function render<T>(type: new () => T) {
  const fixture = TestBed.createComponent(type);
  await fixture.whenStable();
  return {
    fixture,
    host: fixture.componentInstance,
    element: fixture.nativeElement as HTMLElement,
  };
}

describe('ScheduleEvent', () => {
  @Component({
    imports: [ScheduleEvent],
    template: `<gdg-schedule-event [item]="item()" />`,
  })
  class Host {
    readonly item = signal<DevfestScheduleItem>(SAMPLE_OPENING);
  }

  it('shows a shared event with a flag and a break with a fork and knife', async () => {
    const { fixture, host, element } = await render(Host);
    const event = element.querySelector('gdg-schedule-event') as HTMLElement;
    expect(event.dataset['type']).toBe('shared');
    expect(element.querySelector('h3')?.textContent).toBe('Otwarcie eventu');
    expect(element.querySelector('time')?.textContent).toBe('07:30');
    expect(element.querySelector('.rooms')?.textContent).toBe(
      'Sala A + Sala B',
    );
    expect(element.querySelector('gdg-icon')?.getAttribute('aria-hidden')).toBe(
      'true',
    );

    host.item.set({ ...SAMPLE_BREAK, rooms: undefined });
    await fixture.whenStable();
    expect(event.dataset['type']).toBe('break');
    expect(element.querySelector('.rooms')).toBeNull();
  });
});
