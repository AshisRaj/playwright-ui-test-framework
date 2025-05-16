import { Page } from '@playwright/test';
import { BasePage } from 'src/pages/BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  elements = {
    // Define page elements
    actionElements: {
      checkOutButton: () => this.getByRole('button', { name: 'Checkout' }),
    },

    inputElements: {},

    visualElements: {
      cartTitle: () => this.locator('[data-test="title"]', { hasText: 'Your Cart' }),
    },
  };

  actions = {
    // Define actions
    clickCheckOutButton: async () => {
      const button = this.elements.actionElements.checkOutButton();
      await this.click(button);
    },
  };

  navigation = {
    goToCartPage: async () => {
      await this.navigateTo('https://www.saucedemo.com/cart.html');
    },
  };
}
