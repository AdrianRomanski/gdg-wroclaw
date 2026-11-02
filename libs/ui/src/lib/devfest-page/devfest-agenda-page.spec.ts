import { TestBed } from '@angular/core/testing';
import { DevfestAgendaPage } from './devfest-agenda-page';
import { SAMPLE_AGENDA_PAGE } from './devfest-page.stories-data';

describe('DevfestAgendaPage', () => {
  async function setup() {
    const fixture = TestBed.createComponent(DevfestAgendaPage);
    fixture.componentRef.setInput('content', SAMPLE_AGENDA_PAGE);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const button = (name: string) =>
      Array.from(element.querySelectorAll('button')).find(
        (b) => b.textContent?.trim() === name,
      ) as HTMLButtonElement;
    const click = async (name: string) => {
      button(name).click();
      await fixture.whenStable();
    };
    const titles = (selector: string) =>
      Array.from(element.querySelectorAll(`${selector} h3`)).map((h) =>
        h.textContent?.trim(),
      );
    return { fixture, element, button, click, titles };
  }

  it('shows the hero, a hidden h1 and day 1 labelled by its heading', async () => {
    const { element, titles } = await setup();
    expect(element.querySelector('h1')?.textContent).toBe(
      'DevFest Wrocław 2026 — Harmonogram',
    );
    expect(element.querySelector('gdg-devfest-hero img')).not.toBeNull();
    expect(
      element.querySelector('gdg-devfest-hero a')?.textContent?.trim(),
    ).toBe('Zarejestruj się');
    const section = element.querySelector('section[aria-labelledby]');
    const id = section?.getAttribute('aria-labelledby') ?? '';
    expect(element.querySelector(`#${id}`)?.textContent).toBe(
      'Harmonogram & Sceny',
    );
    expect(element.querySelector('gdg-devfest-agenda')?.id).toBe('agenda');
    expect(titles('gdg-main-stage-timeline')).toEqual([
      'Who Let the Dogs Out? The State of AI Robotics',
      'AI Panel',
      'Web Panel',
    ]);
    expect(element.querySelector('gdg-parallel-schedule')).toBeNull();
  });

  it('filters day 1 by track and keeps the keynotes', async () => {
    const { click, titles, button } = await setup();
    await click('Web');
    expect(button('Web').getAttribute('aria-pressed')).toBe('true');
    expect(titles('gdg-main-stage-timeline')).toEqual([
      'Who Let the Dogs Out? The State of AI Robotics',
      'Web Panel',
    ]);
  });

  it('switches to day 2 with rooms, events and talks', async () => {
    const { element, click, titles } = await setup();
    await click('Dzień 2: Warsztaty & Prezentacje');
    expect(element.querySelector('gdg-main-stage-timeline')).toBeNull();
    expect(
      Array.from(element.querySelectorAll('.room')).map((r) => r.textContent),
    ).toEqual(['Sala A', 'Sala B']);
    expect(element.querySelectorAll('gdg-schedule-event')).toHaveLength(2);
    expect(element.querySelectorAll('gdg-presentation-card')).toHaveLength(5);
    expect(element.querySelector('.grouped-time')?.textContent).toBe(
      '09:10 - 09:40 / 09:45 - 10:15',
    );

    await click('Robotyka');
    expect(titles('gdg-parallel-schedule')).toEqual([
      'Otwarcie eventu',
      'Topic: TBA',
      'PRZERWA JEDZENIOWA',
    ]);
  });

  it('marks the cells of the other rooms for the narrow Room toggle', async () => {
    const { element, click } = await setup();
    await click('Dzień 2: Warsztaty & Prezentacje');
    const otherRoom = () =>
      Array.from(element.querySelectorAll('.cell')).map((c) =>
        c.classList.contains('cell--other-room'),
      );
    expect(otherRoom().slice(0, 2)).toEqual([false, true]);
    await click('Sala B');
    expect(otherRoom().slice(0, 2)).toEqual([true, false]);
    // The 17:25 slot has nothing in Sala B.
    const slots = element.querySelectorAll('.slot');
    expect(slots[2].classList.contains('slot--other-room')).toBe(true);
  });

  it('shows the workshop note in the workshops format', async () => {
    const { element, click } = await setup();
    await click('Dzień 2: Warsztaty & Prezentacje');
    await click('Warsztaty (Hands-on Labs)');
    expect(element.querySelector('gdg-parallel-schedule')).toBeNull();
    expect(element.querySelector('gdg-devfest-note')?.textContent).toContain(
      'Harmonogram warsztatów pojawi się tutaj.',
    );
  });
});
