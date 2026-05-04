import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  reporter: [
    ['html'], 
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use: {
    baseURL: 'http://localhost:5173', // Your Vite dev server
    trace: 'on-first-retry',
    video: 'on', // Records the test so you can watch them "pass or fail"
  },
});