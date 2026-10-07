import { defineConfig } from '@playwright/test';

const DEV_PORT = 4400;
const STATIC_PORT = 4410;

/**
 * Smoke-tests every Storybook entry (stories and MDX docs) in both the dev
 * server and the static build, because they use different compilation paths.
 * Uses the system Chrome (preinstalled on GitHub-hosted Ubuntu runners).
 */
export default defineConfig({
  testDir: './storybook-smoke',
  outputDir: '../../../dist/test-output/shared-ui/storybook-smoke',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: { channel: 'chrome', trace: 'retain-on-failure' },
  projects: [
    { name: 'dev', use: { baseURL: `http://localhost:${DEV_PORT}` } },
    { name: 'static', use: { baseURL: `http://localhost:${STATIC_PORT}` } },
  ],
  webServer: [
    {
      command: `npx nx run shared-ui:storybook --ci --port=${DEV_PORT}`,
      url: `http://localhost:${DEV_PORT}/index.json`,
      reuseExistingServer: !process.env['CI'],
      timeout: 180_000,
      cwd: '../../..',
    },
    {
      command: `npx vite preview --outDir dist/storybook/shared-ui --port ${STATIC_PORT} --strictPort`,
      url: `http://localhost:${STATIC_PORT}/index.json`,
      reuseExistingServer: !process.env['CI'],
      timeout: 60_000,
      cwd: '../../..',
    },
  ],
});
