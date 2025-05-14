import chalk from 'chalk';
import { resolve } from 'path';
import { rimraf } from 'rimraf';
import logger from './logger';

async function globalTeardown() {
  logger.info(chalk.blue('Global Teardown Started'));

  const cookiesPath = resolve(__dirname, '../../artifacts/cookies');

  // Cleanup old artifacts
  rimraf(`${cookiesPath}`);
  logger.info(chalk.green(`Deleted: ${cookiesPath}`));

  // Add your global teardown logic here
  logger.info(chalk.green('Global Teardown Completed'));
}

export default globalTeardown;
