#!/usr/bin/env node

import { existsSync, statSync } from 'node:fs';
import { RUNNERS } from './constants';
import pmex from './pmex';

const [, , ...args] = process.argv;

const isPackageScript = Boolean(process.env.npm_lifecycle_event);

let command = args.join(' ');

// Check if command replaces package manager detection
if (!isPackageScript && !RUNNERS.some((runner) => command.startsWith(`${runner} `))) {
  let runner = null;
  let mtimeMs = 0;

  const locks = {
    bun: existsSync('bun.lockb') ? statSync('bun.lockb').mtimeMs : 0,
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

  if (runner) {
    command = `${runner} ${command}`;
  }
}

pmex(command);
