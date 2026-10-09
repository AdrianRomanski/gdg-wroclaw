import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { Icon } from '@gdg-wroclaw/design-system-components';
import { puzzleOutline } from './puzzle-outline';

export type FaqItemColor = 'blue' | 'green' | 'yellow' | 'red';

/** `puzzle` is Figma `Border puzzle=True`, `plain` is `Border puzzle=False`. */
export type FaqItemVariant = 'puzzle' | 'plain';

/**
 * FAQ item from the Figma **FAQs** page (component set 181:6547), see ADR-0015.
 *
 * A native `<details>` disclosure: the question is the summary, the projected content is the
 * answer. The icon is a plus while closed and turns into Figma's close icon when open.
 */
@Component({
  selector: 'gdg-faq-item',
  imports: [Icon],
  templateUrl: './faq-item.html',
  styleUrl: './faq-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
})
export class FaqItem {
  readonly question = input.required<string>();

  /** Stroke color (Figma `Color`), the brand secondary (halftone) shade. */
  readonly color = input<FaqItemColor>('green');

  /** Puzzle-piece outline or plain rounded border (Figma `Border puzzle`). */
  readonly variant = input<FaqItemVariant>('puzzle');

  /** Initial state; the visitor toggles it afterwards. */
  readonly open = input(false, { transform: booleanAttribute });

  protected readonly hostClass = computed(
    () =>
      `gdg-faq-item gdg-faq-item--${this.variant()} gdg-faq-item--${this.color()}`,
  );

  private readonly size = signal({ width: 0, height: 0 });

  protected readonly outline = computed(() =>
    this.variant() === 'puzzle'
      ? puzzleOutline(this.size().width, this.size().height)
      : '',
  );

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    // The outline follows the rendered size: answer length, open state, viewport width.
    afterNextRender(() => {
      const measure = () =>
        this.size.set({ width: host.offsetWidth, height: host.offsetHeight });
      measure();
      if (typeof ResizeObserver === 'undefined') {
        return;
      }
      const observer = new ResizeObserver(measure);
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
