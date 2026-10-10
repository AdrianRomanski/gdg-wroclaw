import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  type ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Button, Icon } from '@gdg-wroclaw/design-system-components';
import { PartnerCard } from '../partner-card/partner-card';
import type { Partner } from '../partner-card/partner';

/** `grid` is Figma `Partners` (181:5975), `carousel` is `Team / 10 /` (181:7330). */
export type PartnersSectionLayout = 'grid' | 'carousel';

let nextId = 0;

/**
 * Partners section from the Figma **Team/Partners** page, see ADR-0019.
 *
 * - `grid`: a centered title and the partners as logo tiles, four per row.
 * - `carousel`: a start-aligned title, position dots and previous/next buttons above a
 *   horizontally scrolling row of partner cards (three visible on desktop).
 *
 * Both take an optional call to action below. Presentational (ADR-0013).
 */
@Component({
  selector: 'gdg-partners-section',
  imports: [Button, Icon, PartnerCard],
  templateUrl: './partners-section.html',
  styleUrl: './partners-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': "'gdg-partners-section gdg-partners-section--' + layout()",
  },
})
export class PartnersSection {
  readonly heading = input('Partners');

  readonly description = input('');

  readonly partners = input.required<readonly Partner[]>();

  readonly layout = input<PartnersSectionLayout>('grid');

  /** Call to action below the partners, e.g. "Join us!". Hidden when empty. */
  readonly ctaHeading = input('');

  readonly ctaText = input('');

  /** Target of the call to action button. The button is hidden without it. */
  readonly ctaHref = input<string>();

  readonly ctaLabel = input('Contact');

  /** Accessible names of the carousel buttons. */
  readonly previousLabel = input('Previous partners');

  readonly nextLabel = input('Next partners');

  protected readonly trackId = `gdg-partners-track-${nextId++}`;

  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');

  /** Index of the first fully visible card. */
  protected readonly position = signal(0);

  /** Number of cards that fit in the viewport. */
  private readonly visible = signal(3);

  /** One dot per scroll position: the first card of each possible view. */
  protected readonly positions = computed(() =>
    Array.from(
      { length: Math.max(1, this.partners().length - this.visible() + 1) },
      (_, index) => index,
    ),
  );

  protected readonly atStart = computed(() => this.position() === 0);

  protected readonly atEnd = computed(
    () => this.position() >= this.positions().length - 1,
  );

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Measured in the browser only (SSR-safe), and again whenever the viewport resizes.
    afterNextRender(() => {
      const viewport = this.viewport()?.nativeElement;
      if (!viewport) {
        return;
      }
      const update = () => {
        const step = this.step(viewport);
        if (!step) {
          return;
        }
        // The epsilon absorbs subpixel card widths (3 × 394.67px + gaps = 1280px).
        this.visible.set(
          Math.max(
            1,
            Math.floor(
              (viewport.clientWidth + this.gap(viewport)) / step + 0.01,
            ),
          ),
        );
        // A peeking last card can't scroll to the start, so the end counts as the last position.
        const atEnd =
          viewport.scrollLeft + viewport.clientWidth >=
          viewport.scrollWidth - 1;
        this.position.set(
          atEnd
            ? this.positions().length - 1
            : Math.round(viewport.scrollLeft / step),
        );
      };
      update();
      viewport.addEventListener('scroll', update, { passive: true });
      const observer =
        typeof ResizeObserver === 'undefined'
          ? undefined
          : new ResizeObserver(update);
      observer?.observe(viewport);
      destroyRef.onDestroy(() => {
        viewport.removeEventListener('scroll', update);
        observer?.disconnect();
      });
    });
  }

  protected scroll(direction: -1 | 1): void {
    const viewport = this.viewport()?.nativeElement;
    if (!viewport) {
      return;
    }
    const reduceMotion =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    viewport.scrollBy({
      left: direction * this.step(viewport),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }

  /** Width of one card plus the gap. */
  private step(viewport: HTMLElement): number {
    const card = viewport.querySelector('li');
    return card ? card.offsetWidth + this.gap(viewport) : 0;
  }

  private gap(viewport: HTMLElement): number {
    const list = viewport.querySelector('ul');
    return list ? parseFloat(getComputedStyle(list).columnGap) || 0 : 0;
  }
}
