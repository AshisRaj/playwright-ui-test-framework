import { Page } from '@playwright/test';
import { BasePage } from 'src/pages/BasePage';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  elements = {
    actionElements: {
      openMenuButton: () => this.page.getByRole('button', { name: 'Open Menu' }),
      logoutLink: () => this.page.getByRole('link', { name: 'Logout' }),
      addToCartButton: (itemId: string) => this.page.locator(`[data-test="add-to-cart-${itemId}"]`),
      removeFromCartButton: (itemId: string) => this.page.locator(`[data-test="remove-${itemId}"]`),
      shoppingCartLink: () => this.page.locator('[data-test="shopping-cart-link"]'),
    },

    inputElements: {},

    visualElements: {
      cartBadge: () => this.page.locator('.shopping_cart_badge'),
    },
  };

  actions = {
    // Define actions
    clickOpenMenuButton: async () => {
      const button = this.elements.actionElements.openMenuButton();
      await button.waitFor({ state: 'visible' });
      await button.click();
    },

    clickLogoutLink: async () => {
      const link = this.elements.actionElements.logoutLink();
      await link.waitFor({ state: 'visible' });
      await link.click();
    },

    clickAddToCartButton: async (itemId: string) => {
      const button = this.elements.actionElements.addToCartButton(itemId);
      await button.waitFor({ state: 'visible' });
      await button.click();
    },

    clickRemoveFromCartButton: async (itemId: string) => {
      const button = this.elements.actionElements.removeFromCartButton(itemId);
      await button.waitFor({ state: 'visible' });
      await button.click();
    },

    clickShoppingCartLink: async () => {
      const link = this.elements.actionElements.shoppingCartLink();
      await link.waitFor({ state: 'visible' });
      await link.click();
    },
  };

  navigation = {
    goToInventoryPage: async () => {
      await this.navigateTo('https://www.saucedemo.com/inventory.html');
    },
  };
}
