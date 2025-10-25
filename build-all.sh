#!/bin/bash

# VibeMD Universal Build Script
# Builds all platform and architecture combinations
# Requires: Mono + Wine (for Windows installers)

set -e  # Exit on error

echo "======================================"
echo "  VibeMD Universal Build Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v mono &> /dev/null; then
    echo -e "${RED}ERROR: Mono is not installed. Required for Windows builds.${NC}"
    echo "Install with: brew install mono"
    exit 1
fi

if ! command -v wine &> /dev/null; then
    echo -e "${RED}ERROR: Wine is not installed. Required for Windows builds.${NC}"
    echo "Install with: brew install --cask wine-stable"
    exit 1
fi

echo -e "${GREEN}✓ Mono installed: $(mono --version | head -n1)${NC}"
echo -e "${GREEN}✓ Wine installed${NC}"
echo ""

# Clean previous builds
echo -e "${BLUE}Cleaning previous builds...${NC}"
rm -rf out/
echo -e "${GREEN}✓ Clean complete${NC}"
echo ""

# Parse arguments
BUILD_MAC=true
BUILD_WINDOWS=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --mac-only)
            BUILD_WINDOWS=false
            shift
            ;;
        --windows-only)
            BUILD_MAC=false
            shift
            ;;
        --help)
            echo "Usage: ./build-all.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --mac-only        Build macOS only"
            echo "  --windows-only    Build Windows only"
            echo "  --help            Show this help"
            echo ""
            echo "Default: Builds all platforms and architectures"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Build macOS
if [ "$BUILD_MAC" = true ]; then
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}Building macOS...${NC}"
    echo -e "${BLUE}======================================${NC}"

    echo -e "${BLUE}Building macOS Apple Silicon (arm64)...${NC}"
    npm run build:mac-arm64
    echo -e "${GREEN}✓ macOS arm64 build complete${NC}"

    echo -e "${BLUE}Building macOS Intel (x64)...${NC}"
    npm run build:mac-x64
    echo -e "${GREEN}✓ macOS x64 build complete${NC}"
    echo ""
fi

# Build Windows
if [ "$BUILD_WINDOWS" = true ]; then
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}Building Windows...${NC}"
    echo -e "${BLUE}======================================${NC}"

    echo -e "${BLUE}Building Windows x64...${NC}"
    npm run build:win-x64
    echo -e "${GREEN}✓ Windows x64 build complete${NC}"
    echo ""

    echo -e "${BLUE}Building Windows ARM64...${NC}"
    npm run build:win-arm64
    echo -e "${GREEN}✓ Windows ARM64 build complete${NC}"
    echo ""
fi

# Summary
echo -e "${GREEN}======================================"
echo -e "  Build Complete!"
echo -e "======================================${NC}"
echo ""
echo "Build artifacts:"
find out -type f \( -name "*.zip" -o -name "*.exe" -o -name "*.msi" -o -name "*.dmg" \) -exec ls -lh {} \;
echo ""
echo -e "${GREEN}All builds completed successfully!${NC}"
