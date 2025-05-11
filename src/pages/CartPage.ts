import { Page } from '@playwright/test';
import { BasePage } from 'src/pages/BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  elements = {
    // Define page elements
    actionElements: {
      checkOutButton: () => this.page.getByRole('button', { name: 'Checkout' }),
      // page.locator('[data-test="checkout"]')
    },

    inputElements: {},

    visualElements: {
      cartTitle: () => this.page.locator('[data-test="title"]', { hasText: 'Your Cart' }),
    },
  };

  actions = {
    // Define actions
    clickCheckOutButton: async () => {
      const button = this.elements.actionElements.checkOutButton();
      await button.waitFor({ state: 'visible' });
      await button.click();
    },
  };

  navigation = {
    goToCartPage: async () => {
      await this.navigateTo('https://www.saucedemo.com/cart.html');
    },
  };
}
