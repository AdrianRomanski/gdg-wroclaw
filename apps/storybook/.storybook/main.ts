import type { StorybookConfig } from '@analogjs/storybook-angular';

// One Storybook for the whole UI stack (ADR-0013): stories stay next to the code they document.
const config: StorybookConfig = {
  stories: [
    '../../../libs/design-system/tokens/docs/**/*.mdx',
    '../../../libs/design-system/components/src/**/*.@(mdx|stories.ts)',
    '../../../libs/ui/src/**/*.@(mdx|stories.ts)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@analogjs/storybook-angular',
    options: {},
  },
};

export default config;
