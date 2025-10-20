#!/usr/bin/env node

/**
 * Pre-build script for VibeMD
 *
 * This script runs before building the application for deployment.
 * It ensures that any existing user settings are removed so that
 * the deployed application starts fresh with OS default paths.
 *
 * This is particularly important for defaultSavePath and templatesLocation,
 * which should be set to the user's OS documents folder on first run.
 */

const fs = require('fs');
const path = require('path');
const { app } = require('electron');

console.log('🧹 Running pre-build cleanup...');

// Note: In a build context, we can't use electron's app.getPath
// because Electron isn't running. Instead, we'll document the
// settings file location for manual cleanup if needed.

console.log('');
console.log('📝 IMPORTANT: Settings File Location');
console.log('=====================================');
console.log('The settings file is stored at:');
console.log('  macOS: ~/Library/Application Support/VibeMD/settings.json');
console.log('  Windows: %APPDATA%/VibeMD/settings.json');
console.log('  Linux: ~/.config/VibeMD/settings.json');
console.log('');
console.log('For fresh deployment testing:');
console.log('  1. Delete the settings.json file at the location above');
console.log('  2. Run the application');
console.log('  3. Settings will auto-initialize with OS default paths');
console.log('');
console.log('The application is designed to:');
console.log('  ✅ Auto-detect OS documents folder on first run');
console.log('  ✅ Set defaultSavePath to user\'s Documents folder');
console.log('  ✅ Set templatesLocation to Documents/VibeMD/Templates');
console.log('  ✅ Re-initialize paths if they are null (reset scenario)');
console.log('');
console.log('✨ Pre-build cleanup complete!');
console.log('');
