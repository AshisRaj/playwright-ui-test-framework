import { runLintCheck } from './modules/lint';
import { getWorkspaces } from './modules/utils';

function main(): void {
  const workspaces = getWorkspaces();
  const error = runLintCheck(workspaces);
  if (error) {
    throw error;
  }
}

main();
