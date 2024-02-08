import { rmSync } from 'fs';
import pmex from '../src/index';

// Remove current build
rmSync('dist', { force: true, recursive: true });

// Build with ParcelJS
pmex('parcel build');
