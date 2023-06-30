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
  process.stdout.write(colors.bgBlue);
  process.stdout.write(` ${runner} `);
  if (isBinScript) {
    process.stdout.write(colors.bgGreen);
    process.stdout.write(` bin `);
  }
  if (isPkgScript) {
    process.stdout.write(colors.bgYellow);
    process.stdout.write(` run `);
  }
  process.stdout.write(colors.bgGray);
  process.stdout.write(` ${command} `);
  process.stdout.write(colors.reset);
  process.stdout.write(`\n\n`);

  try {
    return execSync(runScript, {
      stdio: 'inherit',
      encoding: 'utf-8',
      ...options,
    });
  } catch (error: any) {
    const message = error?.message ?? error?.text ?? error?.title ?? error?.name ?? error?.code ?? 'No message';

    let stack: string[] = [];

    if (typeof error?.stack === 'string') {
      stack = error.stack
        .split(`\n`)
        .map((line: string) => line.trim())
        .filter((line: string) => /^at\s+/.test(line))
        .map((line: string) => {
          const cwdRegex = new RegExp(`^${process.cwd().replace(/\\/g, `\\\\`)}`, 'i');

          return line //
            .substring(line.indexOf('('))
            .replace(/^\(/, '')
            .replace(/\)$/, '')
            .replace(cwdRegex, '.');
        });
    }

    process.stdout.write(`\n`);
    process.stdout.write(colors.bgRed);
    process.stdout.write(` ERROR `);
    process.stdout.write(colors.bgGray);
    process.stdout.write(` ${message} `);
    process.stdout.write(colors.reset);

    stack.forEach((item) => {
      const split = item.split(':');
      const column = split.pop();
      const row = split.pop();
      const path = split.join(':').replace(/\\/g, '/');
      const padding = process.stdout.columns - ` ERROR  ${path}  ${row}:${column} `.length;

      process.stdout.write(`\n`);
      process.stdout.write(colors.bgYellow);
      process.stdout.write(` TRACE `);
      process.stdout.write(colors.bgGray);
      process.stdout.write(` ${path} `);
      process.stdout.write(``.padEnd(padding, ' '));
      process.stdout.write(colors.bgBlue);
      process.stdout.write(` ${row}:${column} `);
      process.stdout.write(colors.reset);
    });

    process.stdout.write(`\n\n`);
    process.exit(1);
  }
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
