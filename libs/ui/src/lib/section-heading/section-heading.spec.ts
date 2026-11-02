import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SectionHeading } from './section-heading';

async function render<T>(type: new () => T) {
  const fixture = TestBed.createComponent(type);
  await fixture.whenStable();
  return {
    fixture,
    host: fixture.componentInstance,
    element: fixture.nativeElement as HTMLElement,
  };
}

describe('SectionHeading', () => {
  @Component({
    imports: [SectionHeading],
    template: `<gdg-section-heading
      [overline]="overline()"
      heading="Harmonogram & Sceny"
      description="Opis sekcji"
      headingId="agenda"
    />`,
  })
  class Host {
    readonly overline = signal('AGENDA / DEVFEST 2026');
  }

  it('shows the overline, the h2 and the description', async () => {
    const { fixture, host, element } = await render(Host);
    expect(element.querySelector('.overline')?.textContent).toBe(
      'AGENDA / DEVFEST 2026',
    );
    const heading = element.querySelector('h2') as HTMLElement;
    expect(heading.textContent).toBe('Harmonogram & Sceny');
    expect(heading.id).toBe('agenda');
    expect(element.querySelector('.description')?.textContent).toBe(
      'Opis sekcji',
    );

    host.overline.set('');
    await fixture.whenStable();
    expect(element.querySelector('.overline')).toBeNull();
  });
});
