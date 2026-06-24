import next from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': next,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      'no-console': ['warn', { allow: ['error', 'warn'] }],
    },
  },
];

export default eslintConfig;
