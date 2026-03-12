module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-console": "warn",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^(next|req|res|err)" }],
    "no-process-exit": "off",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": ["error", "always"],
    "curly": ["error", "multi-line"],
    "no-throw-literal": "error",
    "semi": ["error", "always"],
    "quotes": ["error", "double", { allowTemplateLiterals: true }],
  },
};
