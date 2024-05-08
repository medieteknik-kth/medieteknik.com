import js from '@eslint/js'
import importSortPlugin from 'eslint-plugin-simple-import-sort';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import nextPlugin from 'eslint-config-next';
import globals from 'globals';
import tseslint from 'typescript-eslint'

const typeScriptConfig = [
  ...tseslint.configs.strictTypeChecked,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
  },
];

const nextConfig = {
  plugins: {
    '@next/next': nextPlugin,
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules
  },
};

const importSortConfig = {
  plugins: {
    'simple-import-sort': importSortPlugin,
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};

export default tseslint.config(
  {
    ignores: ['.next', '**/*.d.ts', 'node_modules', '**/node_modules/', 'public', 'src/app/i18n/**/'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  ...typeScriptConfig,
  nextConfig,
  prettierRecommended,
  importSortConfig,
);