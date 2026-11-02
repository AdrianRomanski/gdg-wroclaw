import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SegmentedControl, type SegmentedOption } from './segmented-control';

@Component({
  imports: [SegmentedControl],
  template: `<gdg-segmented-control
    label="Day"
    [options]="options"
    [(value)]="value"
  />`,
})
class Host {
  readonly options: SegmentedOption[] = [
    { value: 'd1', label: 'Day 1' },
    { value: 'd2', label: 'Day 2' },
    { value: 'd3', label: 'Day 3' },
  ];
  readonly value = signal<string | undefined>('d1');
}

describe('SegmentedControl', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const radios = () =>
      Array.from(element.querySelectorAll<HTMLButtonElement>('[role=radio]'));
    return {
      fixture,
      host: fixture.componentInstance,
      group: element.querySelector('gdg-segmented-control') as HTMLElement,
      radios,
    };
  }

  const checked = (radios: HTMLButtonElement[]) =>
    radios.map((r) => r.getAttribute('aria-checked'));

  it('is a labelled radio group with one tab stop', async () => {
    const { group, radios } = await setup();
    expect(group.getAttribute('role')).toBe('radiogroup');
    expect(group.getAttribute('aria-label')).toBe('Day');
    expect(radios().map((r) => r.textContent?.trim())).toEqual([
      'Day 1',
      'Day 2',
      'Day 3',
    ]);
    expect(checked(radios())).toEqual(['true', 'false', 'false']);
    expect(radios().map((r) => r.tabIndex)).toEqual([0, -1, -1]);
  });

  it('selects on click', async () => {
    const { fixture, host, radios } = await setup();
    radios()[1].click();
    await fixture.whenStable();

    expect(host.value()).toBe('d2');
    expect(checked(radios())).toEqual(['false', 'true', 'false']);
    expect(radios().map((r) => r.tabIndex)).toEqual([-1, 0, -1]);
  });

  it('moves the selection with the arrow keys, wrapping, and Home/End', async () => {
    const { fixture, host, radios } = await setup();
    const press = async (key: string) => {
      const current = radios().find((r) => r.tabIndex === 0) as HTMLElement;
      current.dispatchEvent(new KeyboardEvent('keydown', { key }));
      await fixture.whenStable();
    };

    await press('ArrowLeft');
    expect(host.value()).toBe('d3');
    expect(document.activeElement).toBe(radios()[2]);
    await press('ArrowRight');
    expect(host.value()).toBe('d1');
    await press('End');
    expect(host.value()).toBe('d3');
    await press('Home');
    expect(host.value()).toBe('d1');
  });

  it('makes the first option the tab stop when nothing is selected', async () => {
    const { fixture, host, radios } = await setup();
    host.value.set(undefined);
    await fixture.whenStable();

    expect(checked(radios())).toEqual(['false', 'false', 'false']);
    expect(radios()[0].tabIndex).toBe(0);
  });
});
