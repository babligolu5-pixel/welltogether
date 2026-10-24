import { test, expect } from '@playwright/test';

// Setup verification tests. Inhe apne asli tests se replace kar dein.
test.describe('Playwright setup verification', () => {
  test('browser page render karta hai', async ({ page }) => {
    await page.setContent('<h1>Playwright is working</h1>');
    await expect(page.locator('h1')).toHaveText('Playwright is working');
    await expect(page).toHaveTitle('');
  });

  test('page context mein JavaScript chalta hai', async ({ page }) => {
    await page.setContent('<div id="app">ready</div>');

    const result = await page.evaluate(() => 6 * 7);
    expect(result).toBe(42);

    await expect(page.locator('#app')).toBeVisible();
  });
});
