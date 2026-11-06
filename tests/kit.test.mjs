// Tests for the kit itself, using Node's built-in test runner.
// No packages to install, so the kit stays a minimal Node project.
//
// Each test only checks files that exist, so the tests pass while the
// kit is being added one pull request at a time.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { KIT_FILES } from "../scripts/check-kit.mjs";

const read = (f) => readFileSync(f, "utf8");
const present = KIT_FILES.filter((f) => existsSync(f));

test("ruleset.json is valid JSON with rules GitHub can import", { skip: !existsSync("ruleset.json") }, () => {
  const ruleset = JSON.parse(read("ruleset.json"));
  assert.equal(ruleset.target, "branch");
  assert.ok(Array.isArray(ruleset.rules), "ruleset needs a list of rules");

  const branches = ruleset.conditions.ref_name.include;
  assert.ok(branches.includes("refs/heads/main"), "ruleset should protect main");
  assert.ok(branches.includes("refs/heads/dev"), "ruleset should protect dev");

  const types = ruleset.rules.map((r) => r.type);
  assert.ok(types.includes("pull_request"), "ruleset should require a pull request");
});

test(
  "the check the ruleset requires matches the CI job name",
  { skip: !existsSync("ruleset.json") || !existsSync(".github/workflows/ci.yml") },
  () => {
    const ruleset = JSON.parse(read("ruleset.json"));
    const checks = ruleset.rules.find((r) => r.type === "required_status_checks");
    const required = checks.parameters.required_status_checks.map((c) => c.context);

    // Job names sit two spaces in, directly under "jobs:".
    const jobs = [...read(".github/workflows/ci.yml").matchAll(/^ {2}([\w-]+):\s*$/gm)].map((m) => m[1]);

    for (const name of required) {
      assert.ok(jobs.includes(name), `ruleset requires "${name}" but ci.yml has no job by that name`);
    }
  },
);

test("the issue template has the front matter GitHub needs", { skip: !existsSync(".github/ISSUE_TEMPLATE/build-step.md") }, () => {
  const text = read(".github/ISSUE_TEMPLATE/build-step.md");
  const frontMatter = text.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(frontMatter, "template must start with front matter between --- lines");
  assert.match(frontMatter[1], /^name: .+/m, "front matter needs a name");
  assert.match(frontMatter[1], /^about: .+/m, "front matter needs an about");
});

test("the brief template fits in project knowledge", { skip: !existsSync("docs/brief-template.md") }, () => {
  // Lovable's project knowledge holds 10,000 characters. The empty template
  // should leave most of that for your product.
  assert.ok(read("docs/brief-template.md").length < 5000, "brief template is too long");
});

// Regression test: the build check used to compare a URL to a file path,
// so in a folder with spaces in its name it skipped itself and passed.
test("the build check still runs from a folder with spaces in its name", () => {
  const root = mkdtempSync(join(tmpdir(), "kit-"));
  const dir = join(root, "kit with spaces");
  mkdirSync(join(dir, "scripts"), { recursive: true });
  copyFileSync("scripts/check-kit.mjs", join(dir, "scripts", "check-kit.mjs"));

  try {
    // No kit files in this folder, and KIT_COMPLETE is set, so it must fail.
    const run = spawnSync(process.execPath, ["scripts/check-kit.mjs"], {
      cwd: dir,
      env: { ...process.env, KIT_COMPLETE: "1" },
      encoding: "utf8",
    });
    assert.equal(run.status, 1, "expected the check to run and fail");
    assert.match(run.stdout, /missing README\.md/, "expected the check to list missing files");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

// examples.yml runs the coverage summary from ci.yml on the sample app, so
// the copy users take gets tested. That only works if the two stay the same.
test("examples.yml uses the same coverage summary script as ci.yml", { skip: !existsSync(".github/workflows/examples.yml") }, () => {
  const script = (f) => read(f).match(/node -e '\n([\s\S]*?)\n\s*'\n/)?.[1];
  const ci = script(".github/workflows/ci.yml");
  assert.ok(ci, "couldn't find the coverage summary script in ci.yml");
  assert.equal(script(".github/workflows/examples.yml"), ci, "the coverage summary scripts have drifted apart");
});

test("no em dashes anywhere (house style)", () => {
  for (const f of present) {
    assert.ok(!read(f).includes("\u2014"), `${f} contains an em dash`);
  }
});
