import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type EventDay, EventsSection } from './events-section';

@Component({
  imports: [EventsSection],
  template: `<gdg-events-section
    [days]="days"
    (dayChange)="changes.push($event)"
  />`,
})
class Host {
  readonly days: EventDay[] = [
    {
      label: '29.06',
      ariaLabel: '29 June',
      events: [{ title: 'Kotlin' }, { title: 'Flutter' }],
    },
    { label: '30.06', events: [{ title: 'Angular' }] },
    { label: '01.07', events: [] },
  ];
  readonly changes: number[] = [];
}

describe('EventsSection', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const tabs = () =>
      Array.from(element.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const titles = () =>
      Array.from(element.querySelectorAll('h3')).map((h) => h.textContent);
    return { fixture, host: fixture.componentInstance, element, tabs, titles };
  }

  it('renders the title, the day tabs and the first day', async () => {
    const { element, tabs, titles } = await setup();
    expect(element.querySelector('h2')?.textContent).toBe('Event');
    expect(
      element.querySelector('[role="tablist"]')?.getAttribute('aria-label'),
    ).toBe('Event days');
    expect(tabs().map((tab) => tab.textContent?.trim())).toEqual([
      '29.06',
      '30.06',
      '01.07',
    ]);
    expect(tabs()[0].getAttribute('aria-label')).toBe('29 June');
    expect(tabs().map((tab) => tab.getAttribute('aria-selected'))).toEqual([
      'true',
      'false',
      'false',
    ]);
    expect(tabs().map((tab) => tab.tabIndex)).toEqual([0, -1, -1]);

    const panel = element.querySelector('[role="tabpanel"]') as HTMLElement;
    expect(panel.getAttribute('aria-labelledby')).toBe(tabs()[0].id);
    expect(tabs()[0].getAttribute('aria-controls')).toBe(panel.id);
    expect(titles()).toEqual(['Kotlin', 'Flutter']);
  });

  it('selects a day on click and reports it', async () => {
    const { fixture, host, tabs, titles } = await setup();
    tabs()[1].click();
    await fixture.whenStable();

    expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
    expect(titles()).toEqual(['Angular']);
    expect(host.changes).toEqual([1]);
  });

  it('moves between days with the arrow keys, Home and End', async () => {
    const { fixture, tabs, element } = await setup();
    const press = async (key: string) => {
      (document.activeElement as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true }),
      );
      await fixture.whenStable();
    };
    tabs()[0].focus();

    await press('ArrowLeft');
    expect(document.activeElement).toBe(tabs()[2]);
    expect(element.querySelector('.empty')?.textContent).toBe(
      'No events on this day.',
    );

    await press('Home');
    expect(document.activeElement).toBe(tabs()[0]);
    await press('ArrowRight');
    expect(document.activeElement).toBe(tabs()[1]);
    await press('End');
    expect(tabs()[2].getAttribute('aria-selected')).toBe('true');
  });
});
