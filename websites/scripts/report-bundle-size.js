#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) {
  console.error(`Build output not found: ${dist}`);
  process.exit(1);
}

let totalBytes = 0;
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else totalBytes += fs.statSync(fullPath).size;
  }
}

walk(dist);
console.log(`Bundle size: ${(totalBytes / 1024).toFixed(2)} KB`);
