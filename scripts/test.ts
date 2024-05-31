import pmex from '../src';

pmex('biome check ./scripts ./src');

pmex('tsc --noEmit --skipLibCheck');
