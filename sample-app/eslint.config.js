// Lint setup shaped like a Lovable project's: TypeScript rules for the app,
// plus the kit's accessibility rules added as one more entry, the way
// examples/eslint-a11y.js says to.

import tseslint from "typescript-eslint";
import { accessibilityRules } from "./eslint-a11y.js";

export default tseslint.config(
  { ignores: ["dist", "coverage", "node_modules"] },
  ...tseslint.configs.recommended,
  accessibilityRules,
);
