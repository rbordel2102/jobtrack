import { defineConfig, devices } from "@playwright/test";

import { getTestRuntimeEnvironment } from "./tests/support/test-env";

const testEnvironment = getTestRuntimeEnvironment();
const baseURL = testEnvironment.BETTER_AUTH_URL;

if (!baseURL) {
  throw new Error("TEST_BETTER_AUTH_URL es obligatorio para Playwright.");
}

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: false,
  reporter: process.env.CI ? "github" : "list",
  retries: process.env.CI ? 1 : 0,
  testDir: "./tests/e2e",
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --port 3100",
    env: testEnvironment,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: baseURL,
  },
  workers: 1,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
