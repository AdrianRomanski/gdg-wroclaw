import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Button } from '@gdg-wroclaw/design-system-components';
import { FaqItem, type FaqItemColor, type FaqItemVariant } from './faq-item';

/** One question and its plain-text answer. */
export interface FaqEntry {
  question: string;
  answer: string;
  /** Shown expanded at first. */
  open?: boolean;
}

/**
 * FAQ section from the Figma **FAQs** page (`FAQ / 11 /`, 181:6549 and 181:6770), see ADR-0015.
 *
 * Section title with an optional "Ask a question" link on the left, the questions on the right.
 * Presentational (ADR-0013): entries and the link target come from the consumer.
 */
@Component({
  selector: 'gdg-faq-section',
  imports: [Button, FaqItem],
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.gdg-faq-section--puzzle]': "variant() === 'puzzle'",
  },
})
export class FaqSection {
  readonly heading = input('FAQs');

  readonly description = input('');

  readonly entries = input.required<readonly FaqEntry[]>();

  /** Item outline, Figma `Border puzzle` (the page shows both). */
  readonly variant = input<FaqItemVariant>('puzzle');

  /** Item stroke and button color. */
  readonly color = input<FaqItemColor>('green');

  /** Target of the call to action, e.g. the contact page. The link is hidden without it. */
  readonly askHref = input<string>();

  readonly askLabel = input('Ask a question');
}
