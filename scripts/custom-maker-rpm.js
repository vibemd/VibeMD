const path = require('path');
const fs = require('fs-extra');
const { MakerBase } = require('@electron-forge/maker-base');
const { rpmArch } = require('@electron-forge/maker-rpm');
const { Installer } = require('electron-installer-redhat');

function renameRpm(dest) {
  return path.join(
    dest,
    '<%= name %>-<%= version %>-<%= revision %>.<%= arch === "aarch64" ? "arm64" : arch %>.rpm'
  );
}

class CustomMakerRpm extends MakerBase {
  constructor(...args) {
    super(...args);
    this.name = 'rpm';
    this.defaultPlatforms = ['linux'];
    this.requiredExternalBinaries = ['rpmbuild'];
  }

  isSupportedOnCurrentPlatform() {
    return this.isInstalled('electron-installer-redhat');
  }

  async make({ dir, makeDir, targetArch }) {
    const outDir = path.resolve(makeDir, 'rpm', targetArch);
    await this.ensureDirectory(outDir);

    const installer = new Installer({
      logger: () => {},
      ...this.config,
      arch: rpmArch(targetArch),
      src: dir,
      dest: outDir,
      rename: renameRpm,
    });

    await installer.generateDefaults();
    await installer.generateOptions();
    await installer.generateScripts();
    await installer.createStagingDir();
    await installer.createContents();

    const specPath = installer.specPath;
    if (await fs.pathExists(specPath)) {
      const originalSpec = await fs.readFile(specPath, 'utf8');
      const patchedSpec = originalSpec
        .replace(/cp -R usr\/(\*|\.)/g, 'cp -R %{_topdir}/usr/.')
        .replace(/cp -r usr\/(\*|\.)/g, 'cp -r %{_topdir}/usr/.');
      if (patchedSpec !== originalSpec) {
        await fs.writeFile(specPath, patchedSpec, 'utf8');
      }
    }

    const buildRoot = path.join(installer.stagingDir, 'BUILD');
    const buildSubdir = path.join(
      buildRoot,
      `${installer.options.name}-${installer.options.version}-build`
    );
    const usrSource = path.join(buildRoot, 'usr');
    const rootUsr = path.join(installer.stagingDir, 'usr');

    if (await fs.pathExists(usrSource)) {
      await fs.ensureDir(rootUsr);
      await fs.copy(usrSource, rootUsr, { recursive: true });
    } else if (process.env.DEBUG_RPM_MAKER) {
      console.warn('[custom-maker-rpm] usr source directory missing at', usrSource);
    }
    if (process.env.DEBUG_RPM_MAKER) {
      console.log('[custom-maker-rpm] staged rpm tree at', buildSubdir);
    }

    await installer.createPackage();
    await installer.movePackage();
    return installer.options.packagePaths;
  }
}

module.exports = CustomMakerRpm;
module.exports.CustomMakerRpm = CustomMakerRpm;
