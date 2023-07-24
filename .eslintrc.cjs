module.exports = {
  env: {
    browser: true,
    es2021: true,
    webextensions: true,
  },
  extends: ['airbnb-base', 'prettier', 'plugin:react/recommended'],
  plugins: ['prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-underscore-dangle': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['@popup', './src/popup'],
          ['@options', './src/options'],
          ['@assets', './src/assets'],
          ['@images', './src/assets/images'],
          ['@styles', './src/assets/styles'],
          ['@data', './src/assets/data'],
        ],
      },
    },
  },
};
