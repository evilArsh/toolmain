import { fileURLToPath } from "node:url"
import path from "node:path"
import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint, { Config } from "typescript-eslint"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import parserVue from "vue-eslint-parser"
import pluginVue from "eslint-plugin-vue"
import pluginPrettier from "eslint-plugin-prettier"
import configPrettier from "eslint-config-prettier/flat"
import pluginPrettierRecommand from "eslint-plugin-prettier/recommended"
import pluginPromise from "eslint-plugin-promise"
import pluginImport from "eslint-plugin-import"
import pluginN from "eslint-plugin-n"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
//eslint inspect：npx @eslint/config-inspector@latest
const cnf: Config = tseslint.config(
  {
    files: ["packages/**/*.{js,mjs,cjs,ts,vue,jsx,tsx}"],
  },
  {
    // If ignores is used without any other keys in the configuration object, then the patterns act as global ignores
    ignores: [
      "*.min.{js,ts,css}",
      "public/",
      ".lintstagedrc*",
      "commitlint*",
      "**/build/",
      "**/out/",
      "**/dist/",
      "**/h5/",
      "**/.vscode/",
      "**/assets/",
      "eslint.config.{mjs,cjs,js,mts}",
      "vitest.config.{ts,mts,js,mjs}",
      "vite.config.{ts,mts,js,mjs}",
      "**/.prettierrc.{mjs,cjs,js}",
      "**/rollup.config.{js,mjs,cjs}",
      "yarn.lock",
      "pnpm-lock.yaml",
      "package-lock.json",
      "uno.config.{ts,mts,js,mjs}",
      "electron.vite.config.{ts,mts,js,mjs}",
    ],
  },
  {
    name: "global-language-config",
    plugins: {
      prettier: pluginPrettier,
      "@typescript-eslint": typescriptEslint,
      import: pluginImport,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        parser: tseslint.parser,
        tsconfigRootDir: __dirname,
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.base.json"],
        extraFileExtensions: [".vue"],
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    name: "vue global config",
    files: ["packages/components/src/**/*.vue"],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  ...pluginVue.configs["flat/strongly-recommended"],
  ...pluginVue.configs["flat/recommended"],
  pluginPromise.configs["flat/recommended"],
  pluginPrettierRecommand,
  {
    name: "vue rules",
    rules: {
      "vue/multi-word-component-names": 0,
      "vue/require-prop-types": 0,
      "vue/one-component-per-file": 0,
      "vue/attributes-order": 0,
      "vue/no-v-html": 0,
    },
  },
  {
    name: "typescript rules",
    rules: {
      "promise/catch-or-return": "off",
      "promise/always-return": "off",
      "@typescript-eslint/no-unused-expressions": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    name: "prettier rules",
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    name: "nodejs rules",
    ignores: ["packages"],
    plugins: {
      n: pluginN,
    },
    rules: {
      "promise/catch-or-return": "off",
      "promise/always-return": "off",
      "n/exports-style": ["error", "module.exports"],
      "n/no-missing-import": "off",
      "n/no-unsupported-features/node-builtins": [
        "error",
        {
          version: ">=18.0.0",
          ignores: [],
        },
      ],
    },
  },
  configPrettier
)
export default cnf
