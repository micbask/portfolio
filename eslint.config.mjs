import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  /*
   * Recharts is allowed on the demo dashboard and nowhere else. Pulling it, or
   * anything that imports it, into another route would drag a charting runtime
   * into a page whose whole job is to appear instantly.
   */
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["app/demo/**", "components/demo/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "recharts",
              message: "Recharts belongs to the demo dashboard only.",
            },
          ],
          patterns: [
            {
              group: ["@/components/demo/*", "**/components/demo/*"],
              message: "Demo components belong to the demo route only.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
