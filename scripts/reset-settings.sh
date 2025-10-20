#!/bin/bash

# Reset Settings Script for VibeMD
#
# This script removes the VibeMD settings file to force the application
# to re-initialize with OS default paths on next launch.
#
# Useful for:
# - Testing deployment behavior
# - Resetting to factory defaults
# - Debugging path initialization issues

echo "🧹 VibeMD Settings Reset"
echo "========================"
echo ""

# Detect the operating system
OS="$(uname -s)"

case "${OS}" in
    Darwin*)
        # macOS
        SETTINGS_PATH="$HOME/Library/Application Support/VibeMD/settings.json"
        ;;
    Linux*)
        # Linux
        SETTINGS_PATH="$HOME/.config/VibeMD/settings.json"
        ;;
    CYGWIN*|MINGW*|MSYS*|MINGW32*|MINGW64*)
        # Windows (Git Bash, Cygwin, etc.)
        SETTINGS_PATH="$APPDATA/VibeMD/settings.json"
        ;;
    *)
        echo "❌ Unknown operating system: ${OS}"
        exit 1
        ;;
esac

echo "Settings file location: $SETTINGS_PATH"
echo ""

# Check if settings file exists
if [ -f "$SETTINGS_PATH" ]; then
    echo "✅ Settings file found"
    echo ""
    echo "Current settings:"
    cat "$SETTINGS_PATH" | grep -E "(defaultSavePath|templatesLocation)" || echo "  (unable to parse)"
    echo ""

    read -p "Remove settings file? (y/n): " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm "$SETTINGS_PATH"
        echo "✅ Settings file removed"
        echo ""
        echo "Next time you launch VibeMD:"
        echo "  • Settings will be re-initialized"
        echo "  • Paths will default to OS documents folder"
        echo "  • A fresh settings.json will be created"
    else
        echo "❌ Cancelled - settings file not removed"
    fi
else
    echo "ℹ️  Settings file does not exist"
    echo ""
    echo "VibeMD will auto-initialize settings on first launch:"
    echo "  • defaultSavePath: ~/Documents (or OS equivalent)"
    echo "  • templatesLocation: ~/Documents/VibeMD/Templates"
fi

echo ""
echo "Done!"
