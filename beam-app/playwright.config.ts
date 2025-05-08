import * as dotenv from 'dotenv';
import path from 'node:path';
import {
  defineConfig,
  devices,
  PlaywrightTestConfig,
  ReporterDescription,
} from '@playwright/test';

import { baseUrl, isLocalhost } from './e2e-tests/settings';

dotenv.config({ path: '.env.e2e' });

export const STORAGE_STATE_JSON = path.join(
  __dirname,
  'playwright/.auth/user.json',
);

const reporters: ReporterDescription[] = [
  ['list'],
  ['html', { outputFolder: `${__dirname}/e2e-tests/playwright-html-report` }],
];
if (process.env.CI) {
  reporters.push(['github']);
}

export const DEFAULT_TEST_TIMEOUT = 90_000;
export const DEFAULT_EXPECT_TIMEOUT = 15_000;

const cfg: PlaywrightTestConfig = {
  timeout: DEFAULT_TEST_TIMEOUT,
  expect: {
    timeout: DEFAULT_EXPECT_TIMEOUT,
  },
  testDir: './e2e-tests/tests',
  // add a retry of 1 in CI to avoid potential cloud-related infra/network/runner intermittent issues
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: reporters,

  use: {
    baseURL: baseUrl,
    trace: 'on',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Chrome',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE_JSON },
    },
  ],
};

if (isLocalhost) {
  cfg.webServer = {
    command: 'pnpm start',
    url: baseUrl,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  };
}

// Reference: https://playwright.dev/docs/test-configuration
export default defineConfig(cfg);
