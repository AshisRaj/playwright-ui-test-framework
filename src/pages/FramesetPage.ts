import { BasePage } from '@pages';
import { Page } from '@playwright/test';

export class FramesetPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Elements: frame getters
  elements = {
    iframe: async () => this.getFrameByName('mce_0_ifr'),
    textArea: async () => {
      const frame = await this.elements.iframe();
      if (!frame) throw new Error('Iframe not found');
      return frame.locator('#tinymce');
    },
    topFrame: async () => this.getFrameByName('frame-top'),
    leftFrame: async () => {
      const top = await this.elements.topFrame();
      const left = top.childFrames().find((f) => f.name() === 'frame-left');
      if (!left) throw new Error('Left frame not found');
      return left;
    },
    middleFrame: async () => {
      const top = await this.elements.topFrame();
      const middle = top.childFrames().find((f) => f.name() === 'frame-middle');
      if (!middle) throw new Error('Middle frame not found');
      return middle;
    },
    rightFrame: async () => {
      const top = await this.elements.topFrame();
      const right = top.childFrames().find((f) => f.name() === 'frame-right');
      if (!right) throw new Error('Right frame not found');
      return right;
    },
    bottomFrame: async () => this.getFrameByName('frame-bottom'),
  };

  // Actions: get text from frames
  actions = {
    enterText: async (text: string) => {
      const textArea = await this.elements.textArea();
      await textArea.fill(''); // Clear existing text
      await textArea.fill(text);
    },
    getText: async () => {
      const textArea = await this.elements.textArea();
      return textArea.innerText();
    },
    getLeftText: async () => {
      const left = await this.elements.leftFrame();
      return left.locator('body').innerText();
    },
    getMiddleText: async () => {
      const middle = await this.elements.middleFrame();
      return middle.locator('body').innerText();
    },
    getRightText: async () => {
      const right = await this.elements.rightFrame();
      return right.locator('body').innerText();
    },
    getBottomText: async () => {
      const bottom = await this.elements.bottomFrame();
      return bottom.locator('body').innerText();
    },
  };

  // Navigation
  navigation = {
    goToIframePage: async () => {
      await this.navigateTo('https://the-internet.herokuapp.com/iframe');
    },
    goToFramesetPage: async () => {
      await this.navigateTo('https://the-internet.herokuapp.com/nested_frames');
    },
  };

  async dispose(): Promise<void> {
    // Add any cleanup logic here if needed
  }
}
