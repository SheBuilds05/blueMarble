import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'], 
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    video: 'on', 
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* --- THIS IS THE PART YOU NEED TO ADD --- */
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',        // This starts your blueMarble frontend
    url: 'http://localhost:5173',  // It waits for this URL to be active
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',              // Keeps your terminal clean
    stderr: 'pipe',
  },
});