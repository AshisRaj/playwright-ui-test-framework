import chalk from 'chalk';
import logger from './logger';

async function globalTeardown() {
  logger.info(chalk.blue('Global Teardown Started'));

  // Add your global teardown logic here
  logger.info(chalk.green('Global Teardown Completed'));
}

export default globalTeardown;
