import { BasePage } from '@pages';
import { Page } from '@playwright/test';

export class BasicAuthPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Define page elements
  elements = {
    visualElements: {
      successMessage: () => this.getByText('Congratulations'),
    },
  };

  // Define page actions
  actions = {
    isAuthenticated: async (): Promise<boolean> => {
      const message = this.elements.visualElements.successMessage();
      return await message.isVisible();
    },
  };

  // Define page navigation
  navigation = {
    goToBasicAuthPage: async () => {
      await this.navigateTo('https://the-internet.herokuapp.com/basic_auth');
    },
  };

  async dispose(): Promise<void> {
    // Add any cleanup logic here if needed
  }
}
