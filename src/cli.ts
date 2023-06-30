#!/usr/bin/env node

import pmex from './index';

const [, , ...args] = process.argv;

pmex(args.join(' '));
