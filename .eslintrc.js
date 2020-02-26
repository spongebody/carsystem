module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  globals: {
    buildConfig: true
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: "babel-eslint",
    parserOptions: {
      ecmaFeatures: {
        experimentalObjectRestSpread: true,
        jsx: true
      },
      sourceType: "module",
      ecmaVersion: 7
    }
  }
}
