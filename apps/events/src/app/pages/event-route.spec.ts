import { TestBed } from '@angular/core/testing';
import { EventRoute } from './event-route';

describe('EventRoute', () => {
  // The ui components use external templates, compiled here for the JIT test build.
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [EventRoute],
    }).compileComponents(),
  );

  async function render(slug: string) {
    const fixture = TestBed.createComponent(EventRoute);
    fixture.componentRef.setInput('slug', slug);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a known event', async () => {
    const element = await render('ai-cloud-stream-meetup');
    expect(element.querySelector('h1')?.textContent?.trim()).toBe(
      'AI & Cloud Stream Meetup',
    );
    expect(
      Array.from(element.querySelectorAll('h2')).map((h) =>
        h.textContent?.trim(),
      ),
    ).toEqual([
      'Speakers & their talks',
      'Schedule',
      'Capgemini Software Solutions Center',
      'Meet your organizers',
      'Sponsors',
      'Your next idea starts here.',
    ]);
  });

  it('shows Not found for an unknown or inherited slug', async () => {
    for (const slug of ['missing', 'toString']) {
      const element = await render(slug);
      expect(element.querySelector('h1')?.textContent).toBe('Page not found');
    }
  });
});
