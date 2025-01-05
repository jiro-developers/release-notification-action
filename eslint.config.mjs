import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import _import from 'eslint-plugin-import';



const eslintConfig = [
  ...  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
      import:_import
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'unicorn/numeric-separators-style': ['error', { number: { minimumDigits: 0, groupLength: 3 } }],
      'prefer-const': 'error',
      'sort-imports': [
        'warn',
        {
          ignoreDeclarationSort: true,
        },
      ],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object'],
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'property',
          format: ['camelCase'],
        },
      ],
    },
  }

];

export default eslintConfig;
