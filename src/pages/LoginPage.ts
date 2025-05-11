import { Page } from '@playwright/test';
import { BasePage } from 'src/pages/BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  elements = {
    // Define page elements
    actionElements: {
      submitButton: () => this.page.getByRole('button', { name: 'Login' }),
    },

    inputElements: {
      userName: () => this.page.getByRole('textbox', { name: 'Username' }),
      password: () => this.page.getByRole('textbox', { name: 'Password' }),
    },

    visualElements: {
      pageTitle: () => this.page.getByText('Swag Labs').waitFor({ state: 'visible' }),
    },
  };

  actions = {
    // Define actions
    clickSubmitButton: async () => {
      const button = this.elements.actionElements.submitButton();
      await button.waitFor({ state: 'visible' });
      await button.click();
    },

    fillUserName: async (username: string) => {
      const userNameField = this.elements.inputElements.userName();
      await userNameField.fill(username);
    },

    fillPassword: async (password: string) => {
      const passwordField = this.elements.inputElements.password();
      await passwordField.fill(password);
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
