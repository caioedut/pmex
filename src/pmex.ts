import { type ExecSyncOptions, execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { RUNNERS } from './constants';
import resolver from './resolver';

export type Command =
  | string
  | {
      default: string;
      npm?: string;
      yarn?: string;
      pnpm?: string;
      bun?: string;
    }
  | {
      npm: string;
      yarn: string;
      pnpm: string;
      bun: string;
    };

export default function pmex(command: Command, options?: ExecSyncOptions) {
  const execPath = `${process?.env?.npm_execpath || ''}`.toLowerCase();

  let runner: (typeof RUNNERS)[number] | null = execPath.includes('bun')
    ? 'bun'
    : execPath.includes('pnpm')
      ? 'pnpm'
      : execPath.includes('yarn')
        ? 'yarn'
        : execPath.includes('npm')
          ? 'npm'
          : null;

  // @ts-expect-error
  let cmd: string = `${typeof command === 'string' ? command : command?.[runner] ?? command?.default}`.trim();

  // Check if command replaces package manager detection
  if (RUNNERS.some((runner) => cmd.startsWith(`${runner} `))) {
    // @ts-expect-error
    runner = cmd.split(' ', 1).shift();
  }

  cmd = cmd
    .replace(new RegExp(`^(${RUNNERS.join('|')})\\s+`), '')
    .replace(/^(run)\s+/, '')
    .trim();

  // Detect global binaries
  const npmGlobalDir = execSync('npm root -g').toString().trim();
  const globalBins = readdirSync(npmGlobalDir)
    .filter((file) => {
      return existsSync(join(npmGlobalDir, file, 'package.json'));
    })
    .flatMap((file) => {
      const pkgJSON = require(join(npmGlobalDir, file, 'package.json'));
      const pkgBin = pkgJSON.bin ?? {};
      return typeof pkgBin === 'string' ? pkgJSON.name : Object.keys(pkgBin);
    });

  // Detect local binaries
  const binPath = join(`${process.cwd()}`, 'node_modules', '.bin');
  const localBins = existsSync(binPath) ? readdirSync(binPath).map((file) => file.split('.').shift()) : [];

  // All bins
  const binScripts: string[] = [...globalBins, ...localBins];

  // Detect scripts
  const pkgPath = join(`${process.cwd()}`, 'package.json');
  const pkgScripts: string[] = existsSync(pkgPath) ? Object.keys(require(pkgPath)?.scripts ?? {}) : [];

  const cmdArg = cmd.split(' ').shift() ?? '';
  const isBinScript = binScripts.includes(cmdArg);
  const isPkgScript = pkgScripts.includes(cmdArg);
  const runScript = resolver(`${isBinScript ? '' : `${runner} `}${isPkgScript ? 'run ' : ''}${cmd}`);

  const splitScript = runScript.split(' ');
  const printRunner = isBinScript ? runner : splitScript.shift();
  const printCommand = (isPkgScript ? splitScript.slice(1) : splitScript).join(' ');

  process.stdout.write('\n');
  process.stdout.write(colors.bgBlue);
  process.stdout.write(` ${printRunner} `);
  if (isBinScript) {
    process.stdout.write(colors.bgGreen);
    process.stdout.write(' bin ');
  }
  if (isPkgScript) {
    process.stdout.write(colors.bgYellow);
    process.stdout.write(' run ');
  }
  process.stdout.write(colors.reset);
  process.stdout.write(` ${printCommand}`);
  process.stdout.write('\n\n');

  return execSync(runScript, {
    stdio: 'inherit',
    encoding: 'utf-8',
    ...options,
  });
}

const colors = {
  // Defaults
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  // Background
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  bgGray: '\x1b[100m',
};
