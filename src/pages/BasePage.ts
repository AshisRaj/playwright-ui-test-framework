import { Locator, Page, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  // Generic element getters
  getByRole(role: string, options?: Record<string, any>): Locator {
    return this.page.getByRole(role as any, options);
  }

  getByText(text: string, options?: Record<string, any>): Locator {
    return this.page.getByText(text, options);
  }

  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  locator(
    selector: string,
    filter?: { has?: Locator; hasNot?: Locator; hasNotText?: string | RegExp; hasText?: string | RegExp } | undefined,
  ): Locator {
    return this.page.locator(selector, filter);
  }

  // Common actions
  async click(target: string | Locator): Promise<void> {
    const locator = typeof target === 'string' ? this.page.locator(target) : target;
    await locator.waitFor({ state: 'visible' });
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  async fill(target: string | Locator, value: string): Promise<void> {
    const locator = typeof target === 'string' ? this.page.locator(target) : target;
    await locator.waitFor({ state: 'visible' });
    await locator.scrollIntoViewIfNeeded();
    await locator.fill(value);
  }

  async isVisible(target: string | Locator): Promise<boolean> {
    const locator = typeof target === 'string' ? this.page.locator(target) : target;
    return await locator.isVisible();
  }

  async waitForVisible(target: string | Locator, timeout = 5000): Promise<void> {
    const locator = typeof target === 'string' ? this.page.locator(target) : target;
    await expect(locator).toBeVisible({ timeout });
  }

  async waitForUrl(urlPart: string, timeout = 5000): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(urlPart), { timeout });
  }

  // Utility: can be extended by child classes
  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load', timeout = 10000): Promise<void> {
    await this.page.waitForLoadState(state, { timeout });
  }
}
