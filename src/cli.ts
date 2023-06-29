#!/usr/bin/env node

import ncx from './index';

const [, , ...args] = process.argv;

ncx(args.join(' '));
