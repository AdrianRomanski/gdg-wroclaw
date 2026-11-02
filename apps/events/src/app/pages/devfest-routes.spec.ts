import { TestBed } from '@angular/core/testing';
import { DevfestAgendaRoute } from './devfest-agenda-route';
import { DevfestSpeakersRoute } from './devfest-speakers-route';
import { DEVFEST_ABSTRACTS } from '../content/devfest-abstracts';
import { DEVFEST_AGENDA, DEVFEST_SPEAKERS, photoOf } from '../content/devfest';
import { DEVFEST_BIOS } from '../content/devfest-bios';

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

  it('/devfest/speakers lists the 34 people', async () => {
    await TestBed.configureTestingModule({
      imports: [DevfestSpeakersRoute],
    }).compileComponents();
    const fixture = TestBed.createComponent(DevfestSpeakersRoute);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('gdg-speaker-card')).toHaveLength(33);
    expect(element.querySelectorAll('gdg-keynote-card')).toHaveLength(1);
    expect(text(element.querySelector('[role=radio][aria-checked=true]'))).toBe(
      'Wszyscy (34)',
    );
  });

  it('shows every bio on a speaker card', () => {
    const names = new Set(
      DEVFEST_SPEAKERS.speakers.groups.flatMap((g) =>
        (g.speakers ?? []).filter((s) => s.bio).map((s) => s.name),
      ),
    );
    expect(
      Object.keys(DEVFEST_BIOS).filter((name) => !names.has(name)),
    ).toEqual([]);
  });

  it('gives everyone on the programme a photo', () => {
    const people = DEVFEST_SPEAKERS.speakers.groups.flatMap((g) => [
      ...(g.speakers ?? []),
      ...(g.keynote?.speaker ? [g.keynote.speaker] : []),
    ]);
    expect(people).toHaveLength(34);
    const missing = people.filter((p) => p.photo !== photoOf(p.name));
    expect(missing.map((p) => p.name)).toEqual([]);
  });

  it('turns names into photo paths', () => {
    expect(photoOf('Jarosław Żołnowski')).toBe(
      '/speakers/jaroslaw-zolnowski.jpg',
    );
    expect(photoOf('Çalgan Aygün')).toBe('/speakers/calgan-aygun.jpg');
    expect(photoOf('Łukasz Jaźwa')).toBe('/speakers/lukasz-jazwa.jpg');
  });
});
