#!/usr/bin/env node
/* eslint-disable no-console */
const { spawnSync } = require('child_process');

const commands = [
  { cmd: 'npm', args: ['run', 'lint'], description: 'Lint source with ESLint' },
  { cmd: 'npx', args: ['tsc', '--noEmit'], description: 'Type-check TypeScript sources' },
  { cmd: 'node', args: ['scripts/verify-release-structure.js'], description: 'Validate staged releases folder' }
];

function runCommand({ cmd, args, description }) {
  console.log(`\n▶ ${description}`);
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`);
  }
}

function main() {
  commands.forEach(runCommand);
  console.log('\n✅ Smoke tests passed');
}

main();
