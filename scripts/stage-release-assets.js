#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      fail(`Unexpected argument "${token}". Expected --key value pairs.`);
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      fail(`Missing value for argument "${key}".`);
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function cleanDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
  ensureDir(dirPath);
}

function walkDir(dirPath, callback) {
  if (!fs.existsSync(dirPath)) {
    return;
  }
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (entry.isFile()) {
      callback(fullPath);
    }
  });
}

function archTokens(platform, arch) {
  const lowerArch = arch.toLowerCase();
  const tokens = [lowerArch];
  if (lowerArch === 'x64') {
    tokens.push('amd64', 'x86_64', '64bit');
  }
  if (lowerArch === 'arm64') {
    tokens.push('aarch64');
  }
  if (platform === 'macos') {
    tokens.push(`darwin-${lowerArch}`);
  }
  if (platform === 'windows') {
    tokens.push(`win32-${lowerArch}`);
  }
  if (platform === 'linux') {
    tokens.push(`linux-${lowerArch}`);
  }
  return Array.from(new Set(tokens));
}

function matchesArch(filePath, platform, arch) {
  const normalized = filePath.split(path.sep).join('/').toLowerCase();
  const base = path.basename(normalized);
  const candidates = archTokens(platform, arch);
  return candidates.some((token) => {
    if (normalized.includes(`/${token}/`)) {
      return true;
    }
    if (base.includes(`-${token}`) || base.includes(`_${token}`) || base.includes(`.${token}.`)) {
      return true;
    }
    if (base.endsWith(`.${token}`)) {
      return true;
    }
    return false;
  });
}

function main() {
  const args = parseArgs(process.argv);
  const platform = args.platform;
  const arch = args.arch || process.env.npm_config_arch || process.arch;
  const typesArg = args.types;

  if (!platform) {
    fail('Missing required argument --platform');
  }
  if (!arch) {
    fail('Missing required argument --arch or unable to infer architecture.');
  }
  if (!typesArg) {
    fail('Missing required argument --types (comma-separated extensions without dots).');
  }

  const allowedExts = typesArg
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (allowedExts.length === 0) {
    fail('No valid file extensions provided via --types.');
  }

  const repoRoot = path.resolve(__dirname, '..');
  const outMake = path.join(repoRoot, 'out', 'make');
  if (!fs.existsSync(outMake)) {
    fail(`No build outputs found at ${outMake}. Run electron-forge make before staging assets.`);
  }

  const releaseDir = path.join(repoRoot, 'releases', platform, arch);
  cleanDir(releaseDir);

  const versionOverride =
    args.version ||
    process.env.RELEASE_VERSION ||
    process.env.ARTIFACT_VERSION ||
    process.env.PACKAGE_VERSION_OVERRIDE;
  const pkg = require(path.join(repoRoot, 'package.json'));
  const version = versionOverride || pkg.version;
  if (!version) {
    fail('Unable to determine version. Provide --version or set RELEASE_VERSION/ARTIFACT_VERSION.');
  }
  const productName = pkg.productName || pkg.name || 'app';
  const staged = [];
  const matched = [];
  const skipped = [];

  walkDir(outMake, (filePath) => {
    const ext = path.extname(filePath).slice(1).toLowerCase();
    if (!allowedExts.includes(ext)) {
      return;
    }
    if (matchesArch(filePath, platform, arch)) {
      matched.push(filePath);
      return;
    }
    skipped.push(filePath);
  });

  const candidates = matched.length > 0 ? matched : skipped;

  candidates.forEach((filePath) => {
    const ext = path.extname(filePath).slice(1).toLowerCase();
    if (!allowedExts.includes(ext)) {
      return;
    }
    let baseName = path.basename(filePath);
    if (platform === 'windows' && ext === 'msi') {
      // Standardize MSI filenames to include version and arch
      // e.g., VibeMD-1.0.10-x64.msi
      const safeName = String(productName).replace(/[^A-Za-z0-9._-]+/g, '');
      baseName = `${safeName}-${version}-${arch}.msi`;
    }
    const destination = path.join(releaseDir, baseName);
    fs.copyFileSync(filePath, destination);
    staged.push({
      source: path.relative(repoRoot, filePath),
      dest: path.relative(repoRoot, destination)
    });
  });

  if (staged.length === 0) {
    fail(
      `No artifacts with extensions [${allowedExts.join(', ')}] were found under ${path.relative(
        repoRoot,
        outMake
      )}.`
    );
  }

  console.log(`📦 Staged ${staged.length} release artifact(s) for ${platform}/${arch} (v${version}):`);
  staged.forEach((item) => {
    console.log(`  - ${item.dest} ← ${item.source}`);
  });
}

main();
