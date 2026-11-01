#!/usr/bin/env node

import { existsSync, readFileSync, statSync } from 'node:fs';
import { RUNNERS } from './constants';
import pmex from './pmex';

const [, , ...args] = process.argv;

const isPackageScript = Boolean(process.env.npm_lifecycle_event);

let command = args.join(' ');

if (!isPackageScript) {
  let runner: string | null = null;

  if (!RUNNERS.some((item) => command.startsWith(`${item} `))) {
    // Explicit "packageManager" field has priority over lockfiles
    if (existsSync('package.json')) {
      try {
        const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
        const name = `${pkg.packageManager ?? ''}`.split('@')[0];

        if ((RUNNERS as readonly string[]).includes(name)) {
          runner = name;
        }
      } catch {}
    }

    // Otherwise, use the most recent lockfile
    if (!runner) {
      let mtimeMs = 0;

      const mtime = (file: string) => (existsSync(file) ? statSync(file).mtimeMs : 0);

      const locks = {
        bun: Math.max(mtime('bun.lock'), mtime('bun.lockb')),
        pnpm: mtime('pnpm-lock.yaml'),
        yarn: mtime('yarn.lock'),
        npm: mtime('package-lock.json'),
      };

      for (const [name, modifiedAt] of Object.entries(locks)) {
        if (modifiedAt > mtimeMs) {
          runner = name;
          mtimeMs = modifiedAt;
        }
      }
    }

    // Nothing detected, fallback to npm
    runner ??= 'npm';

    command = `${runner} ${command}`;
  }
}

try {
  pmex(command);
} catch (error: any) {
  // The child process already printed its own output
  process.exit(typeof error?.status === 'number' ? error.status : 1);
}
