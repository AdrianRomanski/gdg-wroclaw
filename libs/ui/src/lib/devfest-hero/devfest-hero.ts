import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Button } from '@gdg-wroclaw/design-system-components';
import type { DevfestHeroContent } from '../devfest-page/devfest-content';

/**
 * DevFest hero from the Figma **DevFest** page (`Hero`, 9043:2046), see ADR-0029: the DevFest
 * artwork with 24px corners, then an optional caption and a Primary button.
 */
@Component({
  selector: 'gdg-devfest-hero',
  imports: [Button],
  template: `@let h = hero();
    <img
      class="image"
      width="1300"
      height="731"
      fetchpriority="high"
      [src]="h.image.src"
      [alt]="h.image.alt ?? ''"
    />
    @if (h.overline || h.caption || h.action) {
      <div class="cta">
        @if (h.overline || h.caption) {
          <p class="caption">
            @if (h.overline) {
              <span class="overline">{{ h.overline }}</span>
            }
            @if (h.caption) {
              <span class="title">{{ h.caption }}</span>
            }
          </p>
        }
        @if (h.action; as action) {
          <a gdg-button [href]="action.href">{{ action.label }}</a>
        }
      </div>
    }`,
  styleUrl: './devfest-hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevfestHero {
  readonly hero = input.required<DevfestHeroContent>();
}
