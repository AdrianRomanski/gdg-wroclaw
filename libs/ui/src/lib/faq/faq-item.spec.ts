import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FaqItem, type FaqItemColor, type FaqItemVariant } from './faq-item';

@Component({
  imports: [FaqItem],
  template: `
    <gdg-faq-item
      question="Is it free?"
      [variant]="variant()"
      [color]="color()"
      [open]="open()"
      >Yes, every meetup is free.</gdg-faq-item
    >
  `,
})
class Host {
  readonly variant = signal<FaqItemVariant>('puzzle');
  readonly color = signal<FaqItemColor>('green');
  readonly open = signal(false);
}

describe('FaqItem', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      host: fixture.componentInstance,
      item: element.querySelector('gdg-faq-item') as HTMLElement,
      details: element.querySelector('details') as HTMLDetailsElement,
      summary: element.querySelector('summary') as HTMLElement,
    };
  }

  it('shows the question as the summary and projects the answer', async () => {
    const { details, summary } = await setup();
    expect(summary.textContent?.trim()).toBe('Is it free?');
    expect(details.querySelector('.answer')?.textContent?.trim()).toBe(
      'Yes, every meetup is free.',
    );
    expect(summary.querySelector('gdg-icon')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
  });

  it('starts closed, opens from the input and toggles natively', async () => {
    const { fixture, host, details, summary } = await setup();
    expect(details.open).toBe(false);

    host.open.set(true);
    await fixture.whenStable();
    expect(details.open).toBe(true);

    summary.click();
    expect(details.open).toBe(false);
  });

  it('defaults to a green puzzle item and switches variant and color', async () => {
    const { fixture, host, item } = await setup();
    expect(Array.from(item.classList).sort()).toEqual([
      'gdg-faq-item',
      'gdg-faq-item--green',
      'gdg-faq-item--puzzle',
    ]);
    expect(item.querySelector('svg.outline')).not.toBeNull();

    host.variant.set('plain');
    host.color.set('red');
    await fixture.whenStable();
    expect(Array.from(item.classList).sort()).toEqual([
      'gdg-faq-item',
      'gdg-faq-item--plain',
      'gdg-faq-item--red',
    ]);
    expect(item.querySelector('svg.outline')).toBeNull();
  });
});
