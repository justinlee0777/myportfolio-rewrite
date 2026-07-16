import { test, devices } from '@playwright/test';

import { getFinalUrls } from './get-urls.js';

const urls = await getFinalUrls();

const testedDevices = {
  'iPhone 11': devices['iPhone 11'],
  'iPad Pro 11': devices['iPad Pro 11'],
  'Desktop Chrome': devices['Desktop Chrome'],
};

test.describe('Responsive design tests', () => {
  for (const [deviceName, device] of Object.entries(testedDevices)) {
    for (const url of urls) {
      test(`for ${url} on ${deviceName}`, async ({ browser }) => {
        const context = await browser.newContext({ ...device });
        const page = await context.newPage();
        await page.goto(url);

        await page.waitForLoadState('networkidle');

        const path = `screenshots/${deviceName}-${url.split('/').join('-')}.png`;

        await page.screenshot({ path });
      });
    }
  }
});
