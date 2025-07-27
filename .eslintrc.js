module.exports = {
  root: true,
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier"
  ],
  plugins: ["@typescript-eslint", "react"],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    project: "./tsconfig.json"
  },
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "@typescript-eslint/no-explicit-any": "off"
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};
