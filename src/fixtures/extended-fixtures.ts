import {
  BasicAuthPage,
  CartPage,
  CheckboxesPage,
  FramesetPage,
  HomePage,
  HTMLElementsPage,
  InventoryPage,
  LoginPage,
} from '@pages';

import { test as baseTest } from '@playwright/test';

// Import environment-specific data
import { envConfig } from '@configs/test-config';
import { Routes } from '@routes';
import logger from '@utils/logger';

type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  framesetPage: FramesetPage;
  basicAuthPage: BasicAuthPage;
  checkboxesPage: CheckboxesPage;
  htmlElementsPage: HTMLElementsPage;
  // Add any other page classes you want to use in your tests
  testData: {
    [key: string]: any; // Allow dynamic keys from environment-specific data
    updateTestData: (data: object, updates: Partial<unknown>) => object;
    removeTestDataFields: (data: object, fields: string[]) => object;
  };
};

export const test = baseTest.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    logger.info('Setting up HomePage fixture');
    const homePage = new HomePage(page);
    await use(homePage);
    logger.info('Tearing down HomePage fixture');
    await homePage.dispose();
  },
  loginPage: async ({ page }, use) => {
    logger.info('Setting up LoginPage fixture');
    const loginPage = new LoginPage(page);
    await use(loginPage);
    logger.info('Tearing down LoginPage fixture');
    await loginPage.dispose();
  },
  inventoryPage: async ({ page }, use) => {
    logger.info('Setting up InventoryPage fixture');
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
    logger.info('Tearing down InventoryPage fixture');
    await inventoryPage.dispose();
  },
  cartPage: async ({ page }, use) => {
    logger.info('Setting up CartPage fixture');
    const cartPage = new CartPage(page);
    await use(cartPage);
    logger.info('Tearing down CartPage fixture');
    await cartPage.dispose();
  },
  framesetPage: async ({ page }, use) => {
    logger.info('Setting up FramesetPage fixture');
    const framesetPage = new FramesetPage(page);
    await use(framesetPage);
    logger.info('Tearing down FramesetPage fixture');
    await framesetPage.dispose();
  },
  basicAuthPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'admin',
      },
    });
    const page = await context.newPage();
    logger.info('Setting up BasicAuthPage fixture');
    const basicAuthPage = new BasicAuthPage(page);
    await use(basicAuthPage);
    logger.info('Tearing down BasicAuthPage fixture');
    await basicAuthPage.dispose();
    await context.close();
  },
  // Set up HTMLElementsPage fixture
  htmlElementsPage: async ({ page }, use) => {
    logger.info('Setting up HTMLElementsPage fixture');
    const htmlElementsPage = new HTMLElementsPage(page);
    await use(htmlElementsPage);
    logger.info('Tearing down HTMLElementsPage fixture');
    await htmlElementsPage.dispose();
  },
  // Set up CheckboxesPage fixture
  checkboxesPage: async ({ page }, use) => {
    logger.info('Setting up CheckboxesPage fixture');
    const checkboxesPage = new CheckboxesPage(page);
    await use(checkboxesPage);
    logger.info('Tearing down CheckboxesPage fixture');
    await checkboxesPage.dispose();
  },
  // Set up routes
  page: async ({ page }, use) => {
    logger.info('Setting up routes');
    await Routes.setupRoutes(page);
    await use(page);
    logger.info('Tearing down routes');
    await Routes.teardownRoutes(page);
  },
  // Add any other page classes you want to use in your tests

  testData: async ({}, use) => {
    logger.info('Loading test data');
    const testData = {
      ...envConfig, // Include all environment variables loaded by dotenv and environment-specific test data

      // Utility to update specific fields in test data
      updateTestData: (data: object, updates: Partial<unknown>) => {
        return { ...data, ...updates };
      },
      // Utility to remove specific fields from test data
      removeTestDataFields: (data: Record<string, unknown>, fields: string[]) => {
        const updatedData: Record<string, unknown> = { ...data };
        fields.forEach((field) => delete updatedData[field]);
        return updatedData;
      },
    };

    // Provide the test data to the test
    await use(testData);
    logger.info('Test data loaded successfully');
  },
});

export const expect = test.expect;
