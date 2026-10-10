/** A partner or sponsor shown on the Team/Partners page (ADR-0019). */
export interface Partner {
  name: string;
  /** Logo shown whole (`contain`) on a light tile; `alt` defaults to empty, since the name is shown below. */
  logo?: { src: string; alt?: string };
  /** Partner website; the card becomes a link opening in a new tab. */
  url?: string;
}
