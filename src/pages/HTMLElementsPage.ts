import { BasePage } from '@pages';
import { Page } from '@playwright/test';

export class HTMLElementsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Define page elements
  elements = {
    // Define button elements
    actionElements: {
      blueButton: () => this.getByRole('link', { name: 'bar' }),
      redButton: () => this.getByRole('link', { name: 'baz' }),
      greenButton: () => this.getByRole('link', { name: 'foo' }),
      checkboxes: () => this.locator('form#checkboxes input[type="checkbox"]'),
    },

    // Define input elements
    inputElements: {},

    // Define table elements
    visualElements: {
      tableRows: () => this.page.locator('table tbody tr'),
      tableHeaders: () => this.page.locator('table thead th'),
      canvas: () => this.page.locator('canvas'),
    },
  };

  // Define page actions
  actions = {
    clickBlueButton: async () => {
      const button = this.elements.actionElements.blueButton();
      await this.click(button);
    },
    clickRedButton: async () => {
      const button = this.elements.actionElements.redButton();
      await this.click(button);
    },
    clickGreenButton: async () => {
      const button = this.elements.actionElements.greenButton();
      await this.click(button);
    },
    getTableRowCount: async () => {
      const tableRows = this.elements.visualElements.tableRows();
      return tableRows.count();
    },
    getTableHeaderCount: async () => {
      const tableHeaders = this.elements.visualElements.tableHeaders();
      return tableHeaders.count();
    },
    isCanvasVisible: async () => {
      const canvas = this.elements.visualElements.canvas();
      return canvas.isVisible();
    },
  };

  // Define page navigation
  navigation = {
    goToChallengingDomPage: async () => {
      await this.navigateTo('https://the-internet.herokuapp.com/challenging_dom');
    },
  };

  async dispose(): Promise<void> {
    // Cleanup if needed
  }
}
