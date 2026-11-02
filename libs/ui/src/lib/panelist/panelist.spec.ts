import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Panelist } from './panelist';

async function render<T>(type: new () => T) {
  const fixture = TestBed.createComponent(type);
  await fixture.whenStable();
  return {
    fixture,
    host: fixture.componentInstance,
    element: fixture.nativeElement as HTMLElement,
  };
}

describe('Panelist', () => {
  @Component({
    imports: [Panelist],
    template: `<gdg-panelist
      [person]="{ name: 'Grace Hopper' }"
      layout="inline"
    />`,
  })
  class Host {}

  it('shows the initials and the name in the chosen layout', async () => {
    const { element } = await render(Host);
    const panelist = element.querySelector('gdg-panelist') as HTMLElement;
    expect(panelist.dataset['layout']).toBe('inline');
    expect(panelist.querySelector('gdg-avatar')?.textContent).toBe('GH');
    expect(panelist.querySelector('.name')?.textContent).toBe('Grace Hopper');
  });
});
