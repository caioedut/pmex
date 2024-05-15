import { rmSync } from 'node:fs';
import pmex from '../src';

// Remove current build
rmSync('dist', {
  recursive: true,
  force: true,
});

pmex('tsc --build');
