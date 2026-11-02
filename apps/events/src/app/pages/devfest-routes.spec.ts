import { TestBed } from '@angular/core/testing';
import { DevfestAgendaRoute } from './devfest-agenda-route';
import { DevfestSpeakersRoute } from './devfest-speakers-route';

describe('DevFest routes', () => {
  const text = (element: Element | null) =>
    element?.textContent?.replace(/\s+/g, ' ').trim();

  it('/devfest shows day 1, or day 2 with ?day=2', async () => {
    await TestBed.configureTestingModule({
      imports: [DevfestAgendaRoute],
    }).compileComponents();
    const fixture = TestBed.createComponent(DevfestAgendaRoute);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(text(element.querySelector('h1'))).toBe(
      'DevFest Wrocław 2026 — Harmonogram',
    );
    expect(
      element.querySelectorAll('gdg-main-stage-timeline > ol > li'),
    ).toHaveLength(7);
    expect(element.querySelectorAll('gdg-discussion-panel')).toHaveLength(4);

    fixture.componentRef.setInput('day', '2');
    await fixture.whenStable();
    expect(element.querySelector('gdg-main-stage-timeline')).toBeNull();
    expect(element.querySelectorAll('gdg-schedule-event')).toHaveLength(4);
    expect(element.querySelectorAll('gdg-presentation-card')).toHaveLength(19);
  });

  it('/devfest/speakers lists the 29 people', async () => {
    await TestBed.configureTestingModule({
      imports: [DevfestSpeakersRoute],
    }).compileComponents();
    const fixture = TestBed.createComponent(DevfestSpeakersRoute);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('gdg-speaker-card')).toHaveLength(28);
    expect(element.querySelectorAll('gdg-keynote-card')).toHaveLength(1);
    expect(text(element.querySelector('[role=radio][aria-checked=true]'))).toBe(
      'Wszyscy (29)',
    );
  });
});
