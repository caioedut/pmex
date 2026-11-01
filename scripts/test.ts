import pmex from '../src';

pmex('biome check ./scripts ./src ./tests');

pmex('tsc --noEmit --skipLibCheck');

pmex('tsx --test tests/resolver.test.ts');
