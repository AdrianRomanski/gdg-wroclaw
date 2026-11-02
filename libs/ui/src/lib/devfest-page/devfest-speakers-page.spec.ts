import { TestBed } from '@angular/core/testing';
import { DevfestSpeakersPage } from './devfest-speakers-page';
import { SAMPLE_SPEAKERS_PAGE } from './devfest-page.stories-data';

describe('DevfestSpeakersPage', () => {
  async function setup() {
    const fixture = TestBed.createComponent(DevfestSpeakersPage);
    fixture.componentRef.setInput('content', SAMPLE_SPEAKERS_PAGE);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (name: string) => {
      (
        Array.from(element.querySelectorAll('button')).find(
          (b) => b.textContent?.trim() === name,
        ) as HTMLButtonElement
      ).click();
      await fixture.whenStable();
    };
    const names = () =>
      Array.from(element.querySelectorAll('gdg-speaker-card h3')).map(
        (h) => h.textContent,
      );
    const headings = () =>
      Array.from(element.querySelectorAll('h2')).map((h) => h.textContent);
    return { element, click, names, headings };
  }

  it('lists every group with the keynote first and counts everyone', async () => {
    const { element, names, headings } = await setup();
    expect(headings()).toEqual([
      'Prelegenci & Prowadzący',
      'Prowadzący paneli',
      'Paneliści & prelegenci',
      'Trenerzy warsztatów',
    ]);
    expect(element.querySelector('gdg-keynote-card h3')?.textContent).toBe(
      'Who Let the Dogs Out? The State of AI Robotics',
    );
    expect(names()).toEqual([
      'Dawid Perdek',
      'Michał Jabłoński',
      'Paweł Kubiak',
      'Mathias Weber',
    ]);
    expect(
      element.querySelector('[role=radio][aria-checked=true]')?.textContent,
    ).toContain('Wszyscy (5)');
    expect(element.querySelector('gdg-devfest-note')?.textContent).toContain(
      'Lista trenerów warsztatów pojawi się tutaj.',
    );
  });

  it('offers the tracks of the listed people, Generic last', async () => {
    const { element } = await setup();
    expect(
      Array.from(element.querySelectorAll('gdg-filter-chips button')).map((b) =>
        b.textContent?.trim(),
      ),
    ).toEqual(['AI', 'Cloud', 'Generic']);
  });

  it('shows one role group', async () => {
    const { click, names, headings } = await setup();
    await click('Paneliści');
    expect(headings()).toEqual([
      'Prelegenci & Prowadzący',
      'Paneliści & prelegenci',
    ]);
    expect(names()).toEqual(['Paweł Kubiak', 'Mathias Weber']);
  });

  it('filters by track, drops empty groups, and clears again', async () => {
    const { click, names, headings } = await setup();
    await click('AI');
    expect(names()).toEqual(['Dawid Perdek', 'Paweł Kubiak']);
    await click('Cloud');
    expect(names()).toEqual(['Michał Jabłoński']);
    expect(headings()).not.toContain('Paneliści & prelegenci');
    await click('Cloud');
    expect(names()).toHaveLength(4);
  });
});
