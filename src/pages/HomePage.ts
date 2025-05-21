import { BasePage } from '@pages';
import { Page } from '@playwright/test';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Define page elements
  elements = {
    actionElements: {
      getStartedButton: () => this.getByRole('link', { name: 'Get started' }),
    },

    inputElements: {},

    visualElements: {},
  };

  // Define page actions
  actions = {
    clickGetStarted: async () => {
      const button = this.elements.actionElements.getStartedButton();
      await this.click(button);
    },
  };

  // Define page navigation
  navigation = {
    goToPWDevPage: async () => {
      await this.navigateTo('https://playwright.dev/');
    },
  };

  async dispose(): Promise<void> {
    // Add any cleanup logic here, e.g., closing popups, clearing storage, etc.
    // If nothing is needed, you can leave this empty or log for debugging.
  }
}
