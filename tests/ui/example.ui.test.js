const { test, expect } = require('@playwright/test');

test('homepage has title', async ({ page }) => {
  await page.goto('http://preprod.epigna.com');
  await page.locator('img[alt="Logo"]').isVisible();
});

test('can navigate to Apparel&Accessories and see Men category', async ({ page }) => {
  await page.goto('http://preprod.epigna.com');
  // Click the "Apparel&Accessories" tab
  await page.getByRole('link', { name: /Apparel&Accessories/i }).click();
  // Wait for 2 seconds so you can see the menu
  await page.waitForTimeout(2000);
  // Ensure the "Men" category link is visible under Clothing
  await expect(page.locator('a[href="/browse/apparel-accessories/clothing/men"]')).toBeVisible();
});
