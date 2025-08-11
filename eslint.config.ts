import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  // Ignorer les fichiers générés et les dépendances
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      ".turbo/**",
      // Fichiers générés par Prisma
      "prisma/generated/**",
      "lib/prisma-client-js/**",
      ".prisma/**",
      "prisma/client/**",
      // Autres fichiers à ignorer
      "**/*.min.js",
      "**/*.bundle.js",
      "public/**",
      "coverage/**",
      ".env*",
      "*.config.js",
      "*.config.mjs",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Désactiver les règles problématiques que vous mentionnez
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-this-alias": "off",

      // Règles React/JSX plus permissives
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off", // Permet les apostrophes et guillemets dans JSX
      "react/no-unknown-property": "off", // Permet les propriétés personnalisées comme jsx, global
      "react/prop-types": "off", // Pas besoin avec TypeScript

      // Variables et expressions
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-unused-expressions": "off",

      // Règles pour une meilleure expérience de développement
      "no-console": "warn",
      "prefer-const": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    // Configuration spécifique pour les fichiers Next.js
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      // Permettre require() dans les fichiers de configuration
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
