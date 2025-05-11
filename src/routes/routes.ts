import { Page, Route } from '@playwright/test';

export class Routes {
  static async mockGetStarted(route: Route) {
    // Mock the response for the "Get Started" API
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Mocked Get Started Response' }),
    });
  }

  static async mockInstallationPage(route: Route) {
    // Mock the response for the "Installation" page
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<html><body><h1>Mocked Installation Page</h1></body></html>',
    });
  }

  static async blockAnalytics(route: Route) {
    // Block analytics requests
    await route.abort();
  }

  static async setupRoutes(page: Page) {
    // Define all routes and their handlers here
    await page.route('**/get-started', Routes.mockGetStarted);
    await page.route('**/installation', Routes.mockInstallationPage);
    await page.route('**/analytics/**', Routes.blockAnalytics);
  }
}
