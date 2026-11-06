// The kit's "build".
//
// This repository has no app to build, so "build" checks that the kit is
// complete: every file the README promises is here. CI runs it on every
// pull request, the same way it would build a real app.

import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const KIT_FILES = [
  "README.md",
  "LICENSE",
  "GLOSSARY.md",
  "ruleset.json",
  ".github/workflows/ci.yml",
  ".github/ISSUE_TEMPLATE/build-step.md",
  "docs/brief-template.md",
  "examples/accessibility.test.tsx",
  "examples/vitest.config.ts",
  "examples/eslint-a11y.js",
];

// Only run the check when this file is run directly, not when a test imports it.
// import.meta.url is a URL (spaces become %20), and process.argv[1] is a file
// path, so convert the path to a URL before comparing. Comparing them as plain
// strings silently skipped the whole check in folders with spaces in the name.
const runDirectly = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (runDirectly) {
  const missing = KIT_FILES.filter((f) => !existsSync(f));

  for (const f of KIT_FILES) {
    console.log(`${missing.includes(f) ? "missing" : "found  "} ${f}`);
  }

  // Files are added one pull request at a time, so a missing file is a
  // warning while the kit is being built, not a failure. Set KIT_COMPLETE=1
  // to make it a failure once everything is in.
  if (missing.length > 0) {
    const level = process.env.KIT_COMPLETE ? "error" : "warning";
    console.log(`::${level}::${missing.length} kit file(s) not added yet`);
    if (process.env.KIT_COMPLETE) process.exit(1);
  }
}
