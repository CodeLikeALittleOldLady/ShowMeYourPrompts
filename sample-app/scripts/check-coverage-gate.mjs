// Checks that the coverage gate in examples/vitest.config.ts counts files no
// test imports.
//
// Every file in this app is imported by a test, so the normal run reports 100%
// whether or not the config's coverage "include" is there. This adds a
// temporary module that nothing imports, runs coverage, and expects:
//   1. the module shows up in the report, 0% covered
//   2. the thresholds fail because of it
// The module is always deleted afterwards. The report goes to a separate
// folder, so the real coverage/ folder from the normal run isn't touched.

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const probe = fileURLToPath(new URL("../src/coverage-probe.tmp.ts", import.meta.url));
const reports = mkdtempSync(join(tmpdir(), "coverage-gate-"));

// Plenty of untested code, so it outweighs the real app as the app grows.
const functions = Array.from(
  { length: 50 },
  (_, i) => `export function probe${i}(x: number) {\n  if (x > ${i}) {\n    return x - ${i};\n  }\n  return ${i};\n}\n`,
);

const failures = [];
try {
  writeFileSync(probe, `// Temporary file from scripts/check-coverage-gate.mjs. Safe to delete.\n\n${functions.join("\n")}`);

  const run = spawnSync(
    "npx",
    ["vitest", "run", "--coverage", "--coverage.reporter=json-summary", `--coverage.reportsDirectory=${reports}`],
    { cwd: fileURLToPath(new URL("..", import.meta.url)), encoding: "utf8" },
  );
  const output = `${run.stdout}\n${run.stderr}`;

  const summaryFile = join(reports, "coverage-summary.json");
  const summary = existsSync(summaryFile) ? JSON.parse(readFileSync(summaryFile, "utf8")) : {};
  const probeEntry = Object.entries(summary).find(([file]) => file.endsWith("coverage-probe.tmp.ts"))?.[1];

  if (!probeEntry) {
    failures.push("the unimported module is missing from the coverage report, so coverage.include isn't working");
  } else if (probeEntry.lines.pct !== 0) {
    failures.push(`the unimported module shows ${probeEntry.lines.pct}% line coverage, expected 0%`);
  }
  if (run.status === 0) {
    failures.push("coverage passed with an untested module, so the thresholds aren't failing the run");
  } else if (!/does not meet global threshold/.test(output)) {
    failures.push(`coverage failed, but not because of the thresholds:\n${output.slice(-2000)}`);
  }
} finally {
  rmSync(probe, { force: true });
  rmSync(reports, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const f of failures) console.error(`coverage gate: ${f}`);
  process.exit(1);
}
console.log("coverage gate: an untested, unimported module is counted at 0% and fails the thresholds");
