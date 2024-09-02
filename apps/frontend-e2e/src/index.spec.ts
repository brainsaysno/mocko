import { test, expect } from '@playwright/test';

test.describe('(/) Index', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Mocko');
  });

  test('should have link to repo', async ({ page }) => {
    await expect(page.locator('a[href="https://github.com/brainsaysno/mocko"]')).toBeVisible();
  });

  test('should have link to mockos list', async ({ page }) => {
    await expect(page.locator('a[href="/mockos"]')).toBeVisible();
  });

  test('should match snapshot', async ({ page }) => {
    await page.waitForSelector('h1')
    // Wait for animations to finish
    await page.waitForTimeout(1000)
    expect(await page.screenshot()).toMatchSnapshot('index.png');
  });
});
