import { Reporter, TestCase, TestError, TestResult, TestStep } from '@playwright/test/reporter';
import logger from '@utils/logger';
import chalk from 'chalk';
import fs from 'fs';
import { join } from 'path';

export default class CustomReporterConfig implements Reporter {
  private passedTests: number = 0;
  private failedTests: number = 0;
  private skippedTests: number = 0;
  private timedOutTests: number = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  onBegin(config: any, suite: any): void {
    const allureResultPath = join(__dirname, '..', '..', 'artifacts', 'reports', 'allure-results');

    if (!fs.existsSync(allureResultPath)) {
      fs.mkdirSync(join(allureResultPath), { recursive: true });
    }

    const srcDir = join(__dirname, 'executor.json');
    const destDir = join(allureResultPath, 'executor.json');

    fs.copyFileSync(srcDir, destDir);

    logger.info(chalk.blue('Test suite execution started.'));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEnd(result: any): void {
    logger.info(chalk.green(`Test suite execution completed with status: ${result.status}`));
    logger.info(chalk.blue('Test Summary:'));
    logger.info(chalk.green(`  Passed: ${this.passedTests}`));
    logger.info(chalk.red(`  Failed (failed + timed out): ${this.failedTests + this.timedOutTests}`));
    logger.info(chalk.yellow(`  Skipped: ${this.skippedTests}`));
    logger.info(chalk.red(`  Timed Out: ${this.timedOutTests}`));
  }

  onTestBegin(test: TestCase): void {
    logger.info(chalk.yellow(`Test case started: ${test.title}`));
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const statusColor = result.status === 'passed' ? chalk.green : chalk.red;
    logger.info(statusColor(`Test case completed: ${test.title} | Status: ${result.status}`));

    // Update counters based on test result
    if (result.status === 'passed') {
      this.passedTests++;
    } else if (result.status === 'failed') {
      this.failedTests++;
    } else if (result.status === 'skipped') {
      this.skippedTests++;
    } else if (result.status === 'timedOut') {
      this.timedOutTests++;
    }
  }

  onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
    if (step.category === `test.step`) {
      logger.info(chalk.cyan(`Executing step: ${step.title} | Test case: ${test.title}`));
    }
  }

  onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
    if (step.category === `test.step`) {
      logger.info(chalk.magenta(`Completed step: ${step.title} | Test case: ${test.title}`));
    }
  }

  onError(error: TestError): void {
    logger.info(chalk.red(`Error encountered: ${error.message}`));
  }
}
