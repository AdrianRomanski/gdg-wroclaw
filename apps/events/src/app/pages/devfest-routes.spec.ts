import { TestBed } from '@angular/core/testing';
import { DevfestAgendaRoute } from './devfest-agenda-route';
import { DevfestSpeakersRoute } from './devfest-speakers-route';
import { DEVFEST_ABSTRACTS } from '../content/devfest-abstracts';
import { DEVFEST_AGENDA } from '../content/devfest';

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
    ).toHaveLength(8);
    expect(element.querySelectorAll('gdg-discussion-panel')).toHaveLength(4);

    fixture.componentRef.setInput('day', '2');
    await fixture.whenStable();
    expect(element.querySelector('gdg-main-stage-timeline')).toBeNull();
    expect(element.querySelectorAll('gdg-schedule-event')).toHaveLength(4);
    expect(element.querySelectorAll('gdg-presentation-card')).toHaveLength(18);

    Array.from(element.querySelectorAll('button'))
      .find((b) => b.textContent?.trim() === 'Warsztaty (Hands-on Labs)')
      ?.click();
    await fixture.whenStable();
    expect(element.querySelectorAll('gdg-schedule-event')).toHaveLength(4);
    expect(element.querySelectorAll('gdg-presentation-card')).toHaveLength(10);
    expect(element.querySelector('gdg-devfest-note')).toBeNull();
  });

  it('uses every published abstract', () => {
    const { mainStage, parallel } = DEVFEST_AGENDA.agenda;
    const used = new Set([
      ...mainStage.sessions.flatMap((s) =>
        'keynote' in s ? [s.keynote.abstract] : [],
      ),
      ...[...parallel.entries, ...(parallel.workshops ?? [])].flatMap((e) =>
        e.type === 'slot' ? e.talks.map((t) => t?.abstract) : [],
      ),
    ]);
    for (const [title, abstract] of Object.entries(DEVFEST_ABSTRACTS)) {
      expect({ title, used: used.has(abstract) }).toEqual({
        title,
        used: true,
      });
    }
  });

  it('/devfest/speakers lists the 35 people', async () => {
    await TestBed.configureTestingModule({
      imports: [DevfestSpeakersRoute],
    }).compileComponents();
    const fixture = TestBed.createComponent(DevfestSpeakersRoute);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('gdg-speaker-card')).toHaveLength(34);
    expect(element.querySelectorAll('gdg-keynote-card')).toHaveLength(1);
    expect(text(element.querySelector('[role=radio][aria-checked=true]'))).toBe(
      'Wszyscy (35)',
    );
  });
});
