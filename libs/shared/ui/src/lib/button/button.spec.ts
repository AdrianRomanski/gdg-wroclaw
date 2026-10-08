import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Icon } from '../icon/icon';
import {
  Button,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from './button';

@Component({
  imports: [Button, Icon],
  template: `
    <button
      gdg-button
      type="button"
      class="custom"
      [color]="color()"
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
    >
      Save
    </button>
    <a gdg-button href="/register" [disabled]="disabled()"
      >Register <gdg-icon name="caret-right"
    /></a>
    <button gdg-button type="button" iconOnly aria-label="Next">
      <gdg-icon name="caret-right" />
    </button>
  `,
})
class Host {
  readonly color = signal<ButtonColor>('blue');
  readonly variant = signal<ButtonVariant>('primary');
  readonly size = signal<ButtonSize>('l');
  readonly disabled = signal(false);
}

describe('Button', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const [button, iconButton] = Array.from(element.querySelectorAll('button'));
    return {
      fixture,
      host: fixture.componentInstance,
      button,
      link: element.querySelector('a') as HTMLAnchorElement,
      iconButton,
    };
  }

  it('defaults to a large blue primary button and keeps consumer classes', async () => {
    const { button } = await setup();
    expect(Array.from(button.classList)).toEqual(
      expect.arrayContaining([
        'custom',
        'gdg-button',
        'gdg-button--primary',
        'gdg-button--blue',
        'gdg-button--l',
      ]),
    );
    expect(button.classList).not.toContain('gdg-button--with-icon');
    expect(button.textContent?.trim()).toBe('Save');
  });

  it('maps color, variant and size to host classes', async () => {
    const { fixture, host, button } = await setup();
    host.color.set('yellow');
    host.variant.set('secondary');
    host.size.set('m');
    await fixture.whenStable();

    expect(Array.from(button.classList)).toEqual(
      expect.arrayContaining([
        'gdg-button--secondary',
        'gdg-button--yellow',
        'gdg-button--m',
      ]),
    );
    expect(button.classList).not.toContain('gdg-button--blue');
    expect(button.classList).not.toContain('gdg-button--primary');
  });

  it('places a projected icon after the label', async () => {
    const { link } = await setup();
    expect(link.classList).toContain('gdg-button--with-icon');
    expect(link.lastElementChild?.tagName).toBe('GDG-ICON');
  });

  it('marks icon-only buttons', async () => {
    const { iconButton } = await setup();
    expect(iconButton.classList).toContain('gdg-button--icon-only');
    expect(iconButton.classList).not.toContain('gdg-button--with-icon');
  });

  it('disables buttons natively and links with aria-disabled', async () => {
    const { fixture, host, button, link } = await setup();
    host.disabled.set(true);
    await fixture.whenStable();

    expect(button.disabled).toBe(true);
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('-1');

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
  });

  it('warns about icon-only buttons without an accessible name', async () => {
    @Component({
      imports: [Button, Icon],
      template: `<button gdg-button type="button" iconOnly>
        <gdg-icon name="caret-right" />
      </button>`,
    })
    class Unlabelled {}

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(Unlabelled);
    await fixture.whenStable();

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('aria-label'),
      expect.any(HTMLElement),
    );
    warn.mockRestore();
  });

  it('does not warn when an icon-only button is labelled', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await setup();
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
