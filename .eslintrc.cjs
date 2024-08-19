module.exports = {
  root: true,
  extends: ['plugin:react/jsx-runtime', 'plugin:jsx-a11y/recommended', '@tpzdsp/eslint-config-dsp'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  plugins: ['react-refresh', 'jsx-a11y'],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@/*', 'src/*'],
          ['msw/browser', './node_modules/msw/browser'],
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    },
  },
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'import/no-unassigned-import': ['error', { allow: ['**/*.scss', '**/*.css'] }],
  },
};
