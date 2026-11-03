import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { DevfestSpeaker } from '../devfest-session/devfest-session';
import { SpeakerCard } from './speaker-card';

const SAMPLE_SPEAKER: DevfestSpeaker = {
  name: 'First Last',
  track: 'ai',
  role: 'Rola · panel',
  talk: 'Talk title',
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
    expect(avatar.dataset['size']).toBe('xl');
    expect(avatar.dataset['shape']).toBe('square');
    expect(avatar.dataset['accent']).toBe('yellow');
    expect(element.querySelector('gdg-tag')?.textContent?.trim()).toBe('Web');
    expect(element.querySelector('h3')?.textContent).toBe('First Last');
    expect(element.querySelector('.role')?.textContent).toBe('Rola · panel');
    expect(element.querySelector('.talk')?.textContent).toBe('Talk title');
  });

  it('shows one line per role for someone with several roles', async () => {
    @Component({
      imports: [SpeakerCard],
      template: `<gdg-speaker-card [speaker]="speaker" />`,
    })
    class MultiRoleHost {
      readonly speaker: DevfestSpeaker = {
        ...SAMPLE_SPEAKER,
        role: ['Panelist · AI panel', 'Speaker · AI talk'],
      };
    }
    const { element } = await render(MultiRoleHost);
    expect(
      Array.from(element.querySelectorAll('.role')).map((p) => p.textContent),
    ).toEqual(['Panelist · AI panel', 'Speaker · AI talk']);
  });

  it('shows the bio behind a disclosure button', async () => {
    @Component({
      imports: [SpeakerCard],
      template: `<gdg-speaker-card [speaker]="speaker" />`,
    })
    class BioHost {
      readonly speaker: DevfestSpeaker = {
        ...SAMPLE_SPEAKER,
        bio: ['First paragraph.', 'Second paragraph.'],
      };
    }
    const { fixture, element } = await render(BioHost);
    const button = element.querySelector('button') as HTMLButtonElement;
    const bio = element.querySelector('.bio') as HTMLElement;
    expect(bio.hidden).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe(bio.id);
    expect(button.textContent).toContain('Show bio');

    button.click();
    await fixture.whenStable();
    expect(bio.hidden).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.textContent).toContain('Hide bio');
    expect(
      Array.from(bio.querySelectorAll('p')).map((p) => p.textContent),
    ).toEqual(['First paragraph.', 'Second paragraph.']);
  });

  it('has no bio button without a bio', async () => {
    const { element } = await render(Host);
    expect(element.querySelector('button')).toBeNull();
  });
});
