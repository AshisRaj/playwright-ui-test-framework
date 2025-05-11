import { expect, test } from '@fixtures/extended-fixtures';
import * as path from 'path';

const storageStatePath = path.resolve(__dirname, '../../artifacts/cookies/standard_user_cookies.json');

test.describe('sauceDemo Cart Tests', () => {
  test.use({ storageState: storageStatePath }); // Automatically load storage state if it exists

  test('navigate to cart', { tag: ['@smoke', '@regression'] }, async ({ page, inventoryPage, cartPage }) => {
    await test.step('Navigate to dashboard', async () => {
      await inventoryPage.navigation.goToInventoryPage();
      await expect(page.getByText('Products')).toBeVisible();
    });

    await test.step('Add an item to cart', async () => {
      await inventoryPage.actions.clickAddToCartButton('sauce-labs-backpack'); // Use specific item ID
    });

    await test.step('Click on cart icon', async () => {
      await inventoryPage.actions.clickShoppingCartLink();
    });

    await test.step('Verify cart page is displayed', async () => {
      await expect(cartPage.elements.visualElements.cartTitle()).toBeVisible();
      await expect(cartPage.elements.visualElements.cartTitle()).toHaveText('Your Cart');
    });
  });
});
