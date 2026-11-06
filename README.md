# Show Me Your Prompts: Starter Kit

A small set of files to start a project the way I built **What the Plate?** for #SheBuilds.

This repository goes with the series *Show Me Your Prompts* on [Code Like a Little Old Lady](https://www.codelikealittleoldlady.com). Each file here maps to one of the essays, so if you want the "why" behind a file, the essay is the place to look.

Take as little or as much as you want. This is the way I work, not the only way.

---

## See it in a real project

This kit is the empty version. For the full version, with every step filled in, look at the **What the Plate?** repository from #SheBuilds:

**[plate-ponderings on GitHub](https://github.com/alisonmaclellancreates/plate-ponderings)**

A few places to start:

- **[All 69 steps, in order](https://github.com/alisonmaclellancreates/plate-ponderings/issues?q=is%3Aissue+sort%3Acreated-asc)**: every issue from the build, open and closed
- **[Step 40, the brief](https://github.com/alisonmaclellancreates/plate-ponderings/issues/27)**: a step with the `alison` label, done by me rather than Sully
- **[Pull requests](https://github.com/alisonmaclellancreates/plate-ponderings/pulls?q=is%3Apr)**: the checks and reviews on each change
- **`docs/brief.md`**: the brief that went into project knowledge

Where this kit and that repository differ, it's usually because I learned something during the build. One example: plate-ponderings uses a single milestone for the whole project. I'd recommend one milestone per feature.

---

## What's inside

| File | What it does | Essay |
|---|---|---|
| `docs/brief-template.md` | A template for your product brief, the description Sully reads with every prompt | We Don't Start From Zero |
| `.github/ISSUE_TEMPLATE/build-step.md` | One issue per step: number, branch, checklist, prompt | My Prompts Live in GitHub |
| `ruleset.json` | Protects `main` and `dev` so every change comes through a pull request | Before the First Prompt |
| `.github/workflows/ci.yml` | Lints, type-checks, tests with coverage, and builds every pull request into `dev` or `main` | One Prompt, One Branch, One Review |
| `examples/accessibility.test.tsx` | An accessibility test using axe-core, so every pull request is checked | One Prompt, One Branch, One Review |
| `examples/vitest.config.ts` | Test settings, with coverage thresholds that fail the build | One Prompt, One Branch, One Review |
| `examples/eslint-a11y.js` | Accessibility rules for lint, so problems are caught while the code is written | One Prompt, One Branch, One Review |
| `package.json`, `tests/`, `scripts/` | Makes this kit a tiny Node project, so the same CI runs on the kit itself (see below) | |
| `GLOSSARY.md` | Every term from the series, in one place | All of them |
| `LICENSE` | MIT. Copy it, change it, make it yours. | |

---

## How to use it

### 1. Start your project in Lovable

Create a simple project in Lovable, then connect it to GitHub from **More → Settings → Git**. Lovable creates the repository for you, with a `main` branch.

### 2. Create a `dev` branch

On Lovable's Git page, select `main` from the branch pulldown and create a branch called `dev`. Switch Lovable to `dev`, so the preview site shows your work in progress.

### 3. Copy in these files

Add the files from this kit to your new repository. A few notes:

- **`ci.yml`** must live in `.github/workflows/`. GitHub only runs workflow files from that folder.
- **The issue template** must live in `.github/ISSUE_TEMPLATE/`. Once it's there, GitHub offers it when you create a new issue.
- **The brief** goes in `docs/brief.md`. Fill it in, then paste the same text into Lovable's project knowledge (10,000-character limit). Keep both copies in sync.

### 4. Set up tests, coverage, and accessibility

The files in `examples/` give you a test harness with code coverage and two layers of accessibility checks.

- **`vitest.config.ts`** goes at the root of your project. Its coverage thresholds fail the build if coverage drops. Start them where your project is today and raise them over time.
- **`accessibility.test.tsx`** goes in your tests folder. Point it at a page in your app and add one test per page. Add tests for dialogs too, and check those against the whole page (`document.body`), since dialogs usually render outside the component that opens them.
- **`eslint-a11y.js`** shows the accessibility rules to add to your existing ESLint config. Lint catches problems as the code is written, like an image with no alt text. The axe tests catch what only shows up in the rendered page.

Each file lists the packages to install and the `package.json` scripts that the CI workflow expects.

Accessibility runs inside lint and the tests, so there's no separate workflow. If a page has a problem, the pull request gets a red X.

Each run also writes a **coverage table** onto its summary page in GitHub (open the run from the pull request's checks), so you can see the numbers without downloading anything.

**One limit to know about:** axe-core runs in a simulated browser here, which can't work out real colors, so the color-contrast check is turned off. Check contrast in a real browser, for example with Accessibility Insights, especially after design changes.

### 5. Import the ruleset

In your repository on GitHub, go to **Settings → Rules → Rulesets → New ruleset → Import a ruleset**, and choose `ruleset.json`.

The ruleset:

- applies to `main` and `dev`
- requires a pull request for every change
- requires the `build` check from the CI workflow to pass before merging
- requires review conversations to be resolved
- blocks deleting or force-pushing those branches

**A note for solo builders:** the ruleset requires a pull request but **zero** human approvals. GitHub doesn't let you approve your own pull request, so requiring an approval would lock you out. Your AI reviewers still review every change; you decide when to merge.

The `build` check won't exist until the CI workflow has run at least once. Add it first, open a pull request so it runs, then import the ruleset.

### 6. Work the loop

For every issue:

1. Create a feature branch from `dev`, named for the step (for example `feature/40-brief`)
2. Switch Lovable to that branch and give Sully the prompt
3. Open a pull request into `dev`
4. Let the checks run and the reviewers review
5. Fix anything that comes up, then merge
6. Switch Lovable back to `dev` and check the preview

When a whole feature is done, open a pull request from `dev` into `main`, review again, merge, and publish.

---

## Why this kit is a Node project

The CI workflow installs packages from a lock file, runs the tests, and builds. The first time it ran on this kit, it failed: the kit had no app, so there was no lock file to install from. A red X on the very first pull request.

Instead of giving the kit a different workflow, I made the kit a tiny Node project, so it runs the exact same `ci.yml` you'll copy into your app:

- **`npm test`** runs `tests/kit.test.mjs`, using Node's built-in test runner, so there's nothing to install. The tests check that `ruleset.json` is valid, that the check it requires matches the job name in `ci.yml`, that the issue template has what GitHub needs, that the brief template leaves room in project knowledge, and that no file contains an em dash.
- **`npm run build`** runs `scripts/check-kit.mjs`, which lists any kit files that haven't been added yet.

You don't need these three in your own app. Your app already has a `package.json`, real tests, and a real build.

## The step numbering

Steps are numbered so each section starts on a multiple of 10. If a section takes 7 steps, they're 20 to 26, and the next section starts at 30. The gaps leave room for the steps you always find you missed.

GitHub numbers issues in the order you create them, so issue numbers and step numbers won't match. The step number goes in the title.

---

## Before you rely on it

- **`ci.yml` assumes a Node project** with `npm` scripts and a `package-lock.json`. The cache step fails without a lock file, so commit yours. If your project uses Bun (some Lovable templates do), swap the install and run steps for `bun install --frozen-lockfile` and `bun run`. If your scripts are named differently, adjust the steps.
- **Actions are referenced by version tag** (like `@v4`) to keep the file readable. For extra safety, you can pin each action to an exact commit instead, so a changed action can't slip into your build.
- **Rulesets change over time.** If GitHub rejects the import, create the ruleset by hand using the list above.

---

Built by Alison MacLellan, with a lot of help from the Inner Chamber.
