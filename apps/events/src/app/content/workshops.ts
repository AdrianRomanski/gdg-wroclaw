import type { Workshop } from '@gdg-wroclaw/ui';

/**
 * Workshop pages, keyed by URL slug (`/workshops/:slug`), shown with the Workshop page template
 * (ADR-0023). None yet; meetups use the Event page (`content/events.ts`, ADR-0025).
 */
export const WORKSHOPS: Readonly<Record<string, Workshop>> = {};
