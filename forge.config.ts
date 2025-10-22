import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerWix } from '@electron-forge/maker-wix';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
import { preloadConfig } from './webpack.preload.config';

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
    }
  },
  rebuildConfig: {},
  makers: [
    new MakerWix({
      name: 'VibeMD',
      description: 'A modern, cross-platform desktop markdown editor',
      manufacturer: 'ONLY1 Pty Ltd',
      version: '1.0.1',
      appIconPath: './build/icons/icon.ico',
      language: 1033, // English
      ui: {
        chooseDirectory: true,
        enabled: true
      },
      features: {
        autoUpdate: false,
        autoLaunch: false
      }
    }),
    new MakerZIP({}, ['darwin', 'win32']),
    new MakerRpm({
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
  ],
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
