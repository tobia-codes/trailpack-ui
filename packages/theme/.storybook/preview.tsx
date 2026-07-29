import type { Preview } from '@storybook/react-vite';
import { withTheme } from './withTheme';

const preview: Preview = {
  decorators: [withTheme],

  initialGlobals: { theme: 'light' },

  globalTypes: {
    theme: {
      description: 'Light or dark theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    layout: 'fullscreen',
    // Storybook opens on the first story in the sidebar, so this is what makes
    // the README the landing page.
    options: { storySort: { order: ['Overview', 'Foundations'] } },
    // The theme toolbar owns the background; Storybook's own background
    // control would paint over it and desynchronise the two.
    backgrounds: { disable: true },
    controls: { disable: true },
  },
};

export default preview;
