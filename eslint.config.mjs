import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist/", "public/js/paged.polyfill.min.js", "jest.config.js"],
  },
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@stylistic/semi": ["error", "always"],
      "@stylistic/semi-spacing": ["error", {"before": false, "after": true}],
      "@stylistic/semi-style": ["error", "last"],
    }
  }
);