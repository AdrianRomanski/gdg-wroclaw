/** An event listed on the Landing page (ADR-0021). */
export interface GdgEvent {
  title: string;
  /** Start time as shown, e.g. "18:00" or "29 Jun, 18:00". */
  time?: string;
  /** Machine-readable start for `<time datetime>`, e.g. "2026-06-29T18:00". */
  dateTime?: string;
  location?: string;
  /** Plain text. */
  description?: string;
  /** Short status label next to the title, e.g. "Sold out". */
  tag?: string;
  /** Event page; shows the "Read more" link. */
  href?: string;
}
