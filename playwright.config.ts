import { defineConfig, devices } from '@playwright/test';
import logger from '@utils/logger';
import os from 'os';
import path from 'path';
import { envConfig } from './src/configs/test-config';

// Do not remove this line, it is used to load environment variables
logger.info('Environment Data:', envConfig); // Log all environment variables
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Global Setup to run before all tests
  globalSetup: `./src/utils/global-setup`,

  // Global Teardown to run after all tests
  globalTeardown: `./src/utils/global-teardown`,

  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    // ['list'], // Use the list reporter for console output
    // ['html'], // Keep the default HTML reporter
    [
      'allure-playwright',
      {
        detail: true,
        resultsDir: path.join(__dirname, 'artifacts', 'reports', 'allure-results'),
        suiteTitle: true,
        open: 'never',
        environmentInfo: {
          hostname: os.hostname(), // Add hostname
          user_id: os.userInfo().username, // Add user ID
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ], // Add Allure reporter
    ['./src/configs/custom-reporter-config.ts'], // Add custom reporter
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'https://example.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'off', // Disable trace files
    video: 'off', // Disable video recording
    screenshot: 'only-on-failure', // Disable screenshots
  },
  // Set the output directory for test results
  outputDir: path.join(__dirname, 'artifacts', 'reports'), // Custom path for test-results, // Disable the default test-results folder

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
