import { BasePage } from '@pages';
import { Page } from '@playwright/test';

export class CheckboxesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Define page elements
  elements = {
    checkboxes: () => this.page.locator('form#checkboxes input[type="checkbox"]'),
  };

  // Define page actions
  actions = {
    isChecked: async (index: number) => {
      return this.elements.checkboxes().nth(index).isChecked();
    },
    check: async (index: number) => {
      const checkbox = this.elements.checkboxes().nth(index);
      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
    },
    uncheck: async (index: number) => {
      const checkbox = this.elements.checkboxes().nth(index);
      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
      }
    },
    count: async () => {
      return this.elements.checkboxes().count();
    },
  };

  // Define page navigation
  navigation = {
    goToCheckboxesPage: async () => {
      await this.navigateTo('https://the-internet.herokuapp.com/checkboxes');
    },
  };

  async dispose(): Promise<void> {
    // Add any cleanup logic here if needed
  }
}
