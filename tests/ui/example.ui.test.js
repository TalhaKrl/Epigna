// This is a Playwright test file for UI testing of the Epigna website

const { test, expect } = require('@playwright/test');


const fs = require('fs');



// Use storage state for all tests in this file
test.use({ storageState: 'storageState.json' });


test('homepage has title', async ({ page }) => {
  await page.goto('http://preprod.epigna.com');
  await expect(page.locator('img[alt="Logo"]')).toBeVisible();
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

test('user can log in with valid credentials', async ({ page }) => {
  await page.goto('http://preprod.epigna.com');
  // Already signed in via storageState
  await expect(page.getByText('Wish List')).toBeVisible();
});

test('user can navigate and validate My Account options', async ({ page }) => {
  await page.goto('http://preprod.epigna.com');
  // Already signed in via storageState
  await expect(page.getByText('My Account')).toBeVisible();
  // Open My Account menu
  await page.getByText('My Account').click();

  // Define options and expected titles
  const options = [
    { label: 'Favorites', expectedTitle: 'My Favorites', multiH1: false, selector: 'h1' },
    { label: 'My Designs', expectedTitle: 'My Designs', multiH1: true, selector: 'h1' },
    { label: 'Order History', expectedTitle: 'My Orders', multiH1: true, selector: 'h2' },
    { label: 'Account Settings', expectedTitle: 'My Account', multiH1: false, selector: 'h1' },
  ];

  for (const option of options) {
    // Try hover, then click to open the dropdown
    await page.hover('text=My Account');
    await page.waitForTimeout(300);
    if (!(await page.getByText(option.label).isVisible())) {
      await page.getByText('My Account').click();
      await page.waitForTimeout(300);
    }
    await expect(page.getByText(option.label)).toBeVisible();
    await page.getByText(option.label).click();
    // Validate the page title
    if (option.multiH1) {
      await expect(page.locator(option.selector, { hasText: option.expectedTitle }).first()).toBeVisible({ timeout: 5000 });
    } else {
      await expect(page.locator(option.selector)).toHaveText(option.expectedTitle, { timeout: 5000 });
    }
    await page.waitForTimeout(500); // Wait for page transition
    // Go back to the previous page (My Account menu)
    await page.goBack();
    await page.waitForTimeout(500); // Wait for the page to settle
  }

  // Logout at the end
  await page.getByText('My Account').click();
  await page.getByText('Logout').click();
  await expect(page.getByText('Sign In')).toBeVisible();
});

test('user can view and validate fields under My Designs', async ({ page }) => {
  await page.goto('http://preprod.epigna.com');
  await expect(page.getByText('My Account')).toBeVisible();
  await page.getByText('My Account').click();
  await expect(page.getByText('My Designs')).toBeVisible();
  await page.getByText('My Designs').click();
  await expect(page.locator('h1', { hasText: 'My Designs' }).first()).toBeVisible();
  await expect(page.getByText(/design saved|designs saved/i)).toBeVisible();
  await expect(page.locator('input[placeholder="Search designs..."]')).toBeVisible();
  // Validate at least one design card is visible
  const designCard = page.locator('.bg-card.shadow-sm');
  await expect(designCard.first()).toBeVisible();
  await expect(designCard.getByText(/Design updated on/i)).toBeVisible();
  await expect(designCard.locator('img')).toBeVisible();
  await expect(designCard.getByRole('button', { name: /Edit Design/i })).toBeVisible();
  await expect(designCard.getByRole('button', { name: /Delete/i })).toBeVisible();
});

test('user can view and validate fields under Favorites', async ({ page }) => {
  await page.goto('http://preprod.epigna.com');
  await expect(page.getByText('My Account')).toBeVisible();
  await page.getByText('My Account').click();
  await expect(page.getByText('Favorites')).toBeVisible();
  await page.getByText('Favorites').click();
  await expect(page.locator('h1', { hasText: 'My Favorites' }).first()).toBeVisible();
  const favoriteCard = page.locator('.bg-card.shadow-sm, .MuiCard-root');
  if (await favoriteCard.count() > 0) {
    await expect(favoriteCard.first()).toBeVisible();
    await expect(favoriteCard.locator('img')).toBeVisible();
    await expect(favoriteCard.getByRole('button', { name: /Remove|Delete|Remove from wishlist/i })).toBeVisible();
    await expect(favoriteCard.locator('h6, h5, h4')).toBeVisible();
    await expect(favoriteCard.locator('p, .MuiTypography-body2')).toBeVisible();
  }
});