import { expect, test } from '@fixtures/extended-fixtures';

test.describe('the Internet Checkboxes Page', () => {
  test('should display two checkboxes', async ({ checkboxesPage }) => {
    await test.step('Navigate to Checkboxes page', async () => {
      await checkboxesPage.navigation.goToCheckboxesPage();
    });

    await test.step('Verify there are two checkboxes', async () => {
      expect(await checkboxesPage.actions.count()).toBe(2);
    });
  });

  test('should allow checking and unchecking checkboxes', async ({ checkboxesPage }) => {
    await test.step('Navigate to Checkboxes page', async () => {
      await checkboxesPage.navigation.goToCheckboxesPage();
    });

    await test.step('Check first checkbox', async () => {
      await checkboxesPage.actions.check(0);
      expect(checkboxesPage.actions.isChecked(0)).resolves.toBeTruthy();
    });

    await test.step('Uncheck second checkbox', async () => {
      await checkboxesPage.actions.uncheck(1);
      await expect(checkboxesPage.actions.isChecked(1)).resolves.toBeFalsy();
    });
  });
});

test.describe('the Internet Challenging DOM Page', () => {
  test('should display the table and buttons', async ({ htmlElementsPage }) => {
    await test.step('Navigate to Challenging DOM page', async () => {
      await htmlElementsPage.navigation.goToChallengingDomPage();
    });

    await test.step('Verify table has 10 rows', async () => {
      expect(await htmlElementsPage.actions.getTableRowCount()).toBe(10);
    });

    await test.step('Verify table has 7 columns', async () => {
      expect(await htmlElementsPage.actions.getTableHeaderCount()).toBe(7);
    });

    await test.step('Verify canvas is visible', async () => {
      expect(await htmlElementsPage.actions.isCanvasVisible()).toBeTruthy();
    });
  });

  test('should allow clicking all buttons', async ({ htmlElementsPage }) => {
    await test.step('Navigate to Challenging DOM page', async () => {
      await htmlElementsPage.navigation.goToChallengingDomPage();
    });

    await test.step('Click blue button', async () => {
      await htmlElementsPage.actions.clickBlueButton();
    });

    await test.step('Click red button', async () => {
      await htmlElementsPage.actions.clickRedButton();
    });

    await test.step('Click green button', async () => {
      await htmlElementsPage.actions.clickGreenButton();
    });
  });
});
