import { Page } from '@playwright/test';
import { BasePage } from 'src/pages/BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  elements = {
    // Define page elements
    actionElements: {
      getStartedButton: () => this.page.getByRole('link', { name: 'Get started' }),
    },

    inputElements: {},

    visualElements: {},
  };

  actions = {
    // Define actions
    clickGetStarted: async () => {
      const getStartedButton = this.elements.actionElements.getStartedButton();
      await getStartedButton.waitFor({ state: 'visible' });
      await getStartedButton.scrollIntoViewIfNeeded();
      await getStartedButton.click();
    },
  };

  navigation = {
    // Define navigation
    goToPWDevPage: async () => {
      await this.navigateTo('https://playwright.dev/');
    },
  };
}
