// Example Vitest settings: a simulated browser for the tests,
// and coverage thresholds that fail the build if coverage drops.
//
// Setup:
//   npm install --save-dev vitest @vitest/coverage-v8 happy-dom
//   Copy this file to the root of your project as vitest.config.ts,
//   or merge the "test" section into the config you already have.
//
// Add these scripts to package.json, since ci.yml runs them:
//   "test": "vitest run",
//   "test:coverage": "vitest run --coverage",
//   "typecheck": "tsc --noEmit"

import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // A separate vitest.config.ts does not read vite.config.ts, so imports
  // like "@/components/Button" would fail to resolve. Lovable projects map
  // "@" to the src folder, so map it here too. If your vite.config.ts has
  // other aliases, copy them here as well. (Copy only the aliases, not the
  // build plugins, which can break tests.)
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  test: {
    // Pretend to be a browser, so pages can render in tests.
    environment: "happy-dom",

    coverage: {
      provider: "v8",
      // json-summary feeds the coverage table in ci.yml.
      // lcov is what Codecov reads, if you use it.
      reporter: ["text", "lcov", "json-summary"],

      // Count every source file, not just the ones a test happens to
      // import. Without this, a new file with no tests at all is left out
      // of the numbers, and coverage looks better than it is.
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.d.ts",
        // Generated UI components, left out the same way lint leaves
        // them out. Remove this line if you want them counted.
        "src/components/ui/**",
      ],

      // The build fails if coverage drops below these.
      // Start where you are, then raise them as you go.
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
});
