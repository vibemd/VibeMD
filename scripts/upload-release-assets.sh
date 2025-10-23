#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI 'gh' not found. Install from https://cli.github.com/ and run 'gh auth login'." >&2
  exit 1
fi

if [ $# -lt 2 ]; then
  echo "Usage: $0 <version> <file> [file ...]" >&2
  exit 1
fi

VER="$1"; shift
TAG="v${VER}"

echo "Ensuring release $TAG exists..."
if ! gh release view "$TAG" >/dev/null 2>&1; then
  gh release create "$TAG" --title "VibeMD ${VER}" --generate-notes >/dev/null
fi

echo "Uploading assets to $TAG..."
gh release upload "$TAG" "$@" --clobber
echo "Done."

