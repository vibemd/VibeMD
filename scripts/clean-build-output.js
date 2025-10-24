#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      throw new Error(`Unexpected argument "${token}". Expected --key value pairs.`);
    }
    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for argument "${key}".`);
    }
    args[key] = value;
    i += 1;
  }
  return args;
}

function removeDir(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

function main() {
  let platformLabel = 'unknown';
  let archLabel = 'unknown';
  try {
    const args = parseArgs(process.argv);
    platformLabel = args.platform || platformLabel;
    archLabel = args.arch || archLabel;
  } catch (error) {
    console.warn(`[clean-build-output] ${error.message}`);
  }

  const repoRoot = path.resolve(__dirname, '..');
  const outDir = path.join(repoRoot, 'out');
  const makeDir = path.join(outDir, 'make');

  removeDir(makeDir);

  if (fs.existsSync(outDir) && fs.readdirSync(outDir).length === 0) {
    removeDir(outDir);
  }

  console.log(
    `[clean-build-output] Cleared out/make for platform=${platformLabel} arch=${archLabel}`
  );
}

main();
