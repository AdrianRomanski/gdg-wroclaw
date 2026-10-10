import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GdgLogo } from './gdg-logo';

@Component({
  imports: [GdgLogo],
  template: `<gdg-logo [label]="label()" [height]="24" />`,
})
class Host {
  readonly label = signal('');
}

describe('GdgLogo', () => {
  it('is decorative by default and an image when labelled', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const logo = (fixture.nativeElement as HTMLElement).querySelector(
      'gdg-logo',
    ) as HTMLElement;
    expect(logo.hasAttribute('role')).toBe(false);
    expect(logo.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(logo.querySelectorAll('path')).toHaveLength(4);
    expect(logo.style.getPropertyValue('--gdg-logo-height')).toBe('1.5rem');

    fixture.componentInstance.label.set('Google Developer Groups');
    await fixture.whenStable();
    expect(logo.getAttribute('role')).toBe('img');
    expect(logo.getAttribute('aria-label')).toBe('Google Developer Groups');
  });
});
