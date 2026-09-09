import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // `>` and `}` are the characters that genuinely break JSX and are
      // worth erroring on. Apostrophes and quotes are not: this is a
      // prose-heavy portfolio, and rewriting 51 of them as &apos;/&quot;
      // would make the case-study copy far harder to read and edit in
      // source for zero rendering benefit (React escapes text children
      // correctly on its own). Narrowed rather than disabled.
      'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
