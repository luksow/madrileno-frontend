import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'src/contracts', 'coverage'] },

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
      prettier,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      'no-restricted-globals': [
        'error',
        {
          name: 'Date',
          message:
            'Use Temporal (temporal-polyfill). JS Date is allowed only in src/api/datetime.ts, the wire boundary.',
        },
      ],
    },
  },

  {
    files: ['src/api/datetime.ts'],
    rules: { 'no-restricted-globals': 'off' },
  },

  // Vendored shadcn/ui primitives — relax the two rules that false-positive on canonical registry
  // code (variant-helper exports; the generic Label associates at the call site).
  {
    files: ['src/components/ui/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
    },
  },

  {
    files: ['**/*.{js,mjs}'],
    extends: [js.configs.recommended, prettier],
    languageOptions: { globals: globals.node },
  },
)
