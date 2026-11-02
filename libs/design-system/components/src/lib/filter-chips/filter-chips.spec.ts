import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FilterChips, type FilterChip } from './filter-chips';

@Component({
  imports: [FilterChips],
  template: `<gdg-filter-chips
    label="Ścieżki"
    [chips]="chips"
    [allowEmpty]="allowEmpty()"
    [(value)]="value"
  />`,
})
class Host {
  readonly chips: FilterChip[] = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'ai', label: 'AI', appearance: 'tag', accent: 'red' },
    { value: 'generic', label: 'Generic', appearance: 'tag' },
  ];
  readonly value = signal<string | undefined>('all');
  readonly allowEmpty = signal(false);
}

describe('FilterChips', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const buttons = () =>
      Array.from(element.querySelectorAll<HTMLButtonElement>('button'));
    const pressed = () => buttons().map((b) => b.getAttribute('aria-pressed'));
    return {
      fixture,
      host: fixture.componentInstance,
      element,
      buttons,
      pressed,
    };
  }

  it('is a labelled group of toggle buttons', async () => {
    const { element, buttons, pressed } = await setup();
    const group = element.querySelector('gdg-filter-chips');
    expect(group?.getAttribute('role')).toBe('group');
    expect(group?.getAttribute('aria-label')).toBe('Ścieżki');
    expect(buttons().map((b) => b.textContent?.trim())).toEqual([
      'Wszystkie',
      'AI',
      'Generic',
    ]);
    expect(pressed()).toEqual(['true', 'false', 'false']);
  });

  it('draws a dot only for chips with an accent', async () => {
    const { buttons } = await setup();
    expect(buttons().map((b) => !!b.querySelector('.dot'))).toEqual([
      false,
      true,
      false,
    ]);
    expect(buttons()[1].dataset['appearance']).toBe('tag');
    expect(buttons()[0].dataset['appearance']).toBe('pill');
  });

  it('selects the pressed chip', async () => {
    const { fixture, host, buttons, pressed } = await setup();
    buttons()[1].click();
    await fixture.whenStable();
    expect(host.value()).toBe('ai');
    expect(pressed()).toEqual(['false', 'true', 'false']);
  });

  it('keeps the selection unless allowEmpty', async () => {
    const { fixture, host, buttons } = await setup();
    buttons()[0].click();
    await fixture.whenStable();
    expect(host.value()).toBe('all');

    host.allowEmpty.set(true);
    await fixture.whenStable();
    buttons()[0].click();
    await fixture.whenStable();
    expect(host.value()).toBeUndefined();
  });
});
