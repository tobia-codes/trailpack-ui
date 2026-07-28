import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Stories sit beside the component they document; the only `.mdx` under
  // `src` is a component's own `storybook/` folder. The package overview is
  // the exception, and lives here with the configuration it belongs to.
  stories: [
    './**/*.mdx',
    '../src/components/**/*.stories.tsx',
    '../src/components/**/storybook/**/*.mdx',
  ],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
};

export default config;
