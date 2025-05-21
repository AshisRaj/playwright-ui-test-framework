import { expect, test } from '@fixtures/extended-fixtures';

test.describe('playwright Dev site Tests', () => {
  test.beforeEach(async ({ homePage, testData }) => {
    await test.step('Navigate to URL', async () => {
      await homePage.navigateTo(testData.BASE_URL);
    });
  });

  test('has title', async ({ page }) => {
    await test.step('Check title', async () => {
      await expect(page).toHaveTitle(/Playwright/);
    });
  });

  test('get started link', async ({ page, homePage }) => {
    await test.step('Click "Get started" link', async () => {
      await homePage.actions.clickGetStarted();
    });

    await test.step('Check for "Installation" heading', async () => {
      await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    });
  });
});

test.describe('playwright Dev site Tests with Routes', () => {
  test.beforeEach(async ({ homePage, testData }) => {
    await test.step('Navigate to URL', async () => {
      await homePage.navigateTo(testData.BASE_URL);
    });
  });

  test('should mock Get Started API', async ({ page, homePage }) => {
    await test.step('Click "Get started" link', async () => {
      await homePage.actions.clickGetStarted();
    });

    await test.step('Verify mocked response', async () => {
      const response = await page.evaluate(() => fetch('/get-started').then((res) => res.json()));
      expect(response.message).toBe('Mocked Get Started Response');
    });
  });

  test('should mock Installation page', async ({ homePage }) => {
    await test.step('Navigate to Installation page', async () => {
      await homePage.navigateTo('/installation');
    });

    await test.step('Verify mocked Installation page', async () => {
      await expect(homePage.getByRole('heading', { name: 'Mocked Installation Page' })).toBeVisible();
    });
  });
});
