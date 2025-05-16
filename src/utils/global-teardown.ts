import chalk from 'chalk';
import { resolve } from 'path';
import { rimraf } from 'rimraf';
import logger from './logger';

async function globalTeardown() {
  logger.info(chalk.blue('Global Teardown Started'));

  const cookiesGlob = resolve('artifacts/cookies/standard_user_cookies.json');

  // Cleanup old artifacts using glob pattern
  rimraf(cookiesGlob);
  logger.info(chalk.green(`Deleted files matching: ${cookiesGlob}`));

  // Add your global teardown logic here
  logger.info(chalk.green('Global Teardown Completed'));
}

export default globalTeardown;
