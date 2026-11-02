import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Accent } from '../accent/accent';
import { Tag } from './tag';

@Component({
  imports: [Tag],
  template: `<gdg-tag [accent]="accent()">AI</gdg-tag>`,
})
class Host {
  readonly accent = signal<Accent | undefined>('red');
}

describe('Tag', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      host: fixture.componentInstance,
      tag: element.querySelector('gdg-tag') as HTMLElement,
    };
  }

  it('shows the label after a decorative accent dot', async () => {
    const { tag } = await setup();
    expect(tag.textContent?.trim()).toBe('AI');
    expect(tag.dataset['accent']).toBe('red');
    expect(tag.querySelector('.dot')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('has no dot when neutral', async () => {
    const { fixture, host, tag } = await setup();
    host.accent.set(undefined);
    await fixture.whenStable();

    expect(tag.querySelector('.dot')).toBeNull();
    expect(tag.hasAttribute('data-accent')).toBe(false);
  });
});
