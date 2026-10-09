/**
 * Outline of the Figma "Border puzzle" FAQ item (component set 181:6547), see ADR-0015.
 *
 * Figma ships the shape as one fixed-size SVG, which would distort when an answer is longer or
 * collapsed. The path is rebuilt for the item's actual size instead: a rounded box with a slot cut
 * into the top edge, a tab hanging from the bottom edge (it nests into the next item's slot) and
 * a notch in the left edge. Horizontal features scale with the width, the notch with the height;
 * depths and radii stay fixed, as in Figma.
 */

/** Height of the bottom tab; the item's content box extends this far below the body. */
export const PUZZLE_TAB_HEIGHT = 28;

const SLOT_DEPTH = 28;
const NOTCH_DEPTH = 24;
/** Convex corners. */
const R = 12;
/** Concave corners of the slot and notch. */
const r = 8;
/** Tab corners and the joins where it meets the body. */
const TAB_R = 10;

// Positions measured on the 667 × 228 Figma artwork, as fractions of the width / body height.
const SLOT = [0.198, 0.686] as const;
const TAB = [0.216, 0.663] as const;
const NOTCH = [0.375, 0.83] as const;

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * SVG path for a `width` × `height` box (including the tab), drawn on the centerline of a
 * `strokeWidth` stroke so the stroke stays inside the box. Empty for boxes too small to draw.
 */
export function puzzleOutline(
  width: number,
  height: number,
  strokeWidth = 2,
): string {
  const inset = strokeWidth / 2;
  const left = inset;
  const top = inset;
  const right = width - inset;
  const bottom = height - inset - PUZZLE_TAB_HEIGHT;
  const tabBottom = height - inset;
  if (right - left < 4 * R + 2 * r || bottom - top < SLOT_DEPTH + 2 * R) {
    return '';
  }

  const span = right - left;
  const [slotStart, slotEnd] = SLOT.map((at) => left + span * at);
  const [tabStart, tabEnd] = TAB.map((at) => left + span * at);
  const slotBottom = top + SLOT_DEPTH;

  const body = bottom - top;
  const notchTop = Math.max(top + body * NOTCH[0], top + 2 * R);
  const notchBottom = Math.min(top + body * NOTCH[1], bottom - 2 * R);
  const notchRight = left + NOTCH_DEPTH;
  const hasNotch = notchBottom - notchTop >= 2 * r;

  const arc = (radius: number, convex: boolean, x: number, y: number) =>
    `A${radius} ${radius} 0 0 ${convex ? 1 : 0} ${round(x)} ${round(y)}`;

  // Clockwise from the top-left corner.
  const commands = [
    `M${round(left)} ${round(top + R)}`,
    arc(R, true, left + R, top),
    `H${round(slotStart - R)}`,
    arc(R, true, slotStart, top + R),
    `V${round(slotBottom - r)}`,
    arc(r, false, slotStart + r, slotBottom),
    `H${round(slotEnd - r)}`,
    arc(r, false, slotEnd, slotBottom - r),
    `V${round(top + R)}`,
    arc(R, true, slotEnd + R, top),
    `H${round(right - R)}`,
    arc(R, true, right, top + R),
    `V${round(bottom - R)}`,
    arc(R, true, right - R, bottom),
    `H${round(tabEnd + TAB_R)}`,
    arc(TAB_R, false, tabEnd, bottom + TAB_R),
    `V${round(tabBottom - TAB_R)}`,
    arc(TAB_R, true, tabEnd - TAB_R, tabBottom),
    `H${round(tabStart + TAB_R)}`,
    arc(TAB_R, true, tabStart, tabBottom - TAB_R),
    `V${round(bottom + TAB_R)}`,
    arc(TAB_R, false, tabStart - TAB_R, bottom),
    `H${round(left + R)}`,
    arc(R, true, left, bottom - R),
  ];
  if (hasNotch) {
    commands.push(
      `V${round(notchBottom + R)}`,
      arc(R, true, left + R, notchBottom),
      `H${round(notchRight - r)}`,
      arc(r, false, notchRight, notchBottom - r),
      `V${round(notchTop + r)}`,
      arc(r, false, notchRight - r, notchTop),
      `H${round(left + R)}`,
      arc(R, true, left, notchTop - R),
    );
  }
  commands.push('Z');
  return commands.join(' ');
}
