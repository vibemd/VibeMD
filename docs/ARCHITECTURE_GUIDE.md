# Architecture Guide

**Application:** VibeMD  
**Version:** 1.0.9  
**Updated:** 2025-10-23

## Overview

VibeMD is an Electron application using the Electron Forge + Webpack toolchain. The renderer is built with React and Tailwind CSS, while the editor experience relies on Tiptap.

## Key Components

- **Electron Main Process** (`src/main`): boots the app, coordinates native integrations, and exposes APIs to the renderer through preload bindings.
- **Preload Layer** (`src/preload`): bridges secure, typed IPC channels between the renderer and main processes.
- **Renderer** (`src/renderer`): React-based UI with modular stores (Zustand) and rich Markdown editing features.
- **Build Pipeline** (`webpack.*.config.ts` + `forge.config.ts`): Webpack handles bundling, Forge manages packaging for each target platform.

## State Management

- Uses Zustand stores for document state, preferences, and cross-window communication.
- IPC communication is wrapped in typed helpers to keep the renderer sandboxed.

## File & Template Handling

- Templates live under `templates/` and are bundled at build time.
- Documents are saved through the main process using native dialogs to ensure correct permissions.

## Extensibility

- Add new renderer features by extending the Tiptap configuration in `src/renderer/editor`.
- Native integrations should expose explicit IPC channels and be registered in the preload layer to maintain security boundaries.

## Build Outputs

- Artifacts are produced via Electron Forge makers defined in `forge.config.ts`.
- Platform-specific installers bundle compiled assets from `.webpack/`.
- Smoke tests run on every build to ensure renderer and preload bundles compile and lint cleanly.
