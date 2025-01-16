import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "cypress/component/**/*.cy.{ts,tsx}",
  },

  e2e: {
    baseUrl: "http://localhost:3001",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});