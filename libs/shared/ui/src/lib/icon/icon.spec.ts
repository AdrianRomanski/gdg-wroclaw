import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFile } from 'node:fs/promises';
import { renderIcons, ICONS_FILE } from '../../../tools/build-icons.ts';
import { icons } from './generated/icons';
import { Icon } from './icon';

@Component({
  imports: [Icon],
  template: `<gdg-icon name="caret-right" [size]="size()" [label]="label()" />`,
})
class Host {
  readonly size = signal(24);
  readonly label = signal<string | undefined>(undefined);
}

describe('Icon', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const host = (fixture.nativeElement as HTMLElement).querySelector(
      'gdg-icon',
    ) as HTMLElement;
    return { fixture, component: fixture.componentInstance, host };
  }

  it('renders the registry markup in a currentColor svg', async () => {
    const { host } = await setup();
    const svg = host.querySelector('svg') as SVGSVGElement;
    expect(svg.getAttribute('viewBox')).toBe('0 0 256 256');
    expect(svg.getAttribute('fill')).toBe('currentColor');
    expect(svg.innerHTML).toContain(
      icons['caret-right'].slice(0, '<path d="M181'.length),
    );
  });

  it('is decorative by default and labelled when a label is given', async () => {
    const { fixture, component, host } = await setup();
    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(host.hasAttribute('role')).toBe(false);

    component.label.set('Next');
    await fixture.whenStable();
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toBe('Next');
    expect(host.hasAttribute('aria-hidden')).toBe(false);
  });

  it('sizes itself in rem', async () => {
    const { fixture, component, host } = await setup();
    expect(host.style.getPropertyValue('--gdg-icon-size')).toBe('1.5rem');

    component.size.set(32);
    await fixture.whenStable();
    expect(host.style.getPropertyValue('--gdg-icon-size')).toBe('2rem');
  });
});

describe('generated icons', () => {
  it('icons.ts is up to date with icons.json (run `nx run shared-ui:generate-icons`)', async () => {
    expect(await readFile(ICONS_FILE, 'utf8')).toBe(await renderIcons());
  });
});
