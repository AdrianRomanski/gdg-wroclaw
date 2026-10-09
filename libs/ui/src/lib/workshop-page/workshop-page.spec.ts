import { TestBed } from '@angular/core/testing';
import type { Workshop } from './workshop';
import { WorkshopPage } from './workshop-page';

describe('WorkshopPage', () => {
  async function render(workshop: Workshop) {
    const fixture = TestBed.createComponent(WorkshopPage);
    fixture.componentRef.setInput('workshop', workshop);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the banner and the workshop details', async () => {
    const element = await render({
      topic: 'Angular Signals in practice',
      description: 'Bring a laptop.',
      banner: { src: '/banner.png' },
      trainers: [{ name: 'Ada Lovelace' }],
    });
    expect(
      element.querySelector('gdg-event-banner img')?.getAttribute('src'),
    ).toBe('/banner.png');
    expect(element.querySelector('h1')?.textContent).toBe(
      'Angular Signals in practice',
    );
    expect(element.querySelectorAll('gdg-person-row')).toHaveLength(1);
  });

  it('works without a banner or trainers', async () => {
    const element = await render({ topic: 'Open hack night' });
    expect(element.querySelector('gdg-event-banner')).toBeNull();
    expect(
      element
        .querySelector('gdg-workshop-details')
        ?.classList.contains('details--no-banner'),
    ).toBe(true);
    expect(element.querySelector('section')).toBeNull();
  });
});
