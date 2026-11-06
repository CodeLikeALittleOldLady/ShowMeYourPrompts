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

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Pretend to be a browser, so pages can render in tests.
    environment: "happy-dom",

    coverage: {
      provider: "v8",
      // json-summary feeds the coverage table in ci.yml.
      // lcov is what Codecov reads, if you use it.
      reporter: ["text", "lcov", "json-summary"],

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
