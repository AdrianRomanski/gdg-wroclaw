import { expect, test, type ConsoleMessage } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface IndexEntry {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
}

// Entries come from the static build's index (built by the `build-storybook` dependency).
const index = JSON.parse(
  readFileSync(
    join(import.meta.dirname, '../../../dist/storybook/index.json'),
    'utf8',
  ),
) as { entries: Record<string, IndexEntry> };

const IGNORED_CONSOLE_ERRORS = [/favicon\.ico/, /Failed to load resource.*404/];

for (const entry of Object.values(index.entries)) {
  test(`${entry.title} › ${entry.name} renders without errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message: ConsoleMessage) => {
      if (
        message.type() === 'error' &&
        !IGNORED_CONSOLE_ERRORS.some((pattern) => pattern.test(message.text()))
      ) {
        errors.push(message.text());
      }
    });

    const viewMode = entry.type === 'docs' ? 'docs' : 'story';
    await page.goto(`/iframe.html?id=${entry.id}&viewMode=${viewMode}`);

    const root = page.locator(
      viewMode === 'docs' ? '#storybook-docs' : '#storybook-root',
    );
    // Something rendered: text, or graphics only (icons, icon-only buttons).
    await expect(
      root.getByText(/\S/).or(root.locator('svg, img')).first(),
    ).toBeVisible();
    await expect(page.locator('.sb-show-errordisplay')).toHaveCount(0);

    const blue500 = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--gdg-color-blue-500')
        .trim(),
    );
    expect(blue500, 'design tokens CSS is loaded').toBe('#4285f4');

    expect(errors).toEqual([]);
  });
}
