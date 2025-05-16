import { Page } from '@playwright/test';
import { BasePage } from 'src/pages/BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  elements = {
    // Define page elements
    actionElements: {
      getStartedButton: () => this.getByRole('link', { name: 'Get started' }),
    },

    inputElements: {},

    visualElements: {},
  };

  actions = {
    // Define actions
    clickGetStarted: async () => {
      const button = this.elements.actionElements.getStartedButton();
      await this.click(button);
    },
  };

  navigation = {
    // Define navigation
    goToPWDevPage: async () => {
      await this.navigateTo('https://playwright.dev/');
    },
  };
}
