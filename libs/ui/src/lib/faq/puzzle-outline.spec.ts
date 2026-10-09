import { PUZZLE_TAB_HEIGHT, puzzleOutline } from './puzzle-outline';

/** Absolute coordinates of every command end point. */
const points = (path: string) => {
  const result: { x: number; y: number }[] = [];
  let x = 0;
  let y = 0;
  for (const [, command, args] of path.matchAll(/([MAHVZ])([^MAHVZ]*)/g)) {
    const values = args.trim().split(/\s+/).filter(Boolean).map(Number);
    if (command === 'M' || command === 'A') {
      [x, y] = values.slice(-2);
    } else if (command === 'H') {
      x = values[0];
    } else if (command === 'V') {
      y = values[0];
    } else {
      continue;
    }
    result.push({ x, y });
  }
  return result;
};

describe('puzzleOutline', () => {
  it('draws a closed path that stays inside the box', () => {
    const path = puzzleOutline(664, 230);
    expect(path.startsWith('M')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
    for (const { x, y } of points(path)) {
      expect(x).toBeGreaterThanOrEqual(1);
      expect(x).toBeLessThanOrEqual(663);
      expect(y).toBeGreaterThanOrEqual(1);
      expect(y).toBeLessThanOrEqual(229);
    }
  });

  it('cuts the slot, hangs the tab and indents the notch', () => {
    const all = points(puzzleOutline(664, 230));
    const ys = all.map(({ y }) => y);
    // Slot bottom 28px below the top, tab bottom at the box bottom.
    expect(ys).toContain(29);
    expect(Math.max(...ys)).toBe(229);
    // Body bottom sits one tab height above the box bottom.
    expect(ys).toContain(229 - PUZZLE_TAB_HEIGHT);
    // Notch reaches 24px in from the left edge.
    expect(all.map(({ x }) => x)).toContain(25);
  });

  it('keeps fixed depths when the item grows', () => {
    const tall = points(puzzleOutline(664, 600));
    expect(tall.map(({ y }) => y)).toContain(29);
    expect(Math.max(...tall.map(({ y }) => y))).toBe(599);
  });

  it('keeps the notch on collapsed items, drops it when it no longer fits', () => {
    const arcs = (path: string) => path.split('A').length - 1;
    // A collapsed item (question only) is about 100px tall.
    expect(arcs(puzzleOutline(664, 100))).toBe(arcs(puzzleOutline(664, 230)));
    const short = puzzleOutline(664, 85);
    expect(short).not.toBe('');
    expect(arcs(short)).toBe(arcs(puzzleOutline(664, 230)) - 4);
    expect(puzzleOutline(40, 40)).toBe('');
    expect(puzzleOutline(0, 0)).toBe('');
  });
});
