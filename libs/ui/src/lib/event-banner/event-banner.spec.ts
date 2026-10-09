import { TestBed } from '@angular/core/testing';
import { EventBanner } from './event-banner';

describe('EventBanner', () => {
  it('shows the given image, decorative unless described', async () => {
    const fixture = TestBed.createComponent(EventBanner);
    fixture.componentRef.setInput('src', '/banner.png');
    await fixture.whenStable();
    const image = (fixture.nativeElement as HTMLElement).querySelector(
      'img',
    ) as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('/banner.png');
    expect(image.alt).toBe('');

    fixture.componentRef.setInput('alt', 'DevFest Wrocław 2026');
    await fixture.whenStable();
    expect(image.alt).toBe('DevFest Wrocław 2026');
  });
});
