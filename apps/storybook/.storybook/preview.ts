import type { Preview } from '@analogjs/storybook-angular';
import '@gdg-wroclaw/design-system-tokens/tokens.css';

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Design token theme (ADR-0027)',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'dark', title: 'Dark (default)' },
          { value: 'light', title: 'Light (partial, from Figma)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [
    (story, { globals }) => {
      const root = document.documentElement;
      if (globals['theme'] === 'light') {
        root.dataset['theme'] = 'light';
      } else {
        delete root.dataset['theme'];
      }
      return story();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Fail stories with WCAG violations once interaction tests run in CI.
      test: 'error',
    },
  },
};

export default preview;
