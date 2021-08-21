module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/member-delimiter-style': [
          'error',
          { singleline: { delimiter: 'semi' }, multiline: { delimiter: 'none' } },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': [
          'error',
          { 'ts-ignore': 'allow-with-description', 'ts-expect-error': 'allow-with-description' },
        ],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_', ignoreRestSiblings: true },
        ],
        // TODO: Find a way to make JS imports work from TypeScript files
        'import/named': 'off',

        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'error',

        // This rule reports TS enums as issues, see https://github.com/typescript-eslint/typescript-eslint/issues/325
        'no-shadow': 'off',
      },
    },
    {
      files: ['**/types-ts/global.d.ts', '**/types-ts/index.d.ts'],
      rules: {
        'import/no-unresolved': 'off',
        'import/first': 'off',
        'max-classes-per-file': 'off',
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
    {
      files: ['*.test.ts', '*.test.tsx'],
      excludedFiles: ['app/components/@vinted/**'], // components/@vinted holds obsolete DS components
      parser: '@typescript-eslint/parser',
      plugins: ['testing-library'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'testing-library/prefer-user-event': 'error',
        'testing-library/await-async-query': 'error',
        'testing-library/await-async-utils': 'error',
        'testing-library/no-await-sync-events': 'error',
        'testing-library/no-await-sync-query': 'error',
        'testing-library/no-promise-in-fire-event': 'error',
        'testing-library/no-wait-for-empty-callback': 'error',
        'testing-library/no-wait-for-multiple-assertions': 'error',
        'testing-library/no-wait-for-side-effects': 'error',
        'testing-library/no-wait-for-snapshot': 'error',
        'testing-library/prefer-find-by': 'error',
        'testing-library/prefer-wait-for': 'error',
        'testing-library/no-unnecessary-act': ['error', { isStrict: true }],
        'testing-library/no-container': 'error',
        'testing-library/no-debug': 'error',
        'testing-library/no-dom-import': 'error',
        'testing-library/no-manual-cleanup': 'error',
        'testing-library/no-node-access': 'error',
        'testing-library/no-render-in-setup': 'error',
        'testing-library/prefer-explicit-assert': ['error', { assertion: 'toBeInTheDocument' }],
        'testing-library/prefer-presence-queries': 'error',
        'testing-library/prefer-query-by-disappearance': 'error',
      },
    },
    {
      files: ['*.test.js', '*.stories.js'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
  globals: {
    Backbone: true,
    MD: true,
    jsdom: true,
    googletag: true,
  },
  env: {
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    //----------------------------------------------------------------------------------------------
    // Rules that are already covered by TypeScript
    //----------------------------------------------------------------------------------------------

    'import/namespace': 'off',
    'react/require-render-return': 'off',
    'react/no-this-in-sfc': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-undef': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-no-duplicate-props': 'off',
    'react/require-default-props': 'off',
    'react/default-props-match-prop-types': 'off',
    'react/prop-types': 'off',

    //----------------------------------------------------------------------------------------------
    // Import rules
    //----------------------------------------------------------------------------------------------

    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.d.ts',
          '**/*.test.{js,ts,tsx}',
          '**/__tests__/**',
          '**/*.stories.{js,ts,tsx}',
          'scripts/**/*.js',
        ],
      },
    ],

    // Inconvenient rule for many cases where named exports are desired but can be singular in a
    // file, for example: constants, factories, transformers, etc.
    'import/prefer-default-export': 'off',

    // Grouping and ordering imports by their origin makes the maintenance easier.
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index', 'unknown', 'object'],
        ],
        'newlines-between': 'always-and-inside-groups',
      },
    ],

    // Redux connected React components also have unconnected named exports for testing.
    // For example: export { MyComponent }; export default connect(...)(MyComponent).
    'import/no-named-as-default': 'off',

    // Detecting cycles for external packages is usually out of application scope. Ignoring external
    // dependencies also makes the rule faster.
    'import/no-cycle': ['error', { ignoreExternal: true }],

    // Overrides Airbnb base rule to also ignore TypeScript related extensions.
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    //----------------------------------------------------------------------------------------------
    // General rules
    //----------------------------------------------------------------------------------------------

    // It is inconvenient to make class methods static just because they do not use 'this',
    // especially in React class components where render function can be split into multiple
    // functions for better maintainability.
    'class-methods-use-this': 'off',

    // Currently not feasable to have this enabled due to DTOs and inconsistent or incomplete data
    // transformations.
    camelcase: 'off',

    // Deter poor (obscure, ambiguous) variable, parameter and function naming.
    'id-length': ['error', { min: 2, exceptions: ['_'] }],

    // Customized from airbnb with immer exception.
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'acc', // for reduce accumulators
          'accumulator', // for reduce accumulators
          'draft', // for immer mutations
        ],
      },
    ],

    //----------------------------------------------------------------------------------------------
    // Airbnb React overrides
    //----------------------------------------------------------------------------------------------

    // Overridden to support TSX.
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    // Prefer defining state as a static property.
    'react/state-in-constructor': ['error', 'never'],
    // Prefer making static properties part of the class.
    'react/static-property-placement': ['error', 'static public field'],
    // Make the rule compatible with react-intl.
    'react/style-prop-object': [
      'error',
      {
        allow: ['FormattedNumber', 'FormattedRelativeTime'],
      },
    ],
    // Requires too many changes and is not relevant for functional components.
    'react/sort-comp': 'off',
    // Classes is the de facto way of creating non-functional React components, so enforcing classes
    // is redundant. Also, functional components are preferred anyway.
    'react/prefer-es6-class': 'off',

    //----------------------------------------------------------------------------------------------
    // TODO Rules
    //
    // Rules that are not addressed, unified or agreed upon yet.
    //----------------------------------------------------------------------------------------------

    // Remove it after https://github.com/yannickcr/eslint-plugin-react/pull/2977 is released.
    'react/void-dom-elements-no-children': 'off',

    'react/jsx-props-no-spreading': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-did-update-set-state': 'off',
    'react/no-array-index-key': 'off',

    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',

    // TODO: remove after/if applying airbnb-react.
    'no-underscore-dangle': [
      'error',
      {
        allow: ['__REDUX_DEVTOOLS_EXTENSION__'],
        allowAfterThis: false,
        allowAfterSuper: false,
        enforceInMethodNames: true,
      },
    ],
  },
}
