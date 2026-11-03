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
    description: 'What the panel is about.',
    topics: ['First topic', 'Second topic'],
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
    // The host is as large as the panelists, all with whole square photos (ADR-0034).
    const hostAvatar = element.querySelector(
      '.moderator gdg-avatar',
    ) as HTMLElement;
    expect(hostAvatar.dataset['size']).toBe('xl');
    expect(hostAvatar.dataset['shape']).toBe('square');
    expect(
      Array.from(element.querySelectorAll('gdg-avatar:not(dialog *)')).map(
        (a) => (a as HTMLElement).dataset['shape'],
      ),
    ).toEqual(['square', 'square', 'square']);
    expect(
      Array.from(list.querySelectorAll('gdg-avatar:not(dialog *)')).map(
        (a) => (a as HTMLElement).dataset['size'],
      ),
    ).toEqual(['xl', 'xl']);
    expect(
      Array.from(list.querySelectorAll('.name:not(dialog *)')).map(
        (n) => n.textContent,
      ),
    ).toEqual(['Grace Hopper', 'Alan Turing']);
  });

  it('describes the panel and lists its topics beside the host', async () => {
    const { element } = await setup();
    const about = element.querySelector('.moderator .about') as HTMLElement;
    expect(about.querySelector('.description')?.textContent).toBe(
      'What the panel is about.',
    );
    const topics = about.querySelector('.topics') as HTMLElement;
    expect(
      element.querySelector(`#${topics.getAttribute('aria-labelledby')}`)
        ?.textContent,
    ).toBe('O czym porozmawiamy');
    expect(
      Array.from(topics.querySelectorAll('li')).map((li) => li.textContent),
    ).toEqual(['First topic', 'Second topic']);
  });

  it('gives everyone a bio button, with a note when the bio is still missing', async () => {
    const { fixture, host, element } = await setup();
    host.panel.update((panel) => ({
      ...panel,
      panelists: [
        { name: 'Grace Hopper', bio: ['Rear admiral and compiler pioneer.'] },
        { name: 'Alan Turing' },
      ],
    }));
    await fixture.whenStable();

    const buttons = Array.from(
      element.querySelectorAll<HTMLButtonElement>('button.open'),
    );
    expect(buttons.map((b) => b.getAttribute('aria-label'))).toEqual([
      'Pokaż bio: Ada Lovelace',
      'Pokaż bio: Grace Hopper',
      'Pokaż bio: Alan Turing',
    ]);
    const dialogs = Array.from(element.querySelectorAll('dialog'));
    expect(dialogs[1].querySelector('.bio')?.textContent).toContain(
      'Rear admiral and compiler pioneer.',
    );
    expect(dialogs[2].querySelector('.empty')?.textContent).toBe(
      'Bio pojawi się wkrótce.',
    );
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
