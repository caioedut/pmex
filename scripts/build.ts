import { rmSync } from 'fs';
import ncx from '../src/index';

// Remove current build
rmSync('dist', {
  recursive: true,
  force: true,
});

ncx('tsc --build');
