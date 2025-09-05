#!/usr/bin/env node

import { existsSync, readFileSync, statSync } from 'node:fs';
import { RUNNERS } from './constants';
import pmex from './pmex';

const [, , ...args] = process.argv;

const isPackageScript = Boolean(process.env.npm_lifecycle_event);

let command = args.join(' ');

if (!isPackageScript) {
  let runner = null;

  if (existsSync('package.json')) {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

    if (pkg.packageManager) {
      runner = pkg.packageManager?.split('@')?.[0];
    }
  }

  if (!RUNNERS.some((runner) => command.startsWith(`${runner} `))) {
    let mtimeMs = 0;

    const bunLock = existsSync('bun.lock') ? statSync('bun.lock').mtimeMs : 0;
    const bunLockB = existsSync('bun.lockb') ? statSync('bun.lockb').mtimeMs : 0;

    const locks = {
      bun: Math.max(bunLock, bunLockB),
      pnpm: existsSync('pnpm-lock.yaml') ? statSync('pnpm-lock.yaml').mtimeMs : 0,
      yarn: existsSync('yarn.lock') ? statSync('yarn.lock').mtimeMs : 0,
      npm: existsSync('package-lock.json') ? statSync('package-lock.json').mtimeMs : 0,
    };

    for (const attr in locks) {
      // @ts-expect-error
      const currentModifiedAt = locks[attr];

      if (currentModifiedAt && currentModifiedAt > mtimeMs) {
        runner = attr;
        mtimeMs = currentModifiedAt;
      }
    }
  }

  if (runner) {
    command = `${runner} ${command}`;
  }
}

pmex(command);
