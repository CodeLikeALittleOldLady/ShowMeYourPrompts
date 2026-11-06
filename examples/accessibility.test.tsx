// Accessibility test, using axe-core inside Vitest.
//
// Renders a page in a simulated browser and fails if axe finds
// any accessibility violations. Because it runs with the rest of
// your tests, every pull request gets checked automatically.
//
// Setup:
//   npm install --save-dev axe-core @testing-library/react
//   Copy this file into your tests folder and change the import
//   below to a page from your app. Add one test per page.

import { render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it } from "vitest";

// Change this to a page in your app.
import HomePage from "../src/pages/HomePage";

async function findViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      // A simulated browser can't work out real colors, so contrast
      // checks give false results here. Check contrast in a real
      // browser instead, for example with Accessibility Insights.
      "color-contrast": { enabled: false },
    },
  });

  // Readable failures: which rule, what it means, and how many elements.
  return results.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.length} element${v.nodes.length === 1 ? "" : "s"})`,
  );
}

describe("accessibility", () => {
  it("home page has no axe violations", async () => {
    const { container } = render(<HomePage />);
    expect(await findViolations(container)).toEqual([]);
  });
});
