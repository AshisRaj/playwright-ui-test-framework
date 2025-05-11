import { Page } from '@playwright/test';
import { BasePage } from 'src/pages/BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Click the "Get Started" link or button
  async clickGetStarted(): Promise<void> {
    const getStartedButton = this.page.getByRole('link', { name: 'Get started' });

    // Ensure the element is visible and enabled
    await getStartedButton.waitFor({ state: 'visible' });
    await getStartedButton.scrollIntoViewIfNeeded();

    // Perform the click
    await getStartedButton.click();
  }
}
