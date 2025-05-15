import { expect, test } from '@fixtures/extended-fixtures';
import * as path from 'path';

const storageStatePath = path.resolve(__dirname, '../../artifacts/cookies/standard_user_cookies.json');

test.describe('sauceDemo Login Tests', () => {
  test('successful login', { tag: ['@smoke', '@regression'] }, async ({ page, loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigation.goToLoginPage();
    });

    await test.step('Fill in login credentials', async () => {
      await loginPage.actions.fillUserName('standard_user');
      await loginPage.actions.fillPassword('secret_sauce');
    });

    await test.step('Submit login form', async () => {
      await loginPage.actions.clickSubmitButton();
    });

    await test.step('Verify successful login', async () => {
      await expect(page.getByText('Products')).toBeVisible();
    });
  });

  test.use({ storageState: storageStatePath }); // Automatically load storage state if it exists
  test('reuse session storage', { tag: ['@regression'] }, async ({ page, loginPage }) => {
    await test.step('Navigate to dashboard', async () => {
      await loginPage.navigation.goToInventoryPage();
      await expect(page.getByText('Products')).toBeVisible();
    });
  });

  test.use({ storageState: storageStatePath }); // Automatically load storage state if it exists
  test('logout and clear session storage', { tag: ['@sanity', '@regression'] }, async ({ page, loginPage, inventoryPage }) => {
    await test.step('Navigate to dashboard', async () => {
      await loginPage.navigation.goToInventoryPage();
      await expect(page.getByText('Products')).toBeVisible();
    });

    await test.step('Click on menu button', async () => {
      await inventoryPage.actions.clickOpenMenuButton();
    });

    await test.step('Click on logout link', async () => {
      await inventoryPage.actions.clickLogoutLink();
    });

    await test.step('Verify logout', async () => {
      await expect(loginPage.elements.inputElements.userName()).toBeVisible();
    });
  });
});
