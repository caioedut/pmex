import ncx from '../src';

ncx(`prettier "{scripts,src,test}/**/*.{js,jsx,ts,tsx}" --check`);
ncx(`tsc --noEmit`);
