import { TestBed } from '@angular/core/testing';
import { EventPage } from './event-page';
import type { EventDetail } from './event-detail';

const EVENT: EventDetail = {
  title: 'DevFest 2026',
  tagline: 'Build what’s next.',
  back: { label: 'All events', href: '/#events' },
  facts: [
    { icon: 'calendar-dots', label: 'Date', value: '14 November 2026' },
    { icon: 'clock', label: 'Time', value: '13:00–18:00' },
    { icon: 'map-pin', label: 'Location', value: 'The Foundry' },
  ],
  speakers: {
    heading: 'Speakers & their talks',
    talks: [
      {
        speaker: { name: 'Ada Lovelace', role: 'speaker' },
        title: 'From prompt to product with Gemini',
      },
      {
        speaker: { name: 'Grace Hopper', role: 'speaker' },
        title: 'Ship your first app on Cloud Run',
      },
    ],
  },
  schedule: {
    heading: 'Schedule',
    sessions: [
      { start: '13:00', title: 'Check-in', type: 'Welcome' },
      { start: '13:45', title: 'Gemini', type: 'Talk', highlight: true },
      { start: '15:15', title: 'Break', type: 'Break' },
    ],
  },
  venue: { heading: 'The Foundry' },
  organizers: {
    heading: 'Meet your organizers',
    people: [{ name: 'Alan Turing', role: 'organizer' }],
  },
  supporters: {
    heading: 'Partners & sponsors',
    groups: [
      { title: 'Sponsors', supporters: [{ partner: { name: 'Acme' } }] },
    ],
  },
  registration: { heading: 'Your next idea starts here.' },
};

describe('EventPage', () => {
  async function render(event: EventDetail) {
    const fixture = TestBed.createComponent(EventPage);
    fixture.componentRef.setInput('event', event);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  const text = (element: Element | null) =>
    element?.textContent?.replace(/\s+/g, ' ').trim();

  it('renders every section in the Figma order, labelled by its heading', async () => {
    const element = await render(EVENT);
    expect(text(element.querySelector('h1'))).toBe(
      'DevFest 2026 Build what’s next.',
    );
    expect(
      Array.from(element.querySelectorAll('.section')).map((s) => s.id),
    ).toEqual([
      'speakers',
      'schedule',
      'venue',
      'organizers',
      'partners',
      'register',
    ]);
    const sections = element.querySelectorAll('section[aria-labelledby]');
    expect(sections).toHaveLength(6);
    for (const section of Array.from(sections)) {
      const id = section.getAttribute('aria-labelledby') ?? '';
      expect(element.querySelector(`#${id}`)?.tagName).toBe('H2');
    }
  });

  it('shows the breadcrumb, facts, talks and agenda', async () => {
    const element = await render(EVENT);
    expect(text(element.querySelector('[aria-current="page"]'))).toBe(
      'DevFest 2026',
    );
    expect(element.querySelectorAll('.facts dt')).toHaveLength(3);
    expect(
      Array.from(element.querySelectorAll('.talk-title')).map(text),
    ).toEqual([
      'From prompt to product with Gemini',
      'Ship your first app on Cloud Run',
    ]);
    expect(element.querySelectorAll('.agenda > li')).toHaveLength(3);
    expect(element.querySelectorAll('.type--highlight')).toHaveLength(1);
  });

  it('leaves out sections without data', async () => {
    const element = await render({
      title: 'Meetup',
      registration: { heading: 'Join us' },
    });
    expect(text(element.querySelector('h1'))).toBe('Meetup');
    expect(element.querySelector('.breadcrumb')).toBeNull();
    expect(element.querySelector('.facts')).toBeNull();
    expect(
      Array.from(element.querySelectorAll('.section')).map((s) => s.id),
    ).toEqual(['register']);
  });
});
