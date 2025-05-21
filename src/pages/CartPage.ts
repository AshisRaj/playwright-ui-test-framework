import { BasePage } from '@pages';
import { Page } from '@playwright/test';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Define page elements
  elements = {
    actionElements: {
      checkOutButton: () => this.getByRole('button', { name: 'Checkout' }),
    },

    inputElements: {},

    visualElements: {
      cartTitle: () => this.locator('[data-test="title"]', { hasText: 'Your Cart' }),
    },
  };

  // Define page actions
  actions = {
    clickCheckOutButton: async () => {
      const button = this.elements.actionElements.checkOutButton();
      await this.click(button);
    },
  };

  // Define page navigation
  navigation = {
    goToCartPage: async () => {
      await this.navigateTo('https://www.saucedemo.com/cart.html');
    },
  };

  async dispose(): Promise<void> {
    // Add any cleanup logic here, e.g., closing popups, clearing storage, etc.
    // If nothing is needed, you can leave this empty or log for debugging.
  }
}
