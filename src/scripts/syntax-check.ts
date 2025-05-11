import { getWorkspaces } from './modules/utils';
import { runSyntaxCheck } from './modules/yarn';

function main(): void {
  const workspaces = getWorkspaces();
  const error = runSyntaxCheck(workspaces);
  if (error) {
    throw error;
  }
}

main();
