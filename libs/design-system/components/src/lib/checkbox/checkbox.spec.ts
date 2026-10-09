import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Checkbox } from './checkbox';

@Component({
  imports: [Checkbox],
  template: `
    <label>
      <input type="checkbox" gdg-checkbox />
      I accept the Terms
    </label>
    <input type="text" gdg-checkbox aria-label="Not a checkbox" />
  `,
})
class Host {}

describe('Checkbox', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const [checkbox, text] = Array.from(element.querySelectorAll('input'));
    return { element, checkbox, text };
  }

  it('styles native checkboxes only', async () => {
    const { checkbox, text } = await setup();
    expect(checkbox.classList.contains('gdg-checkbox')).toBe(true);
    expect(text.classList.contains('gdg-checkbox')).toBe(false);
  });

  it('toggles through its label', async () => {
    const { element, checkbox } = await setup();
    (element.querySelector('label') as HTMLLabelElement).click();
    expect(checkbox.checked).toBe(true);
  });
});
