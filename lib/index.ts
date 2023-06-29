import { execSync, ExecSyncOptions } from 'child_process';

export const isYarn = `${process?.env?.npm_execpath || ''}`.toLowerCase().includes('yarn');

/**
 *
 * @param {string} command
 * @param {import('child_process').ExecSyncOptions} options
 * @returns {string}
 */
export default function runx(command: string, options: ExecSyncOptions) {
  const runner = isYarn ? 'yarn' : 'npm';
  const argv = command.replace(/^(yarn|npm)/, runner).trim();
  const label = argv.replace(/^(yarn|npm)/, '').trim();

  process.stdout.write(`\n`);
  process.stdout.write(`\x1b[44m`);
  process.stdout.write(`[${runner}]`);
  process.stdout.write(`\x1b[0m`);
  process.stdout.write(`\x1b[2m`);
  process.stdout.write(` ${label}`);
  process.stdout.write(`\x1b[0m`);
  process.stdout.write(`\n\n`);

  return execSync(argv, { stdio: 'inherit', ...options });
}
