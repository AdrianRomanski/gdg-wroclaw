import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon, type IconName } from '@gdg-wroclaw/design-system-components';

/**
 * Note card from the Figma **DevFest** page (`Trainer list note`, 9044:3152), see ADR-0029: a
 * symbol in a raised circle next to a muted line, for content that is announced later.
 */
@Component({
  selector: 'gdg-devfest-note',
  imports: [Icon],
  template: `<span class="symbol" aria-hidden="true"
      ><gdg-icon [name]="icon()" [size]="24"
    /></span>
    <p class="text">{{ text() }}</p>`,
  styleUrl: './devfest-note.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevfestNote {
  readonly text = input.required<string>();

  readonly icon = input<IconName>('code');
}
