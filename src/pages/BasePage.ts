import { Locator, Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to a URL
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  // Click an element
  async click(selector: string | Locator): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.locator(selector).click();
    } else {
      await selector.click();
    }
  }

  // Check if an element is visible
  async isVisible(selector: string | Locator): Promise<boolean> {
    if (typeof selector === 'string') {
      return await this.page.locator(selector).isVisible();
    } else {
      return await selector.isVisible();
    }
  }

  // Check visibility of an element by role and name
  async isElementVisibleByRole(selector: string | Locator): Promise<boolean> {
    if (typeof selector === 'string') {
      return await this.page.locator(selector).isVisible();
    } else {
      return await selector.isVisible();
    }
  }
}
