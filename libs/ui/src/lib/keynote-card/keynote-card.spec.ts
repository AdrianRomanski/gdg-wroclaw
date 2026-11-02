import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { DevfestKeynote } from '../devfest-session/devfest-session';
import { KeynoteCard } from './keynote-card';

const SAMPLE_KEYNOTE: DevfestKeynote = {
  title: 'Who Let the Dogs Out? The State of AI Robotics',
  time: '15:50',
  room: 'Scena Główna',
  abstract: 'Abstrakt',
  speaker: { name: 'Imię Nazwisko', initials: 'OT' },
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
    ).toEqual(['15:50', 'Keynote', 'Scena Główna']);
    expect(element.querySelector('h3')?.textContent).toBe(SAMPLE_KEYNOTE.title);
    expect(element.querySelector('.abstract')?.textContent).toBe('Abstrakt');
    expect(element.querySelector('.speaker')?.textContent).toContain(
      'Imię Nazwisko',
    );
  });
});
