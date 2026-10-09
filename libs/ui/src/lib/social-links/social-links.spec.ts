import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { SocialLink } from '../person/person';
import { SocialLinks } from './social-links';

@Component({
  imports: [SocialLinks],
  template: `<gdg-social-links [links]="links()" [owner]="owner()" />`,
})
class Host {
  readonly links = signal<SocialLink[]>([
    { network: 'linkedin', url: 'https://www.linkedin.com/in/ada' },
    { network: 'x', url: 'https://x.com/ada' },
    { network: 'website', url: 'https://ada.dev' },
  ]);
  readonly owner = signal<string | undefined>('Ada Lovelace');
}

describe('SocialLinks', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const links = () => Array.from(element.querySelectorAll('a'));
    return { fixture, element, links };
  }

  it('names each link after its owner and network and opens it safely', async () => {
    const { links } = await setup();
    expect(links().map((link) => link.getAttribute('aria-label'))).toEqual([
      'Ada Lovelace on LinkedIn',
      'Ada Lovelace on X',
      "Ada Lovelace's website",
    ]);
    expect(links()[0].getAttribute('href')).toBe(
      'https://www.linkedin.com/in/ada',
    );
    expect(links().every((link) => link.target === '_blank')).toBe(true);
    expect(links().every((link) => link.rel === 'noopener noreferrer')).toBe(
      true,
    );
  });

  it('falls back to network names and renders nothing without links', async () => {
    const { fixture, element, links } = await setup();
    fixture.componentInstance.owner.set(undefined);
    await fixture.whenStable();
    expect(links().map((link) => link.getAttribute('aria-label'))).toEqual([
      'LinkedIn',
      'X',
      'Website',
    ]);

    fixture.componentInstance.links.set([]);
    await fixture.whenStable();
    expect(element.querySelector('ul')).toBeNull();
  });
});
