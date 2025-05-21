import { BasePage } from '@pages';
import { Page } from '@playwright/test';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Define page elements
  elements = {
    actionElements: {
      openMenuButton: () => this.getByRole('button', { name: 'Open Menu' }),
      logoutLink: () => this.getByRole('link', { name: 'Logout' }),
      addToCartButton: (itemId: string) => this.locator(`[data-test="add-to-cart-${itemId}"]`),
      removeFromCartButton: (itemId: string) => this.locator(`[data-test="remove-${itemId}"]`),
      shoppingCartLink: () => this.locator('[data-test="shopping-cart-link"]'),
    },

    inputElements: {},

    visualElements: {
      cartBadge: () => this.locator('.shopping_cart_badge'),
    },
  };

  // Define page actions
  actions = {
    clickOpenMenuButton: async () => {
      const button = this.elements.actionElements.openMenuButton();
      await this.click(button);
    },

    clickLogoutLink: async () => {
      const link = this.elements.actionElements.logoutLink();
      await this.click(link);
    },

    clickAddToCartButton: async (itemId: string) => {
      const button = this.elements.actionElements.addToCartButton(itemId);
      await this.click(button);
    },

    clickRemoveFromCartButton: async (itemId: string) => {
      const button = this.elements.actionElements.removeFromCartButton(itemId);
      await this.click(button);
    },

    clickShoppingCartLink: async () => {
      const link = this.elements.actionElements.shoppingCartLink();
      await this.click(link);
    },
  };

  // Define page navigation
  navigation = {
    goToInventoryPage: async () => {
      await this.navigateTo('https://www.saucedemo.com/inventory.html');
    },
  };

  async dispose(): Promise<void> {
    // Add any cleanup logic here, e.g., closing popups, clearing storage, etc.
    // If nothing is needed, you can leave this empty or log for debugging.
  }
}
