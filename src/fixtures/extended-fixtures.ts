import { CartPage } from '@pages/CartPage';
import { HomePage } from '@pages/HomePage';
import { InventoryPage } from '@pages/InventoryPage';
import { LoginPage } from '@pages/LoginPage';

import { test as baseTest } from '@playwright/test';

// Import environment-specific data
import { envConfig } from '@configs/test-config';
import { Routes } from '@routes/routes';
import logger from '@utils/logger';

type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  // Add any other page classes you want to use in your tests
  testData: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Allow dynamic keys from environment-specific data
    updateTestData: (data: object, updates: Partial<unknown>) => object;
    removeTestDataFields: (data: object, fields: string[]) => object;
  };
};

export const test = baseTest.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    // Set up routes before using the page
    logger.info('Setting up routes');
    await Routes.setupRoutes(page);
    logger.info('Setting up HomePage fixture');
    const homePage = new HomePage(page);
    await use(homePage);
    logger.info('Tearing down HomePage fixture');
  },
  loginPage: async ({ page }, use) => {
    logger.info('Setting up LoginPage fixture');
    const loginPage = new LoginPage(page);
    await use(loginPage);
    logger.info('Tearing down LoginPage fixture');
  },
  inventoryPage: async ({ page }, use) => {
    logger.info('Setting up InventoryPage fixture');
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
    logger.info('Tearing down InventoryPage fixture');
  },
  cartPage: async ({ page }, use) => {
    logger.info('Setting up CartPage fixture');
    const cartPage = new CartPage(page);
    await use(cartPage);
    logger.info('Tearing down CartPage fixture');
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
