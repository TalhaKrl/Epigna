const { chromium } = require('@playwright/test');

module.exports = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://preprod.epigna.com');
  try {
    await page.waitForSelector('text=Sign In', { timeout: 20000 });
    await page.getByText('Sign In').click();
  } catch (e) {
    const html = await page.content();
    require('fs').writeFileSync('login-debug.html', html);
    console.error('ERROR: "Sign In" not found or not clickable after 20s. URL:', page.url());
    await browser.close();
    throw e;
  }
  await page.fill('input[name="username"]', 'super.user@test.com');
  await page.fill('input[name="password"]', '12345678');
  await page.getByRole('button', { name: /sign in/i }).click();
  // Wait for login to complete and My Account to appear
  try {
    await page.waitForSelector('text=My Account', { timeout: 15000 });
  } catch (e) {
    const html = await page.content();
    require('fs').writeFileSync('login-debug.html', html);
    console.error('ERROR: Login failed, "My Account" not visible after sign in. URL:', page.url());
    await browser.close();
    throw e;
  }
  // Debug: print current URL and HTML after login
  console.log('Current URL after login:', page.url());
  const html = await page.content();
  require('fs').writeFileSync('login-debug.html', html);
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
};
