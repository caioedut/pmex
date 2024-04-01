import { rmSync } from 'fs';
import pmex from '../src/index';

// Remove current build
rmSync('dist', {
  recursive: true,
  force: true,
});

pmex('tsc --build');
