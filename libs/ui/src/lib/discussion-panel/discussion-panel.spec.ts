import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { DevfestPanel } from '../devfest-session/devfest-session';
import { defaultPanelistsLabel, DiscussionPanel } from './discussion-panel';

@Component({
  imports: [DiscussionPanel],
  template: `<gdg-discussion-panel [panel]="panel()" />`,
})
class Host {
  readonly panel = signal<DevfestPanel>({
    title: 'AI Panel',
    track: 'cloud',
    time: '16:00',
    room: 'Scena Główna',
    host: { name: 'Ada Lovelace' },
    panelists: [{ name: 'Grace Hopper' }, { name: 'Alan Turing' }],
  });
}

describe('DiscussionPanel', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return { fixture, host: fixture.componentInstance, element };
  }

  it('shows the tags, title, host and labelled panelist list', async () => {
    const { element } = await setup();
    const tags = Array.from(element.querySelectorAll('.labels gdg-tag'));
    expect(tags.map((t) => t.textContent?.trim())).toEqual([
      '16:00',
      'Cloud',
      'Scena Główna',
    ]);
    expect(element.querySelector('h3')?.textContent).toBe('AI Panel');
    expect(element.querySelector('.moderator')?.textContent).toContain(
      'Ada Lovelace',
    );
    expect(element.querySelector('.moderator')?.textContent).toContain(
      'Prowadzący / Host',
    );
    const list = element.querySelector('.panelists') as HTMLElement;
    const label = element.querySelector(
      `#${list.getAttribute('aria-labelledby')}`,
    );
    expect(label?.textContent).toBe('Paneliści / 2 osoby');
    // Faces read at a glance: an L host and XL panelists (ADR-0033).
    expect(
      (element.querySelector('.moderator gdg-avatar') as HTMLElement).dataset[
        'size'
      ],
    ).toBe('l');
    expect(
      Array.from(list.querySelectorAll('gdg-avatar')).map(
        (a) => (a as HTMLElement).dataset['size'],
      ),
    ).toEqual(['xl', 'xl']);
    expect(
      Array.from(list.querySelectorAll('.name')).map((n) => n.textContent),
    ).toEqual(['Grace Hopper', 'Alan Turing']);
  });

  it('leaves out the host and list when missing', async () => {
    const { fixture, host, element } = await setup();
    host.panel.set({ title: 'Panel', track: 'generic', panelists: [] });
    await fixture.whenStable();

    expect(element.querySelector('.moderator')).toBeNull();
    expect(element.querySelector('.panelists')).toBeNull();
    expect(element.querySelectorAll('.labels gdg-tag')).toHaveLength(0);
  });

  it('declines "osoba" in Polish', () => {
    expect(defaultPanelistsLabel(1)).toBe('Paneliści / 1 osoba');
    expect(defaultPanelistsLabel(3)).toBe('Paneliści / 3 osoby');
    expect(defaultPanelistsLabel(5)).toBe('Paneliści / 5 osób');
    expect(defaultPanelistsLabel(12)).toBe('Paneliści / 12 osób');
    expect(defaultPanelistsLabel(22)).toBe('Paneliści / 22 osoby');
  });
});
