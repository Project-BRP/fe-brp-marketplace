module.exports = {
  // Type check TypeScript files
  "**/*.(ts|tsx)": () => "pnpm typecheck",

  // Lint, prettify, and fix TS and JS files
  "**/*.(ts|tsx|js)": ["pnpm check:write"],

  // Prettify only Markdown and JSON files
  "**/*.(md|json)": () => `pnpm format:write`,
};
