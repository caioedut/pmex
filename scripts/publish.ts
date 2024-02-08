import { execSync } from 'child_process';

import pmex from '../src/index';

const args = process.argv.slice(2);

pmex('test');

pmex('build');

if (!args.includes('--no-version')) {
  pmex('npm version patch');
  execSync('git push', { stdio: 'inherit' });
}

execSync('npm publish', { stdio: 'inherit' });
