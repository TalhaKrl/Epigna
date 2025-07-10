const { test, expect } = require('@playwright/test');

test('homepage has title', async ({ page }) => {
  await page.goto('http://preprod.epigna.com');
  await page.locator('img[alt="Logo"]').isVisible();
});
