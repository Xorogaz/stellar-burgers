import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:4000';
const SERVER_START_TIMEOUT = 180 * 1000;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.pl.tsx',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npm run start:test',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: SERVER_START_TIMEOUT
  }
});
