#!/usr/bin/env node

import { join } from 'path';
import { existsSync } from 'fs';

import pmex from './index';

const [, , ...args] = process.argv;

const runners = ['npx', 'npm', 'yarn', 'pnpm'];

let command = args.join(' ').trim();

if (!runners.some((runner) => command.startsWith(`${runner} `))) {
  // Auto detect package manager
  const hasNpmLock = existsSync(join(`${process.cwd()}`, 'package-lock.json'));
  const hasYarnLock = existsSync(join(`${process.cwd()}`, 'yarn.lock'));
  const hasPnpmLock = existsSync(join(`${process.cwd()}`, 'pnpm-lock.yaml'));

  if ([hasNpmLock, hasYarnLock, hasPnpmLock].filter(Boolean).length > 1) {
    throw new Error(`Unable to set package manager, you have more than one lockfile.`);
  }

  command = `${hasPnpmLock ? 'pnpm' : hasYarnLock ? 'yarn' : 'npm'} ${command}`;
}

pmex(command);
