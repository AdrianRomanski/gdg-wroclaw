import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TimeMarker } from './time-marker';

async function render<T>(type: new () => T) {
  const fixture = TestBed.createComponent(type);
  await fixture.whenStable();
  return {
    fixture,
    host: fixture.componentInstance,
    element: fixture.nativeElement as HTMLElement,
  };
}

describe('TimeMarker', () => {
  @Component({
    imports: [TimeMarker],
    template: `<gdg-time-marker
      time="08:00 – 08:30"
      dateTime="2026-11-21T08:00"
    />`,
  })
  class Host {}

  it('shows the time with a decorative connector', async () => {
    const { element } = await render(Host);
    const time = element.querySelector('time') as HTMLTimeElement;
    expect(time.textContent).toBe('08:00 – 08:30');
    expect(time.getAttribute('datetime')).toBe('2026-11-21T08:00');
    expect(
      element.querySelector('.connector')?.getAttribute('aria-hidden'),
    ).toBe('true');
  });
});
