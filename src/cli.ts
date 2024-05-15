#!/usr/bin/env node

import pmex from './pmex';

const [, , ...args] = process.argv;

pmex(args.join(' '));
