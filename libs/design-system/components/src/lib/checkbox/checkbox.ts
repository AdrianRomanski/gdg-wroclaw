import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Checkbox from the Figma **Contact Form** page (instance 181:9151), see ADR-0014.
 *
 * Applied to a native `<input type="checkbox">`; pair it with a `<label>`. Set
 * `aria-invalid="true"` to show the error stroke.
 */
@Component({
  selector: 'input[type=checkbox][gdg-checkbox]',
  template: '',
  styleUrl: './checkbox.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'gdg-checkbox' },
})
export class Checkbox {}
