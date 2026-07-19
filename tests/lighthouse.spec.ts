import lighthouse from 'lighthouse';
import { chromium, expect, test } from '@playwright/test';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

import { getFinalUrls } from './get-urls.js';

const urls = await getFinalUrls();

test.describe('Lighthouse audits', () => {
  for (const url of urls) {
    test(`for ${url}`, async ({ page }) => {
      const port = 9222;

      // 1. Launch a persistent context to expose the CDP port
      const userDataDir = join(tmpdir(), `pw-lh-${Date.now()}`);
      const context = await chromium.launchPersistentContext(userDataDir, {
        args: [`--remote-debugging-port=${port}`],
        headless: true,
      });

      await page.goto(url);

      const pageUrl = page.url();

      const runnerResult = await lighthouse(pageUrl, {
        port,
        output: 'html',
        logLevel: 'info',
      });

      expect(runnerResult).toBeDefined();

      const path = (url.slice(`http://localhost:3000/`.length) || 'index')
        .split('/')
        .join('-');

      await mkdir('lighthouse', { recursive: true });

      await writeFile(`lighthouse/${path}.html`, runnerResult!.report);

      const lhr = runnerResult!.lhr;

      expect(lhr.categories.performance.score).toBeTruthy();
      expect(lhr.categories.seo.score).toBeTruthy();

      const perfScore = lhr.categories.performance.score! * 100;
      const seoScore = lhr.categories.seo.score! * 100;
      const bestPracticesScore = lhr.categories['best-practices'].score! * 100;

      expect(perfScore).toBeGreaterThanOrEqual(80);
      expect(seoScore).toBeGreaterThanOrEqual(90);
      expect(bestPracticesScore).toBeGreaterThanOrEqual(100);

      await context.close();
    });
  }
});
