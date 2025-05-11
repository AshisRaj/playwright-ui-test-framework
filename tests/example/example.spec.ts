import { expect, test } from '@fixtures/extended-fixtures';
import logger from '@utils/logger';

test.describe('playwright Dev site Tests', () => {
  test.beforeEach(async ({ homePage, testData }) => {
    await test.step('Navigate to URL', async () => {
      await homePage.navigateTo(testData.BASE_URL);
    });
    logger.info('Completed beforeEach hook');
  });

  test('has title', async ({ page }) => {
    logger.info('Starting test: has title');
    await test.step('Check title', async () => {
      await expect(page).toHaveTitle(/Playwright/);
      logger.info('Title verified successfully');
    });
  });

  test('get started link', async ({ homePage, page }) => {
    logger.info('Starting test: get started link');
    await test.step('Click "Get started" link', async () => {
      await homePage.clickGetStarted();
      logger.info('Clicked "Get started" link');
    });
    await test.step('Check for "Installation" heading', async () => {
      await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
      logger.info('"Installation" heading is visible');
    });
  });
});

test.describe('playwright Dev site Tests with Routes', () => {
  test.beforeEach(async ({ homePage }) => {
    await test.step('Navigate to URL', async () => {
      await homePage.navigateTo(process.env.BASE_URL || 'https://default.url/');
    });
  });

  test('should mock Get Started API', async ({ homePage, page }) => {
    await test.step('Click "Get started" link', async () => {
      await homePage.clickGetStarted();
    });

    await test.step('Verify mocked response', async () => {
      const response = await page.evaluate(() => fetch('/get-started').then((res) => res.json()));
      expect(response.message).toBe('Mocked Get Started Response');
    });
  });

  test('should mock Installation page', async ({ page }) => {
    await test.step('Navigate to Installation page', async () => {
      await page.goto('/installation');
    });

    await test.step('Verify mocked Installation page', async () => {
      await expect(page.getByRole('heading', { name: 'Mocked Installation Page' })).toBeVisible();
    });
  });
});
