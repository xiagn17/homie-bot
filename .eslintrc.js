module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', '@typescript-eslint', 'prettier', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'eslint:recommended',
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', '**/node_modules', '**/build', '**/dist', '**/*-cache'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    "curly": "error",
    "indent": "off",
    "linebreak-style": ["error", "unix"],
    "lines-between-class-members": ["error", "always"],
    "sort-keys": "off",
    "sort-imports": "off",
    "import/order": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": ["**/tests/**"]
      }
    ],
    "no-duplicate-imports": "error",
    "no-trailing-spaces": "error",
    "no-import-assign": "error",
    "no-unsafe-finally": "off",
    "no-console": [
      "error",
      {
        "allow": ["info", "warn", "error"]
      }
    ],
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/array-type": [
      "error",
      {
        "default": "array"
      }
    ],
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/typedef": [
      "error",
      {
        "arrayDestructuring": false,
        "arrowParameter": false,
        "memberVariableDeclaration": true,
        "objectDestructuring": false,
        "parameter": true,
        "propertyDeclaration": true,
        "variableDeclaration": false,
        "variableDeclarationIgnoreFunction": false
      }
    ],
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "args": "none"
      }
    ],
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": true
      }
    ],
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "@typescript-eslint/member-delimiter-style": "off",
    "react/prefer-stateless-function": "off",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/restrict-plus-operands": "warn",
    "react/prop-types": "off"
  },
};
