#!/usr/bin/env node
/* eslint-disable no-console */
const { execSync } = require('child_process');
const path = require('path');

function parseVersion(input) {
  if (!input) return null;
  const match = `${input}`.trim().match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3])
  };
}

function compareVersions(a, b) {
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

function formatVersion(parts) {
  if (!parts) {
    throw new Error('Cannot format empty version parts.');
  }
  return `${parts.major}.${parts.minor}.${parts.patch}`;
}

function incrementVersion(base, bump = 'patch') {
  if (!base) {
    return null;
  }
  switch (bump) {
    case 'major':
      return { major: base.major + 1, minor: 0, patch: 0 };
    case 'minor':
      return { major: base.major, minor: base.minor + 1, patch: 0 };
    case 'patch':
    default:
      return { major: base.major, minor: base.minor, patch: base.patch + 1 };
  }
}

function readPackageVersion() {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const pkg = require(path.resolve(__dirname, '..', 'package.json'));
    return parseVersion(pkg.version);
  } catch (error) {
    console.warn('[get-next-release-version] Unable to read package.json version:', error.message);
    return null;
  }
}

function readTaggedVersions() {
  try {
    const stdout = execSync('git tag --list "v[0-9]*"', { encoding: 'utf8' });
    return stdout
      .split('\n')
      .map((line) => parseVersion(line))
      .filter(Boolean);
  } catch (error) {
    console.warn('[get-next-release-version] Unable to read git tags:', error.message);
    return [];
  }
}

function getHighestVersion(versions) {
  return versions.reduce((highest, current) => (compareVersions(current, highest) > 0 ? current : highest), null);
}

const bumpType = process.env.VERSION_BUMP || 'patch';
const packageVersion = readPackageVersion();
const tagVersions = readTaggedVersions();
const highestTagVersion = getHighestVersion(tagVersions);

let targetVersion = null;

if (packageVersion && compareVersions(packageVersion, highestTagVersion) > 0) {
  targetVersion = packageVersion;
} else if (highestTagVersion) {
  targetVersion = incrementVersion(highestTagVersion, bumpType);
} else if (packageVersion) {
  targetVersion = packageVersion;
} else {
  targetVersion = { major: 0, minor: 1, patch: 0 };
}

if (!targetVersion) {
  console.error('[get-next-release-version] Failed to determine target version.');
  process.exit(1);
}

const formatted = formatVersion(targetVersion);
console.log(formatted);
