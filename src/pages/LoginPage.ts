import { Page } from '@playwright/test';
import { BasePage } from 'src/pages/BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  elements = {
    // Define page elements
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

  actions = {
    // Define actions
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

  navigation = {
    // Define navigation
    goToLoginPage: async () => {
      await this.navigateTo('https://www.saucedemo.com/');
    },

    goToInventoryPage: async () => {
      await this.navigateTo('https://www.saucedemo.com/inventory.html');
    },
  };
}
