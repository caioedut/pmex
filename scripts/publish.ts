import pmex from '../src/index';

pmex('tsc --build --force');

pmex('npm version patch');

pmex('npm publish');

pmex('git push');
