# VibeMD Installation — Resolving Security Warnings

**Application:** VibeMD
**Version:** 1.0.16
**Release Date:** 2025-10-28
**License:** MIT © 2025 ONLY1 Pty Ltd

---

## Overview

VibeMD installers and packages are currently **unsigned**. This means operating systems (Windows, macOS, Linux) cannot cryptographically verify the publisher and will display security warnings during installation.

**⚠️ Important:** These warnings are **expected and normal**. VibeMD is:
- ✅ **Safe** — Free of malware, spyware, and tracking
- ✅ **Open Source** — Full source code available for inspection at https://github.com/vibemd/VibeMD
- ✅ **Non-invasive** — Does not collect, transmit, or analyze user data
- ✅ **Offline-first** — All documents stored locally on your computer

**Code signing is planned for a future release** when certificates become available. For now, follow the instructions below to safely bypass these warnings.

---

## Windows Installation

### Windows 11 / Windows 10

#### MSI Installer

1. **Download** `VibeMD-1.0.16-x64.msi` or `VibeMD-1.0.16-arm64.msi`

2. **Double-click** the MSI file

3. **SmartScreen Warning Appears:**
   ```
   "Windows Defender SmartScreen has blocked an unrecognized app"
   ```

4. **Click "More info":**
   ![Windows SmartScreen - More info button](/site/images/windows-smartscreen-1.png)

5. **Click "Run anyway":**
   ![Windows SmartScreen - Run anyway button](/site/images/windows-smartscreen-2.png)

6. **Installer Launches** — Follow the on-screen prompts

7. **Click "Install"** and choose your installation folder

8. **Finish** and launch from Start Menu

#### ZIP Portable (No Installation)

1. **Download** `VibeMD-win32-x64-1.0.16.zip` or `VibeMD-win32-arm64-1.0.16.zip`

