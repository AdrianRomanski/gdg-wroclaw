import type { Preview } from '@analogjs/storybook-angular';
import '@gdg-wroclaw/shared-ui-tokens/tokens.css';

const preview: Preview = {
  tags: ['autodocs'],
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
