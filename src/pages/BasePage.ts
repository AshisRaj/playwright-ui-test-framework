import { expect, Frame, FrameLocator, Locator, Page } from '@playwright/test';

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

  locator(selector: string, filter?: { hasText: string }): Locator {
    return this.page.locator(selector, filter);
  }

  // Frame helpers
  async getFrameByName(name: string): Promise<Frame> {
    const frame = this.page.frame({ name: name });
    if (!frame) throw new Error(`Frame with name "${name}" not found`);
    return frame;
  }

  async getFrameByUrlPart(urlPart: string): Promise<Frame> {
    const frame = this.page.frames().find((f) => f.url().includes(urlPart));
    if (!frame) throw new Error(`Frame with url containing "${urlPart}" not found`);
    return frame;
  }

  async frameLocatorByName(name: string): Promise<FrameLocator> {
    return this.page.frameLocator(`iframe[name="${name}"]`);
  }

  async getNestedFrame(parentName: string, childName: string): Promise<Frame> {
    const parent = await this.getFrameByName(parentName);
    const child = parent.childFrames().find((f) => f.name() === childName);
    if (!child) throw new Error(`Child frame "${childName}" not found in parent "${parentName}"`);
    return child;
  }

  // Get text from a frame
  async getTextFromFrame(frameName: string): Promise<string> {
    const frame = await this.getFrameByName(frameName);
    // For demo, get the body text
    return frame.locator('body').innerText();
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

  async dispose(): Promise<void> {
    // Dispose of any resources or perform cleanup if necessary
  }
}
