import { spawnSync } from 'child_process';
import path from 'path';

/**
 * Get the path to the Yarn executable.
 */
export function getYarnPath(): string {
  return path.join(process.env.APPDATA || '', 'npm', 'yarn.cmd'); // For Windows
}

/**
 * Execute a Yarn command and return the result.
 */
export function executeYarnCommand(
  args: string[],
  options: Record<string, unknown> = {},
): ReturnType<typeof spawnSync> {
  const yarnPath = getYarnPath();
  return spawnSync(yarnPath, args, { encoding: 'utf-8', shell: true, ...options });
}

/**
 * Parse the output of a Yarn command.
 */
export function parseYarnOutput(output: string): Record<string, unknown> {
  try {
    return JSON.parse(output.trim());
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse Yarn output: ${error.message}`);
    } else {
      throw new Error('Failed to parse Yarn output due to an unknown error.');
    }
  }
}

export function getWorkspaces(location?: string): string[] {
  const workspacesCmd = executeYarnCommand(['workspaces', 'info']);
  if (workspacesCmd.error) {
    throw new Error(`Failed to execute Yarn command: ${workspacesCmd.error.message}`);
  }

  const stdout = (workspacesCmd.stdout as string).trim(); // Explicitly cast stdout to string
  if (!stdout) {
    throw new Error('No output from Yarn workspaces info command.');
  }

  const workspacesInfo = parseYarnOutput(stdout) as Record<string, { location: string }>;
  const workspaces: string[] = [];
  for (const [name, info] of Object.entries(workspacesInfo)) {
    if (info.location !== '.') {
      if (location) {
        if (info.location.includes(location)) {
          workspaces.push(name);
        }
      } else {
        workspaces.push(name);
      }
    }
  }
  return workspaces;
}

export function checkForErrors(workspace: string, cmd: string) {
  return executeYarnCommand(['workspace', workspace, 'run', cmd], { stdio: 'inherit' });
}
