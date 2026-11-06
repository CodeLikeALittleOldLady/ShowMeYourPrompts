// Copies the kit's examples/ files into this app, where a user would put them.
//
// The copies are not committed (see .gitignore), so the app always tests the
// examples exactly as they are in the kit, and the two can't drift apart.
//
// examples/vitest.config.ts         -> vitest.config.ts
// examples/accessibility.test.tsx   -> tests/accessibility.test.tsx (plus a cleanup check, below)
// examples/eslint-a11y.js           -> eslint-a11y.js (imported by eslint.config.js)

import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const app = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const kit = (p) => fileURLToPath(new URL(`../../examples/${p}`, import.meta.url));

copyFileSync(kit("vitest.config.ts"), app("vitest.config.ts"));
copyFileSync(kit("eslint-a11y.js"), app("eslint-a11y.js"));

// The accessibility example removes each page after its test (afterEach
// cleanup). afterEach only applies inside the file that registers it, so the
// check that cleanup happened has to live in the same file. It's added to the
// end of the copy, so it runs after the example's own tests. If the example
// stops cleaning up, the page it rendered is still there and this test fails.
//
// It brings its own imports, under other names, so it doesn't rely on what the
// example happens to import.
const cleanupCheck = `

// Added by sample-app/scripts/sync-examples.mjs. Not part of the example.
import { expect as expectAfter, it as itAfter } from "vitest";

itAfter("the example removes each page after its test", () => {
  expectAfter(document.body.innerHTML).toBe("");
});
`;

writeFileSync(app("tests/accessibility.test.tsx"), readFileSync(kit("accessibility.test.tsx"), "utf8") + cleanupCheck);

console.log("copied examples/ into sample-app (vitest.config.ts, eslint-a11y.js, tests/accessibility.test.tsx)");
