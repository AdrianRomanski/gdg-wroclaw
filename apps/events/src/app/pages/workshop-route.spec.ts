import { TestBed } from '@angular/core/testing';
import { WorkshopRoute } from './workshop-route';

describe('WorkshopRoute', () => {
  // The ui components use external templates, compiled here for the JIT test build.
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [WorkshopRoute],
    }).compileComponents(),
  );

  async function render(slug: string) {
    const fixture = TestBed.createComponent(WorkshopRoute);
    fixture.componentRef.setInput('slug', slug);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a known workshop', async () => {
    const element = await render('sample-workshop');
    expect(element.querySelector('h1')?.textContent).toBe('Workshop topic');
  });

  it('shows Not found for an unknown or inherited slug', async () => {
    for (const slug of ['missing', 'toString']) {
      const element = await render(slug);
      expect(element.querySelector('h1')?.textContent).toBe('Page not found');
    }
  });
});
