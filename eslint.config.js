import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // Generated code and build output are not ours to lint.
  { ignores: ['dist', 'node_modules', 'src/contracts', 'coverage'] },

  // TypeScript sources — type-aware.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
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
      // Underscore prefix = deliberately unused (matches tsc's convention).
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // Mirrors the backend's `noRandomUuid` scalafix ban: wire values are converted
      // at the boundary (src/api/datetime.ts), everything else uses Temporal.
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

  // The one file allowed to touch Date: the wire-boundary mapper.
  {
    files: ['src/api/datetime.ts'],
    rules: { 'no-restricted-globals': 'off' },
  },

  // Plain JS (SSR server, scripts) — no type information available.
  {
    files: ['**/*.{js,mjs}'],
    extends: [js.configs.recommended, prettier],
    languageOptions: { globals: globals.node },
  },
)
