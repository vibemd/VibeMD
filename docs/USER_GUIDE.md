# User Guide

**Application:** VibeMD (A cross-platform desktop markdown editor with WYSIWYG editing, template system, and native OS integration)  
**Version:** 1.0.13  
**Updated:** 2025-10-28

## Installation

- **Windows:** Download the MSI or ZIP package from the releases page. As the installer is unsigned, Windows SmartScreen will prompt for confirmation—choose “More info” then “Run anyway”.
- **macOS:** Download the DMG or ZIP. Control-click to open unsigned apps if Gatekeeper warns you.
- **Linux:** Choose the DEB or RPM package for your distribution. Some distributions require confirming the unsigned package before installing.

## Quick Start

1. Launch VibeMD.
2. Create or open a markdown document from the home screen.
3. Use the WYSIWYG editor or switch to code view for raw markdown.
4. Save documents locally or export to PDF/HTML via the File menu.

## Key Features

- Dual-pane WYSIWYG and markdown editing
- Template management with live previews
- Math, table, and diagram support powered by Tiptap extensions
- System tray integration with recent document shortcuts
- Automatic update checks (manual install required while builds remain unsigned)

## Troubleshooting

- Use `Help → Toggle Developer Tools` to inspect console output.
- Run `npm run lint` locally to catch common issues before reporting bugs.
- File detailed issues with logs at [GitHub Issues](https://github.com/ONLY1-Group/VibeMD/issues).
