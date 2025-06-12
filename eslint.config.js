// eslint.config.js
const expoConfig = require("eslint-config-expo/flat");
const pluginPrettier = require("eslint-plugin-prettier");
const pluginReact = require("eslint-plugin-react");
const pluginReactNative = require("eslint-plugin-react-native");
const pluginReactHooks = require("eslint-plugin-react-hooks");
const { defineConfig } = require("eslint/config");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,

  {
    ignores: ["dist/**/*"],
  },

  {
    plugins: {
      prettier: pluginPrettier,
      react: pluginReact,
      "react-native": pluginReactNative,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      "prettier/prettier": "warn",
      "react-native/no-unused-styles": "error",
      "react-native/split-platform-components": "error",
      "react-native/no-raw-text": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
]);
