export default [
  {
    ignores: ["node_modules/**", "assets/**", "*.CSV", "package-lock.json"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      eqeqeq: ["error", "always"],
      "no-console": "off",
      "no-constant-condition": ["error", { checkLoops: false }],
      "no-unreachable": "error",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-var": "error",
      "prefer-const": "warn",
    },
  },
];
