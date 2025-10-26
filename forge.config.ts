import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerWix } from '@electron-forge/maker-wix';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerDeb } from '@electron-forge/maker-deb';
// Avoid importing the custom RPM maker on non-Linux hosts to prevent
// requiring linux-only dependencies (electron-installer-redhat) during
// Windows/macOS builds.
let CustomMakerRpm: any;
const enableRpmMaker = process.platform === 'linux' || process.env.FORCE_RPM === '1';
if (enableRpmMaker) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('./scripts/custom-maker-rpm');
  CustomMakerRpm = mod?.default ?? mod;
}
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
import { preloadConfig } from './webpack.preload.config';

const enableWix = process.platform === 'win32' && process.env.SKIP_WIX !== '1';
const macSignIdentity = process.env.MAC_CODESIGN_IDENTITY;
const macEntitlementsPath = './entitlements.plist';
const macSignConfig = macSignIdentity
  ? {
      identity: macSignIdentity,
      hardenedRuntime: true,
      entitlements: macEntitlementsPath,
      entitlementsInherit: macEntitlementsPath,
      gatekeeperAssess: false,
    }
  : undefined;
const fallbackMacIdentity = macSignIdentity ?? '-';

function runCodeSign(appPath: string) {
  if (process.platform !== 'darwin') {
    return;
  }
  if (!fs.existsSync(appPath) || !fs.statSync(appPath).isDirectory()) {
    return;
  }
  const identity = fallbackMacIdentity;
  console.log(`[codesign] Signing ${appPath} with identity "${identity}".`);
  const baseArgs = ['--force', '--deep', '--sign', identity];
  if (macSignIdentity) {
    baseArgs.push('--options', 'runtime', '--entitlements', macEntitlementsPath);
  }
  const signResult = spawnSync('codesign', [...baseArgs, appPath], {
    stdio: 'pipe',
    encoding: 'utf8',
  });
  if (signResult.status !== 0) {
    throw new Error(
      `codesign failed for ${appPath}: ${(signResult.stderr || '').toString().trim() || 'Unknown error'}`
    );
  }

  const verifyArgs = ['--verify', '--deep', '--strict', appPath];
  const verifyResult = spawnSync('codesign', verifyArgs, {
    stdio: 'pipe',
    encoding: 'utf8',
  });
  if (verifyResult.status !== 0) {
    throw new Error(
      `codesign verification failed for ${appPath}: ${(verifyResult.stderr || '').toString().trim() || 'Unknown error'}`
    );
  }
  console.log(`[codesign] Verification succeeded for ${appPath}.`);
}

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    name: 'VibeMD',
    executableName: 'VibeMD',
    icon: './build/icons/icon',
    appCopyright: 'Copyright © 2025 ONLY1 Pty Ltd',
    appBundleId: 'com.vibemd.app',
    // Let the webpack plugin handle ignore patterns automatically
    // It will keep only .webpack directory and add Electron resources (icudtl.dat, locales, etc.)
    // macOS file associations
    protocols: [
      {
        name: 'VibeMD',
        schemes: ['vibemd']
      }
    ],
    extendInfo: {
      CFBundleDocumentTypes: [
        {
          CFBundleTypeName: 'Markdown File',
          CFBundleTypeRole: 'Editor',
          CFBundleTypeExtensions: ['md', 'markdown'],
          CFBundleTypeIconFile: 'icon.icns',
          LSHandlerRank: 'Default'
        },
        {
          CFBundleTypeName: 'VibeMD Document',
          CFBundleTypeRole: 'Editor',
          CFBundleTypeExtensions: ['vibe'],
          CFBundleTypeIconFile: 'icon.icns',
          LSHandlerRank: 'Owner'
        }
      ]
    },
    win32metadata: {
      CompanyName: 'ONLY1 Pty Ltd',
      FileDescription: 'VibeMD - Modern Markdown Editor',
      OriginalFilename: 'VibeMD.exe',
      ProductName: 'VibeMD',
      InternalName: 'VibeMD'
    },
    // macOS code signing and notarization (only if env provided)
    osxSign: macSignConfig,
    osxNotarize:
      process.env.APPLE_ID && process.env.APPLE_APP_SPECIFIC_PASSWORD && process.env.APPLE_TEAM_ID
        ? {
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
            teamId: process.env.APPLE_TEAM_ID,
          }
        : undefined,
  },
  rebuildConfig: {},
  makers: [
    ...(enableWix ? [
    new MakerWix({
      name: 'VibeMD',
      description: 'A modern, cross-platform desktop markdown editor',
      manufacturer: 'ONLY1 Pty Ltd',
      // electron-wix-msi expects `iconPath` for shortcut/installer icon
      iconPath: './build/icons/icon.ico',
      appIconPath: './build/icons/icon.ico',
      language: 1033, // English
      programFilesFolderName: 'VibeMD',
      // Ensure 64-bit installs go to Program Files (not Program Files (x86))
      // and arm64 builds target the correct architecture. We infer from npm_config_arch when provided.
      arch: (process.env.npm_config_arch || process.arch).toLowerCase(),
      // Shortcuts: force Start Menu shortcut; do not create Desktop shortcut
      shortcutName: 'VibeMD',
      shortcutFolderName: 'VibeMD',
      ui: {
        chooseDirectory: true,
        enabled: true
      },
      features: {
        autoUpdate: false,
        autoLaunch: false
      },
      certificateFile: process.env.WINDOWS_CERT_PATH,
      certificatePassword: process.env.WINDOWS_CERT_PASSWORD,
    }),
    ] : []),
    // Enable ZIPs for macOS and Windows (Node 20 + cross-zip >=4)
    new MakerZIP({}, ['darwin', 'win32']),
    // Only add the RPM maker on Linux hosts where its dependencies exist
    ...(enableRpmMaker
      ? [
          new CustomMakerRpm({
            options: {
              name: 'vibemd',
              productName: 'VibeMD',
              bin: 'VibeMD',
              platform: 'linux',
              genericName: 'Markdown Editor',
              description: 'A modern, cross-platform desktop markdown editor',
              icon: './build/icons/icon.svg',
              categories: ['Office'],
              mimeType: ['text/markdown', 'text/x-markdown', 'application/x-vibe']
            }
          })
        ]
      : []),
    new MakerDeb({
      options: {
        name: 'vibemd',
        productName: 'VibeMD',
        bin: 'VibeMD',
        genericName: 'Markdown Editor',
        description: 'A modern, cross-platform desktop markdown editor',
        icon: './build/icons/icon.svg',
        categories: ['Office'],
        mimeType: ['text/markdown', 'text/x-markdown', 'application/x-vibe']
      }
    }),
    new MakerDMG({
      icon: './build/icons/icon.icns',
    }),
  ],
  hooks: {
    async postPackage(_forgeConfig, packageResult) {
      if (packageResult.platform !== 'darwin' || process.platform !== 'darwin') {
        return;
      }
      packageResult.outputPaths.forEach((outputPath) => {
        if (!fs.existsSync(outputPath)) {
          return;
        }
        const stats = fs.statSync(outputPath);
        if (stats.isDirectory() && outputPath.endsWith('.app')) {
          runCodeSign(outputPath);
          return;
        }
        if (!stats.isDirectory()) {
          return;
        }
        const appCandidates = fs
          .readdirSync(outputPath)
          .filter((entry) => entry.endsWith('.app'))
          .map((entry) => path.join(outputPath, entry));
        appCandidates.forEach((appPath) => runCodeSign(appPath));
      });
    },
  },
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy: `default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:; style-src 'self' 'unsafe-inline'`,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/renderer/index.html',
            js: './src/renderer/index.tsx',
            name: 'main_window',
            preload: {
              js: './src/preload/index.ts',
              config: preloadConfig,
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,  // Safe to enable - ICU data is outside ASAR
    }),
  ],
};

export default config;
