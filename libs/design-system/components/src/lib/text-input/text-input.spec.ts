import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TextInput } from './text-input';

@Component({
  imports: [TextInput],
  template: `
    <label for="name">Name</label>
    <input gdg-text-input id="name" class="custom" [disabled]="disabled()" />
    <textarea
      gdg-text-input
      aria-label="Message"
      placeholder="Type…"
    ></textarea>
  `,
})
class Host {
  readonly disabled = signal(false);
}

describe('TextInput', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      input: element.querySelector('input') as HTMLInputElement,
      textarea: element.querySelector('textarea') as HTMLTextAreaElement,
    };
  }

  it('styles native inputs and text areas and keeps consumer classes', async () => {
    const { input, textarea } = await setup();
    expect(Array.from(input.classList)).toEqual(
      expect.arrayContaining(['custom', 'gdg-text-input']),
    );
    expect(textarea.classList.contains('gdg-text-input')).toBe(true);
    expect(textarea.placeholder).toBe('Type…');
  });

  it('keeps native labelling and disabled behavior', async () => {
    const { fixture, input } = await setup();
    expect(input.labels?.[0].textContent).toBe('Name');

    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    expect(input.disabled).toBe(true);
  });
});
