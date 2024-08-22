import type {StorybookConfig} from '@storybook/web-components-vite';

export default {
  stories: ['../src/stories/**/*.mdx', '../stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
} satisfies StorybookConfig;
