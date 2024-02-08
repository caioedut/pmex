import pmex from '../src';

pmex(`prettier "{scripts,src}/**/*.{js,jsx,ts,tsx}" --check`);

pmex(`tsc --noEmit`);
