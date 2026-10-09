import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Text input and text area from the Figma **Contact Form** page (`Text input` 181:9163,
 * `Text Area` 181:9174), see ADR-0014.
 *
 * Applied to a native `<input>` or `<textarea>`, so labels, forms and validation keep their
 * native behavior. Set `aria-invalid="true"` to show the error stroke.
 */
@Component({
  selector: 'input[gdg-text-input], textarea[gdg-text-input]',
  template: '',
  styleUrl: './text-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'gdg-text-input' },
})
export class TextInput {}
