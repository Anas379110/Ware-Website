import astroPlugin from "eslint-plugin-astro";
import astroParser from "astro-eslint-parser";
import tsParser from "@typescript-eslint/parser";
export default [
  { ignores: ["dist/**", ".astro/**", "node_modules/**", "coverage/**"] },
  ...astroPlugin.configs["flat/recommended"],
  { files: ["**/*.ts", "**/*.tsx"], languageOptions: { parser: tsParser, sourceType: "module" } },
  { files: ["**/*.astro"], languageOptions: { parser: astroParser, parserOptions: { parser: tsParser, extraFileExtensions: [".astro"] } } }
];
