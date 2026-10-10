/**
 * Puzzle photo frame of the Figma Team `Person` card (`Color border=True`, e.g. 181:5291), see
 * ADR-0018: a square with a slot cut into the top edge, a notch in the left edge and a slot in
 * the bottom edge. Figma exports it as a bitmap with the photo baked in, so the shape is redrawn
 * here and the photo is clipped to it.
 *
 * The card is always square, so a fixed 296 × 296 path (the Figma size) scales without
 * distortion. Positions are measured on the Figma render; all corners use an 8px radius.
 */
export const PUZZLE_FRAME_SIZE = 296;

export const PUZZLE_FRAME_PATH = [
  'M8 0H65a8 8 0 0 1 8 8V33a8 8 0 0 0 8 8H106a8 8 0 0 0 8-8V8a8 8 0 0 1 8-8H288a8 8 0 0 1 8 8',
  'V288a8 8 0 0 1-8 8H244a8 8 0 0 1-8-8V266a8 8 0 0 0-8-8H184a8 8 0 0 0-8 8V288a8 8 0 0 1-8 8',
  'H8a8 8 0 0 1-8-8V167a8 8 0 0 1 8-8H58a8 8 0 0 0 8-8V96a8 8 0 0 0-8-8H8a8 8 0 0 1-8-8V8',
  'a8 8 0 0 1 8-8Z',
].join('');
