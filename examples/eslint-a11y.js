// Accessibility rules for lint, using eslint-plugin-jsx-a11y.
//
// Lint catches accessibility problems while the code is being written:
// images without alt text, buttons with no name, form fields with no label.
// The axe tests catch what lint can't see, in the rendered page.
//
// Setup:
//   npm install --save-dev eslint-plugin-jsx-a11y
//
// Lovable projects already have an eslint.config.js. Don't replace it.
// Add the import at the top, and add the block below as one more entry
// in the list it exports, after the existing entries.

import jsxA11y from "eslint-plugin-jsx-a11y";

export const accessibilityRules = {
  // Point this at your own components and pages.
  // Generated UI components (like src/components/ui) can stay out
  // until a real problem shows up in them.
  files: ["src/components/**/*.{ts,tsx}", "src/pages/**/*.{ts,tsx}", "src/routes/**/*.{ts,tsx}"],
  ignores: ["src/components/ui/**"],
  plugins: { "jsx-a11y": jsxA11y },
  rules: {
    ...jsxA11y.flatConfigs.recommended.rules,
    // Turn off a rule only when you've checked it and have a reason.
    // Write the reason down, like this:
    // "jsx-a11y/img-redundant-alt": "off", // our required alt text includes the word "photo"
  },
};

// In your eslint.config.js, it ends up looking something like:
//
//   import jsxA11y from "eslint-plugin-jsx-a11y";
//
//   export default tseslint.config(
//     { ignores: ["dist", "coverage"] },
//     { ...your existing rules... },
//     {
//       files: ["src/components/**/*.{ts,tsx}", "src/pages/**/*.{ts,tsx}"],
//       ignores: ["src/components/ui/**"],
//       plugins: { "jsx-a11y": jsxA11y },
//       rules: { ...jsxA11y.flatConfigs.recommended.rules },
//     },
//   );
