import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Avatar, type AvatarSize } from './avatar';

@Component({
  imports: [Avatar],
  template: `<gdg-avatar
    initials="OT"
    [size]="size()"
    accent="green"
    [label]="label()"
    [src]="src()"
  />`,
})
class Host {
  readonly size = signal<AvatarSize>('m');
  readonly label = signal<string | undefined>(undefined);
  readonly src = signal<string | undefined>(undefined);
}

describe('Avatar', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      host: fixture.componentInstance,
      avatar: element.querySelector('gdg-avatar') as HTMLElement,
    };
  }

  it('shows the initials, size and accent, hidden from screen readers', async () => {
    const { avatar } = await setup();
    expect(avatar.textContent?.trim()).toBe('OT');
    expect(avatar.dataset['size']).toBe('m');
    expect(avatar.dataset['accent']).toBe('green');
    expect(avatar.getAttribute('aria-hidden')).toBe('true');
    expect(avatar.hasAttribute('role')).toBe(false);
  });

  it('becomes an image with a label', async () => {
    const { fixture, host, avatar } = await setup();
    host.label.set('Ola Tester');
    await fixture.whenStable();

    expect(avatar.getAttribute('role')).toBe('img');
    expect(avatar.getAttribute('aria-label')).toBe('Ola Tester');
    expect(avatar.hasAttribute('aria-hidden')).toBe(false);
  });

  it('shows a photo instead of the initials, sized for its circle', async () => {
    const { fixture, host, avatar } = await setup();
    host.src.set('/speakers/ola-tester.jpg');
    await fixture.whenStable();

    const img = avatar.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('/speakers/ola-tester.jpg');
    expect(img.alt).toBe('');
    expect(img.getAttribute('width')).toBe('64');
    expect(avatar.textContent?.trim()).toBe('');
  });

  it('falls back to the initials when the photo cannot load', async () => {
    const { fixture, host, avatar } = await setup();
    host.src.set('/missing.jpg');
    await fixture.whenStable();
    avatar.querySelector('img')?.dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(avatar.querySelector('img')).toBeNull();
    expect(avatar.textContent?.trim()).toBe('OT');

    host.src.set('/speakers/ola-tester.jpg');
    await fixture.whenStable();
    expect(avatar.querySelector('img')).not.toBeNull();
  });
});