2. **Extract** the ZIP file to a folder (e.g., `C:\VibeMD\`)

3. **Double-click** `VibeMD.exe`

4. **If SmartScreen warns again:**
   - Click "More info" → "Run anyway"
   - This only happens on first run

5. **App launches** — No installation required, portable across USB drives

### Verification

To verify you downloaded the correct version:

1. Open PowerShell
2. Navigate to the download folder
3. Verify the SHA256 checksum:
   ```powershell
   Get-FileHash VibeMD-1.0.16-x64.msi -Algorithm SHA256
   ```
4. Compare with the checksum in the release notes

---

## macOS Installation

### macOS 10.15+ (Intel & Apple Silicon)

#### DMG Disk Image (Recommended)

1. **Download** `VibeMD-1.0.16-x64.dmg` (Intel) or `VibeMD-1.0.16-arm64.dmg` (Apple Silicon)

2. **Double-click** the DMG file to mount it

3. **Drag VibeMD to Applications folder:**
   ![macOS DMG Installation](/site/images/macos-dmg-drag.png)

4. **Eject the DMG** by clicking the eject icon in Finder

5. **Open Applications folder** in Finder

6. **Right-click (Control-click) VibeMD.app** → **"Open":**
   ![macOS Control-click Open](/site/images/macos-control-click.png)

7. **"Cannot verify developer" warning appears:**
   ```
   "VibeMD" cannot be opened because Apple cannot check it
   for malicious software.
   ```

8. **Click "Open"** to bypass Gatekeeper:
   ![macOS Cannot verify](/site/images/macos-cannot-verify.png)

9. **App launches** — This only prompts on first run

#### ZIP Portable

1. **Download** `VibeMD-darwin-x64-1.0.16.zip` (Intel) or `VibeMD-darwin-arm64-1.0.16.zip` (Apple Silicon)

2. **Double-click** to extract

3. **Right-click extracted `VibeMD.app`** → **"Open"**

4. **Follow steps 7-9 above**

### Permanent Allow (Optional)

To avoid the warning on every launch:

1. **Open System Preferences** → **Privacy & Security**

2. **Scroll to "VibeMD was blocked"** section

3. **Click "Open Anyway"**

4. **Next launch:** No warning appears

### Verification

To verify your download:

```bash
cd Downloads
shasum -a 256 VibeMD-1.0.16-x64.dmg
# Compare output with checksum in release notes
```

---

## Linux Installation

### Ubuntu / Debian-based Systems

#### DEB Package (Recommended)

1. **Download** `vibemd_1.0.16_amd64.deb`

2. **Install via terminal:**
   ```bash
   sudo dpkg -i vibemd_1.0.16_amd64.deb
   ```

3. **If package is unsigned, confirm installation:**
   ```
   [prompt to confirm unsigned package]
   # Press 'y' to continue
   ```

4. **Launch from Applications menu** or terminal:
   ```bash
   vibemd
   ```

#### Via GNOME Software (GUI)

1. **Download** `vibemd_1.0.16_amd64.deb`

2. **Open with GNOME Software:**
   - Right-click the file → "Open With" → "Software"
   - Or drag the file into GNOME Software

3. **Click "Install"**

4. **Enter your password** when prompted

5. **Launch from Applications**

### Fedora / RHEL / CentOS

#### RPM Package

1. **Download** `vibemd-1.0.16-1.x86_64.rpm`

2. **Install via terminal:**
   ```bash
   sudo rpm -i vibemd-1.0.16-1.x86_64.rpm
   ```

3. **If unsigned, the package manager may warn:**
   ```
   warning: vibemd-1.0.16-1.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID...: NOKEY
   ```
   This is normal for unsigned packages.

4. **Launch:**
   ```bash
   vibemd
   ```

#### Via GNOME Software (GUI)

1. **Open GNOME Software**

2. **Search for "VibeMD"** or open the RPM file

3. **Click "Install"**

4. **Enter password if prompted**

5. **Launch from Applications**

### Arch Linux (AUR)

Community-maintained AUR packages may be available:

```bash
# If available in AUR
yay -S vibemd
```

### Verification

```bash
sha256sum vibemd_1.0.16_amd64.deb
# Compare with release notes checksum
```

---

## Why These Warnings Exist

### Windows SmartScreen

- Checks apps against a database of known safe software
- VibeMD is new and unsigned, so it's flagged as "unrecognized"
- Clicking "Run anyway" is safe for open-source, verified software

### macOS Gatekeeper

- Enforces code signing for apps from the internet
- Prevents malware distribution through the App Store
- Users can bypass by Control-clicking and choosing "Open"
- Or by allowing in Privacy & Security settings

### Linux Package Signatures

- Package managers verify cryptographic signatures
- VibeMD packages are unsigned (signature coming in future)
- Most package managers allow unsigned package installation
- Users should verify checksums independently

---

## Reporting Security Issues

If you discover a security vulnerability in VibeMD:

1. **Do NOT** open a public GitHub issue
2. **Email** security@vibemd.app with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Proposed fix (if available)
3. We will respond within 48 hours

---

## FAQ

**Q: Is it safe to bypass these warnings?**
A: Yes, for VibeMD. The app is open-source and free of malware. Verify by checking the source code at https://github.com/vibemd/VibeMD

**Q: When will VibeMD be signed?**
A: Code signing is planned for the next major release when certificates are obtained. Follow GitHub releases for updates.

**Q: Can I verify the download is authentic?**
A: Yes! Compare the SHA256 checksum:
- Windows: Use PowerShell `Get-FileHash`
- macOS: Use terminal `shasum -a 256`
- Linux: Use terminal `sha256sum`

**Q: Does VibeMD collect my data?**
A: No. VibeMD is offline-first and stores all documents locally. No telemetry, tracking, or data transmission occurs.

**Q: Can I uninstall VibeMD safely?**
A: Yes. Use your OS's standard uninstall process:
- Windows: Control Panel → Programs → Uninstall
- macOS: Drag from Applications to Trash
- Linux: `sudo apt remove vibemd` or package manager

---

## Getting Help

- **Installation Issues:** [GitHub Issues](https://github.com/vibemd/VibeMD/issues)
- **Security Questions:** security@vibemd.app
- **General Support:** hello@vibemd.app

---

**VibeMD is developed and maintained by ONLY1 Pty Ltd.**
**License:** MIT © 2025 ONLY1 Pty Ltd
