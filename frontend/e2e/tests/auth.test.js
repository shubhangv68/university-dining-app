const { test, expect } = require('@playwright/test');

test('Google Single Sign-On Authentication', async ({ page }) => {
  console.log("Testing Google Single Sign-On Authentication...");
  await page.goto('http://localhost:3000');
  await page.click('button.google-login-button');
  const buttonText = await page.textContent('button.google-login-button');
  expect(buttonText).toBe('LOGIN WITH YOUR UMASS ACCOUNT');
  console.log("Login button clicked successfully.");
});
