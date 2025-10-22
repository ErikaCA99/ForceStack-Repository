import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, extends: ["js/recommended"], 
    languageOptions: { 
        globals: {
          ...globals.browser,
          ...globals.node
        }
    },
    extends: [js.configs.recommended],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "semi" : ["error", "always"],
      "quotes": ["error", "double"]
    }
  },
]);