import logger from '@utils/logger';
import chalk from 'chalk';
import { checkForErrors } from './utils';

export function runLintCheck(workspaces: string[]): Error | void {
  const erroredWorkspaces: string[] = [];
  workspaces.forEach((ws) => {
    logger.info(`╭─ Checking ${chalk.green(ws)} workspace for linting errors ...`);
    const results = checkForErrors(ws, 'lint');
    if (results.status === 0) {
      logger.info('╰─➤ ✅ No errors found.');
    } else {
      logger.info('╰─➤ 🛑 Error');
      let message = 'LINT CHECK FAILED';
      if (results.error) {
        message = results.error.toString();
      } else if (results.stderr) {
        message = results.stderr.toString();
      }
      console.error(message);
      erroredWorkspaces.push(ws);
    }
  });
  if (erroredWorkspaces.length > 0) {
    const msg = `Lint check failed for ${erroredWorkspaces.join(', ')} workspace${erroredWorkspaces.length > 1 ? 's' : ''}`;
    return new Error(chalk.red(msg));
  }
}
