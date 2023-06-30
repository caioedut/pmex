import pmex from '../src';

pmex(`prettier "{scripts,src,test}/**/*.{js,jsx,ts,tsx}" --check`);

pmex(`tsc --noEmit`);
