# Windows Build Testing Guide

## Build Location

The Windows x64 build is ready at:
```
/Users/cameron/Projects/VibeMD/out/VibeMD-win32-x64/
```

Build size: **302 MB**

## Required Files Checklist

✅ VibeMD.exe (201 MB) - Main executable
✅ icudtl.dat (10 MB) - ICU data file
✅ locales/ (55 files) - Locale .pak files
✅ resources/app.asar (3.2 MB) - Bundled app
✅ All .dll and .pak files

## Transfer to Windows

### Option 1: USB Drive
```bash
# From macOS
cp -r out/VibeMD-win32-x64 /Volumes/YOUR_USB_DRIVE/
```

### Option 2: Network Transfer (if you have SSH access to Windows)
```bash
# From macOS
scp -r out/VibeMD-win32-x64 user@windows-pc:/path/to/destination/
```

### Option 3: Create ZIP archive
```bash
# From macOS
cd out
zip -r VibeMD-win32-x64.zip VibeMD-win32-x64/
# Then transfer the zip file (will be ~120-150 MB compressed)
```

## Testing on Windows

### Method 1: Using PowerShell Test Script

1. Copy `test-windows-build.ps1` to the `VibeMD-win32-x64` folder
2. Open PowerShell
3. Navigate to the folder:
   ```powershell
   cd C:\path\to\VibeMD-win32-x64
   ```
4. Run the test script:
   ```powershell
   .\test-windows-build.ps1
   ```

### Method 2: Manual Testing

1. Open PowerShell or Command Prompt
2. Navigate to the build folder:
   ```powershell
   cd C:\path\to\VibeMD-win32-x64
   ```
3. Run with error logging:
   ```powershell
   .\VibeMD.exe 2> errors.txt
   ```
4. Wait 5-10 seconds, then check `errors.txt`:
   ```powershell
   type errors.txt
   ```

### Method 3: Check Console Output

1. Double-click `VibeMD.exe`
2. Open Developer Tools: Press `F12` or `Ctrl+Shift+I`
3. Go to the Console tab
4. Look for ICU messages

## Expected Console Output (Success)

You should see these messages in the console:

```
[ICU] Pre-Electron ICU configuration for Windows x64
[ICU] Process executable: C:\...\VibeMD-win32-x64\VibeMD.exe
[ICU] Executable directory: C:\...\VibeMD-win32-x64
[ICU] Expected ICU data path: C:\...\VibeMD-win32-x64\icudtl.dat
[ICU] ✓ ICU data file found: C:\...\VibeMD-win32-x64\icudtl.dat
[ICU] ✓ File size: 10467680 bytes
[ICU] ✓ Set ICU_DATA_FILE environment variable
[ICU] ✓ Set command line switch icu-data-dir: C:\...\VibeMD-win32-x64
```

## Expected Behavior (Success)

✅ Application launches without errors
✅ No "Invalid file descriptor to ICU data received" error
✅ All text displays correctly
✅ Internationalization features work
✅ Application runs smoothly

## If You Still See the ICU Error

If you see:
```
[ERROR:base\i18n\icu_util.cc:223] Invalid file descriptor to ICU data received
```

**Debug steps:**

1. **Check files are present:**
   ```powershell
   dir icudtl.dat
   dir locales
   ```

2. **Check file sizes:**
   - icudtl.dat should be exactly 10,467,680 bytes
   - locales folder should have 55 .pak files

3. **Check what the app sees:**
   - Open Developer Tools (F12)
   - Check console for the `[ICU]` messages
   - Look for which paths it's searching

4. **Check permissions:**
   - Make sure the folder isn't on a network drive
   - Make sure antivirus isn't blocking file access
   - Try running as Administrator

5. **Capture full error log:**
   ```powershell
   .\VibeMD.exe 2>&1 | Out-File -FilePath full-log.txt
   ```
   Then send me the `full-log.txt` file

## What Changed in This Build

1. **Fixed ignore patterns** in forge.config.ts - Now allows Electron resources
2. **Improved ICU initialization** in src/main/index.ts - Sets paths before Electron loads
3. **Added locales folder** - Critical for ICU to work properly (was missing before)
4. **Proper file structure** - All Electron resources in correct locations

## Build Information

- Electron version: 38.2.2
- Platform: win32
- Architecture: x64
- Build date: 2025-10-21
- Node version: (check with `node --version`)

## Next Steps After Testing

If the build works:
1. Test file associations (.md, .markdown, .vibe files)
2. Test all application features
3. Test on a clean Windows machine (no dev tools)
4. Consider creating installer with `npm run make`

If the build doesn't work:
1. Capture all error logs
2. Check console output in Developer Tools
3. Verify all files are present and not corrupted
4. Report back with specific error messages
