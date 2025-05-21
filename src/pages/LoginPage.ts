import { BasePage } from '@pages';
import { Page } from '@playwright/test';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Define page elements
  elements = {
    actionElements: {
      submitButton: () => this.getByRole('button', { name: 'Login' }),
    },

    inputElements: {
      userName: () => this.getByRole('textbox', { name: 'Username' }),
      password: () => this.getByRole('textbox', { name: 'Password' }),
    },

    visualElements: {
      pageTitle: () => this.getByText('Swag Labs'),
    },
  };

  // Define page actions
  actions = {
    clickSubmitButton: async () => {
      const button = this.elements.actionElements.submitButton();
      await this.click(button);
    },

    fillUserName: async (username: string) => {
      const usernameField = this.elements.inputElements.userName();
      await this.fill(usernameField, username);
    },

    fillPassword: async (password: string) => {
      const passwordField = this.elements.inputElements.password();
      await this.fill(passwordField, password);
    },
  };

  // Define page navigation
  navigation = {
    goToLoginPage: async () => {
      await this.navigateTo('https://www.saucedemo.com/');
    },

    goToInventoryPage: async () => {
      await this.navigateTo('https://www.saucedemo.com/inventory.html');
    },
  };

  async dispose(): Promise<void> {
    // Add any cleanup logic here, e.g., closing popups, clearing storage, etc.
    // If nothing is needed, you can leave this empty or log for debugging.
  }
}
