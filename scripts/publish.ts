import { execSync } from 'child_process';

import pmex from '../src/index';

pmex('test');

pmex('tsc --build --force');

pmex('npm version patch');

pmex('npm publish');

execSync('git push', { stdio: 'inherit' });
