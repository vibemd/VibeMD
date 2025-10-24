#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const releasesRoot = path.join(repoRoot, 'releases');

const PLATFORM_RULES = {
  macos: { allowed: ['.dmg', '.zip', '.json'], optional: false },
  windows: { allowed: ['.msi', '.zip', '.json'], optional: true },
  linux: { allowed: ['.deb', '.rpm', '.json'], optional: true },
};

function listDir(dirPath) {
  try {
    return fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function main() {
  if (!fs.existsSync(releasesRoot)) {
    console.log('No releases directory found; skipping verification.');
    return;
  }

  const issues = [];

  for (const [platform, rule] of Object.entries(PLATFORM_RULES)) {
    const platformDir = path.join(releasesRoot, platform);
    const archEntries = listDir(platformDir).filter((entry) => entry.isDirectory());

    if (archEntries.length === 0) {
      if (!rule.optional) {
        issues.push(`Missing required release artifacts for ${platform} (expected files under ${path.relative(repoRoot, platformDir)})`);
      }
      continue;
    }

    archEntries.forEach((archEntry) => {
      const archDir = path.join(platformDir, archEntry.name);
      const files = listDir(archDir).filter((entry) => entry.isFile());
      if (files.length === 0) {
        issues.push(`Release directory ${path.relative(repoRoot, archDir)} is empty.`);
      }
      files.forEach((fileEntry) => {
        const fileExt = path.extname(fileEntry.name).toLowerCase();
        if (!rule.allowed.includes(fileExt)) {
          issues.push(
            `Unexpected file extension in ${path.relative(repoRoot, path.join(archDir, fileEntry.name))} (allowed: ${rule.allowed.join(', ')})`
          );
        }
      });
    });
  }

  if (issues.length > 0) {
    console.error('Release folder verification failed:');
    issues.forEach((issue) => console.error(` - ${issue}`));
    process.exit(1);
  }

  console.log('✅ Release folder structure is valid.');
}

main();
