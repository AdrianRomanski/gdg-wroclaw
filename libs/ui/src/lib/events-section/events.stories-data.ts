import type { GdgEvent } from '../event-card/gdg-event';
import type { EventDay } from './events-section';

const description =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.';

const sample = (tag?: string): GdgEvent => ({
  title: 'Event title heading',
  time: 'event start time',
  location: 'Location',
  description,
  tag,
  href: '#',
});

/**
 * Story-only sample of the Figma Landing Page events (ADR-0021); this file is not exported from
 * the library.
 */
export const SAMPLE_DAYS: EventDay[] = [
  '29.06',
  '30.06',
  '01.07',
  '02.07',
  '03.07',
  '04.07',
].map((label, index) => ({
  label,
  events:
    index === 0
      ? [sample('Sold out'), sample(), sample()]
      : index === 5
        ? []
        : [sample(), sample()],
}));

export const SAMPLE_EVENT: GdgEvent = sample('Sold out');
