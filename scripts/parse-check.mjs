#!/usr/bin/env node
// Parse-check every .js / .jsx file in src/ (and top-level config files) with
// @babel/parser. This substitutes for `npm run build` inside the Claude sandbox,
// where Vite's rollup linux-arm64-gnu native binary is absent. Parse-check
// catches syntax errors, stray braces, typoed imports, and most structural
// regressions. It does not catch type errors or runtime bugs.
//
// Usage: node scripts/parse-check.mjs
// Exits 0 if all files parse. Exits 1 with a per-file error report otherwise.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';

const root = fileURLToPath(new URL('..', import.meta.url));

const TARGET_DIRS = ['src'];
const TOP_LEVEL_FILES = [
  'tailwind.config.js',
  'postcss.config.js',
  'vite.config.js',
];

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, acc);
    } else if (/\.(jsx?|mjs)$/.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
}

const files = [];
for (const d of TARGET_DIRS) {
  const full = join(root, d);
  try {
    statSync(full);
    walk(full, files);
  } catch (err) {
    // directory missing — fine during bootstrap
  }
}
for (const f of TOP_LEVEL_FILES) {
  try {
    statSync(join(root, f));
    files.push(join(root, f));
  } catch (err) {
    // skip missing
  }
}

let failed = 0;
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  try {
    parse(src, {
      sourceType: 'module',
      allowImportExportEverywhere: true,
      errorRecovery: false,
      plugins: ['jsx'],
    });
    console.log(`ok    ${relative(root, file)}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL  ${relative(root, file)}`);
    console.error(`      ${err.message}`);
  }
}

console.log('');
if (failed > 0) {
  console.error(`parse-check failed · ${failed} file(s) broken`);
  process.exit(1);
}
console.log(`parse-check passed · ${files.length} file(s) clean`);
