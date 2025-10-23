#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function guessFormat(filePath) {
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  switch (ext) {
    case 'msi':
      return 'msi';
    case 'zip':
      return 'zip';
    case 'dmg':
      return 'dmg';
    case 'deb':
      return 'deb';
    case 'rpm':
      return 'rpm';
    default:
      return ext || 'binary';
  }
}

function sha256(filePath) {
  const hash = crypto.createHash('sha256');
  const data = fs.readFileSync(filePath);
  hash.update(data);
  return hash.digest('hex');
}

function parseFiles(input) {
  if (!input) {
    return [];
  }
  return input
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function main() {
  const version = process.env.ARTIFACT_VERSION;
  const platform = process.env.ARTIFACT_PLATFORM;
  const arch = process.env.ARTIFACT_ARCH;
  const filesInput = process.env.ARTIFACT_FILES;
  const fileListPath = process.env.ARTIFACT_FILELIST_PATH;
  const outputPath = process.env.ARTIFACT_MANIFEST_PATH || 'manifest.json';
  const unsigned = process.env.ARTIFACT_UNSIGNED !== 'false';

  if (!version || !platform || !arch) {
    fail('ARTIFACT_VERSION, ARTIFACT_PLATFORM, and ARTIFACT_ARCH environment variables are required.');
  }

  let files = parseFiles(filesInput);
  if ((!files || files.length === 0) && fileListPath) {
    if (!fs.existsSync(fileListPath)) {
      fail(`ARTIFACT_FILELIST_PATH does not exist: ${fileListPath}`);
    }
    const list = fs.readFileSync(fileListPath, 'utf8');
    files = parseFiles(list);
  }
  if (files.length === 0) {
    fail('ARTIFACT_FILES must include at least one file path.');
  }

  const manifest = {
    version,
    platform,
    arch,
    unsigned,
    buildTimestamp: new Date().toISOString(),
    artifacts: files.map((filePath) => {
      const resolved = path.resolve(filePath);
      if (!fs.existsSync(resolved)) {
        fail(`Artifact file not found: ${resolved}`);
      }
      return {
        fileName: path.basename(resolved),
        relativePath: path.relative(process.cwd(), resolved),
        format: guessFormat(resolved),
        size: fs.statSync(resolved).size,
        sha256: sha256(resolved)
      };
    })
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Created manifest at ${outputPath}`);
}

main();
