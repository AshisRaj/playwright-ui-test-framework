import { expect, test } from '@fixtures/extended-fixtures';

test.describe('the Internet Frameset Page', () => {
  test('should access and validate content in all frames', async ({ framesetPage }) => {
    await test.step('Navigate to frameset page', async () => {
      await framesetPage.navigation.goToFramesetPage();
    });
    await test.step('Get text from left frame', async () => {
      const leftText = await framesetPage.actions.getLeftText();
      expect(leftText).toContain('LEFT');
    });
    await test.step('Get text from middle frame', async () => {
      const middleText = await framesetPage.actions.getMiddleText();
      expect(middleText).toContain('MIDDLE');
    });
    await test.step('Get text from right frame', async () => {
      const rightText = await framesetPage.actions.getRightText();
      expect(rightText).toContain('RIGHT');
    });
    await test.step('Get text from bottom frame', async () => {
      const bottomText = await framesetPage.actions.getBottomText();
      expect(bottomText).toContain('BOTTOM');
    });
  });
});

test.describe('the Internet Iframe Page', () => {
  test('should find the text area and add some inputs', async ({ framesetPage }) => {
    await test.step('Navigate to iframe page', async () => {
      await framesetPage.navigation.goToIframePage();
    });

    await test.step('Enter text in the iframe text area', async () => {
      await framesetPage.actions.enterText('Hello from Playwright!');
      const value = await framesetPage.actions.getText();
      expect(value).toContain('Hello from Playwright!');
    });
  });
});
