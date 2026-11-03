import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { DevfestKeynote } from '../devfest-session/devfest-session';
import { KeynoteCard } from './keynote-card';

const SAMPLE_KEYNOTE: DevfestKeynote = {
  title: 'Who Let the Dogs Out? The State of AI Robotics',
  time: '15:50',
  room: 'Main Stage',
  abstract: 'Abstract',
  speaker: { name: 'First Last', initials: 'OT' },
};

async function render<T>(type: new () => T) {
  const fixture = TestBed.createComponent(type);
  await fixture.whenStable();
  return {
    fixture,
    host: fixture.componentInstance,
    element: fixture.nativeElement as HTMLElement,
  };
}

describe('KeynoteCard', () => {
  @Component({
    imports: [KeynoteCard],
    template: `<gdg-keynote-card [keynote]="keynote" />`,
  })
  class Host {
    readonly keynote = SAMPLE_KEYNOTE;
  }

  it('shows the time, type and room tags, title, abstract and speaker', async () => {
    const { element } = await render(Host);
    expect(
      Array.from(element.querySelectorAll('gdg-tag')).map((t) =>
        t.textContent?.trim(),
      ),
    ).toEqual(['15:50', 'Keynote', 'Main Stage']);
    expect(element.querySelector('h3')?.textContent).toBe(SAMPLE_KEYNOTE.title);
    expect(element.querySelector('.abstract')?.textContent).toBe('Abstract');
    expect(element.querySelector('.speaker')?.textContent).toContain(
      'First Last',
    );
    // As large as a panelist, whole photo, with a bio button (ADR-0034).
    const avatar = element.querySelector('.speaker gdg-avatar') as HTMLElement;
    expect(avatar.dataset['size']).toBe('xl');
    expect(avatar.dataset['shape']).toBe('square');
    expect(
      element.querySelector('.speaker button')?.getAttribute('aria-label'),
    ).toBe('Show bio: First Last');
  });

  @Component({
    imports: [KeynoteCard],
    template: `<gdg-keynote-card [keynote]="keynote" />`,
  })
  class RoboticsHost {
    readonly keynote: DevfestKeynote = { ...SAMPLE_KEYNOTE, track: 'robotics' };
  }

  it('takes the track color and adds the track tag (ADR-0035)', async () => {
    const { element } = await render(RoboticsHost);
    const card = element.querySelector('gdg-keynote-card') as HTMLElement;
    expect(card.dataset['track']).toBe('robotics');
    expect(
      Array.from(element.querySelectorAll('.labels gdg-tag')).map((t) =>
        t.textContent?.trim(),
      ),
    ).toEqual(['15:50', 'Keynote', 'Robotics', 'Main Stage']);
  });

  it('stays brand blue without a track', async () => {
    const { element } = await render(Host);
    expect(
      (element.querySelector('gdg-keynote-card') as HTMLElement).hasAttribute(
        'data-track',
      ),
    ).toBe(false);
  });
});
