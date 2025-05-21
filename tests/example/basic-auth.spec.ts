import { expect, test } from '@fixtures/extended-fixtures';

test.describe('the Internet Basic Auth Page', () => {
  test('should authenticate using Basic Auth', async ({ basicAuthPage }) => {
    await test.step('Navigate to Basic Auth page', async () => {
      // The Basic Auth page requires authentication
      // The credentials are set in the fixture setup
      await basicAuthPage.navigation.goToBasicAuthPage();
    });
    await test.step('Check if authenticated', async () => {
      // Check if the authentication was successful
      expect(await basicAuthPage.actions.isAuthenticated()).toBeTruthy();
    });
  });
});
