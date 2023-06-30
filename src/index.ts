import { execSync, ExecSyncOptions } from 'child_process';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';

export default function pmex(command: string | { npm: string; yarn: string; pnpm: string }, options?: ExecSyncOptions) {
  // Set package manager
  const execPath = `${process?.env?.npm_execpath || ''}`.toLowerCase();
  const pm = execPath.includes('yarn') ? 'yarn' : execPath.includes('pnpm') ? 'pnpm' : 'npm';

  const binPath = join(`${process.cwd()}`, 'node_modules', '.bin');
  const binScripts = existsSync(binPath) ? readdirSync(binPath).filter((file) => !file.includes('.')) : [];

  const pkgPath = join(`${process.cwd()}`, 'package.json');
  const pkgScripts: string[] = existsSync(pkgPath) ? Object.keys(require(pkgPath)?.scripts ?? {}) : [];

  const args = (typeof command === 'string' ? command : command?.[pm]).trim().split(' ');
  const isNpx = args?.[0] === 'npx';

  const pmRunner = isNpx ? 'npx' : pm;
  const pmCommand = args
    .join(' ')
    .replace(/^(npm|yarn|pnpm|npx)\s+/, '')
    .replace(/^(run)\s+/, '')
    .trim();

  const cmdArg = pmCommand.split(' ').shift() ?? '';
  const isBinScript = binScripts.includes(cmdArg);
  const isPkgScript = pkgScripts.includes(cmdArg);
  const runScript = `${isBinScript ? '' : `${pmRunner} `}${isPkgScript ? 'run ' : ''}${pmCommand}`;

  process.stdout.write(`\n`);
  process.stdout.write(`\x1b[44m`);
  process.stdout.write(` ${pmRunner} `);
  if (isPkgScript) {
    process.stdout.write(`\x1b[43m`);
    process.stdout.write(` run `);
  }
  process.stdout.write(`\x1b[100m`);
  process.stdout.write(` ${pmCommand} `);
  process.stdout.write(`\x1b[0m`);
  process.stdout.write(`\n\n`);

  return execSync(runScript, {
    stdio: 'inherit',
    encoding: 'utf-8',
    ...options,
  });
}
