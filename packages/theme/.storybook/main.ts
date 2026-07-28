import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // The overview page renders README.md and documents no story of its own, so
  // it sits here with the configuration rather than under `src`.
  stories: ['./**/*.mdx', '../src/stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
};

export default config;
