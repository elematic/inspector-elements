import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-non-null-assertion": "error"
    },
  },
];

// export default {
//   languageOptions: {
//     parser,
//   },
//   // parser: '@typescript-eslint/parser',
//   parserOptions: {
//     ecmaVersion: 2023,
//     sourceType: 'module',
//   },
//   plugins: ['@typescript-eslint', 'prettier'],
//   extends: [
//     'plugin:@typescript-eslint/recommended',
//     'prettier',
//     'plugin:storybook/recommended',
//   ],
//   rules: {
//     'prettier/prettier': ['error'],
//     '@typescript-eslint/ban-ts-comment': 'warn',
//   },
//   ignorePatterns: ['node_modules'],
// };
