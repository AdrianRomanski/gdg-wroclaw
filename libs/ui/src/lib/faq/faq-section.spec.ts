import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { FaqItemVariant } from './faq-item';
import { type FaqEntry, FaqSection } from './faq-section';

@Component({
  imports: [FaqSection],
  template: `
    <gdg-faq-section
      description="Everything about our meetups."
      color="blue"
      [entries]="entries"
      [variant]="variant()"
      [askHref]="askHref()"
    />
  `,
})
class Host {
  readonly entries: FaqEntry[] = [
    { question: 'Is it free?', answer: 'Yes.', open: true },
    { question: 'Where?', answer: 'In Wrocław.' },
  ];
  readonly variant = signal<FaqItemVariant>('puzzle');
  readonly askHref = signal<string | undefined>('/contact');
}

describe('FaqSection', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  it('renders the title, the call to action and one item per entry', async () => {
    const { element } = await setup();
    expect(element.querySelector('h2')?.textContent).toBe('FAQs');
    expect(element.querySelector('.description')?.textContent).toBe(
      'Everything about our meetups.',
    );
    const ask = element.querySelector('a') as HTMLAnchorElement;
    expect(ask.textContent?.trim()).toBe('Ask a question');
    expect(ask.getAttribute('href')).toBe('/contact');
    expect(ask.classList.contains('gdg-button--blue')).toBe(true);

    const items = Array.from(element.querySelectorAll('gdg-faq-item'));
    expect(
      items.map((item) => item.querySelector('summary')?.textContent?.trim()),
    ).toEqual(['Is it free?', 'Where?']);
    expect(
      items.every((item) => item.classList.contains('gdg-faq-item--blue')),
    ).toBe(true);
    expect(
      Array.from(element.querySelectorAll('details')).map(
        (details) => details.open,
      ),
    ).toEqual([true, false]);
  });

  it('passes the variant to every item and hides the link without a target', async () => {
    const { fixture, element } = await setup();
    fixture.componentInstance.variant.set('plain');
    fixture.componentInstance.askHref.set(undefined);
    await fixture.whenStable();

    expect(element.querySelectorAll('.gdg-faq-item--plain')).toHaveLength(2);
    expect(element.querySelector('a')).toBeNull();
  });
});
