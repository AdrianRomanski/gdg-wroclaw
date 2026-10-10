import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Community graphic from the Figma **Event detail** page (`Community graphic`, 8927:6067), see
 * ADR-0025: a code tile, a wireframe globe, two accent circles and the community motto.
 *
 * Decorative: hidden from assistive technology. It scales with its width at the Figma ratio
 * (536 × 400); the shapes are the Figma SVGs, inlined like the other UI artwork.
 */
@Component({
  selector: 'gdg-event-graphic',
  templateUrl: './event-graphic.html',
  styleUrl: './event-graphic.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class EventGraphic {
  readonly motto = input('Build. Share. Connect.');
}
