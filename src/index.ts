import { execSync, ExecSyncOptions } from 'child_process';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';

export default function pmex(command: string | { npm: string; yarn: string; pnpm: string }, options?: ExecSyncOptions) {
  const execPath = `${process?.env?.npm_execpath || ''}`.toLowerCase();

  const runners = ['npx', 'npm', 'yarn', 'pnpm'] as const;

  let runner: (typeof runners)[number] = execPath.includes('pnpm')
    ? 'pnpm'
    : execPath.includes('yarn')
    ? 'yarn'
    : 'npm';

  if (typeof command !== 'string') {
    command = command?.[runner];
  }

  command = `${command ?? ''}`.trim();

  // Check if command replaces package manager detection
  if (runners.some((runner) => (command as string).startsWith(`${runner} `))) {
    // @ts-expect-error
    runner = command.split(' ', 1).shift();
  }

  command = command
    .replace(/^(npx|npm|yarn|pnpm)\s+/, '')
    .replace(/^(run)\s+/, '')
    .trim();

  // Detect binaries
  const binPath = join(`${process.cwd()}`, 'node_modules', '.bin');
  const binScripts = existsSync(binPath) ? readdirSync(binPath).filter((file) => !file.includes('.')) : [];

  // Detect scripts
  const pkgPath = join(`${process.cwd()}`, 'package.json');
  const pkgScripts: string[] = existsSync(pkgPath) ? Object.keys(require(pkgPath)?.scripts ?? {}) : [];

  const cmdArg = command.split(' ').shift() ?? '';
  const isBinScript = binScripts.includes(cmdArg);
  const isPkgScript = pkgScripts.includes(cmdArg);
  const runScript = `${isBinScript ? '' : `${runner} `}${isPkgScript ? 'run ' : ''}${command}`;

  process.stdout.write(`\n`);
  process.stdout.write(`\x1b[44m`);
  process.stdout.write(` ${runner} `);
  if (isBinScript) {
    process.stdout.write(`\x1b[42m`);
    process.stdout.write(` bin `);
  }
  if (isPkgScript) {
    process.stdout.write(`\x1b[43m`);
    process.stdout.write(` run `);
  }
  process.stdout.write(`\x1b[100m`);
  process.stdout.write(` ${command} `);
  process.stdout.write(`\x1b[0m`);
  process.stdout.write(`\n\n`);

  return execSync(runScript, {
    stdio: 'inherit',
    encoding: 'utf-8',
    ...options,
  });
}
