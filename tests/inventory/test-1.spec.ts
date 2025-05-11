// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://www.saucedemo.com/');
//   await page.locator('[data-test="username"]').click();
//   await page.locator('[data-test="username"]').fill('standard_user');
//   await page.locator('[data-test="username"]').press('Tab');
//   await page.locator('[data-test="password"]').fill('secret_sauce');
//   await page.locator('[data-test="password"]').press('Tab');
//   await page.locator('[data-test="login-button"]').press('Tab');
//   await page.locator('[data-test="login-button"]').click();
//   await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
//   await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
//   await page.locator('[data-test="shopping-cart-link"]').click();
//   await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
//   await page.locator('[data-test="checkout"]').click();
//   await page.locator('[data-test="firstName"]').click();
//   await page.goto('https://www.saucedemo.com/checkout-complete.html');
//   await page.locator('[data-test="title"]').click({
//     button: 'right'
//   });
//   await expect(page.locator('[data-test="title"]')).toContainText('Checkout: Complete!');
//   await page.locator('[data-test="checkout-complete-container"]').click();
//   await page.locator('[data-test="complete-header"]').click({
//     button: 'right'
//   });
//   await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!');
//   await expect(page.locator('[data-test="pony-express"]')).toBeVisible();
//   await page.locator('[data-test="pony-express"]').click();
//   await expect(page.locator('[data-test="pony-express"]')).toBeVisible();
//   await expect(page.locator('[data-test="pony-express"]')).toBeVisible();
//   await page.locator('[data-test="firstName"]').fill('ashis');
//   await page.locator('[data-test="firstName"]').press('Tab');
//   await page.locator('[data-test="lastName"]').fill('raj');
//   await page.locator('[data-test="lastName"]').press('Tab');
//   await page.locator('[data-test="postalCode"]').fill('ashis.raj@gmail.com');
//   await page.locator('form').click();
//   await page.locator('[data-test="continue"]').click();
//   await page.locator('[data-test="finish"]').click();
//   await page.locator('[data-test="back-to-products"]').click();
// });
