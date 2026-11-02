import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { DevfestSpeaker } from '../devfest-session/devfest-session';
import { SpeakerCard } from './speaker-card';

const SAMPLE_SPEAKER: DevfestSpeaker = {
  name: 'Imię Nazwisko',
  track: 'ai',
  role: 'Rola · panel',
  talk: 'Tytuł prezentacji',
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

describe('SpeakerCard', () => {
  @Component({
    imports: [SpeakerCard],
    template: `<gdg-speaker-card [speaker]="speaker" />`,
  })
  class Host {
    readonly speaker = { ...SAMPLE_SPEAKER, track: 'web' as const };
  }

  it('shows the avatar ringed in the track color, the tag, name, role and talk', async () => {
    const { element } = await render(Host);
    const avatar = element.querySelector('gdg-avatar') as HTMLElement;
    expect(avatar.dataset['size']).toBe('m');
    expect(avatar.dataset['accent']).toBe('yellow');
    expect(element.querySelector('gdg-tag')?.textContent?.trim()).toBe('Web');
    expect(element.querySelector('h3')?.textContent).toBe('Imię Nazwisko');
    expect(element.querySelector('.role')?.textContent).toBe('Rola · panel');
    expect(element.querySelector('.talk')?.textContent).toBe(
      'Tytuł prezentacji',
    );
  });
});
