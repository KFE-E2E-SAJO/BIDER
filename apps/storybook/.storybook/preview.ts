import type { Preview } from '@storybook/react-vite';
import './tailwind.css';
import '@repo/ui/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
