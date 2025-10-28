# Mobile Strategy (Tablet Experimental Build)

## Objective
- Explore the feasibility of a tablet-only React Native build targeting iPadOS and Android.
- Reuse as much of the existing VibeMD experience as practical while acknowledging desktop-specific constraints.
- Create an experimentation plan that minimises risk to the desktop product and keeps architecture maintainable.

## Desktop Architecture Snapshot
- **Electron main process (`src/main`)** drives lifecycle, file system access, menus, printing, and OS integrations.
- **Preload bridge (`src/preload/index.ts`)** exposes the `window.electronAPI` contract used throughout the renderer.
- **Renderer (`src/renderer`)** is React 19 with Tailwind, Radix UI, and Zustand stores (`stores/`). The WYSIWYG editor uses TipTap + ProseMirror with rich plugin configuration (`components/editor/TipTapEditor.tsx`).
- **Shared logic (`src/shared`, `src/renderer/services`)** contains TypeScript types, markdown conversion helpers (`markdownService`), file orchestration (`fileService`), and application state coordination.
- Build toolchain is Electron Forge + Webpack; styling relies on CSS and the DOM.

## Reuse Potential vs Required Rework
- **Reusable with light adaptation**
  - Zustand stores and general TypeScript models (`Document`, `Settings`, etc.).
  - Markdown conversion utilities (`marked`, `remark` pipeline) provided they do not rely on browser globals—verify each module.
  - Business rules in services that are pure TypeScript (eg template metadata, navigation store logic).
- **Requires significant redesign**
  - Entire UI layer: Tailwind class names, Radix UI primitives, and DOM-centric patterns do not map to React Native components.
  - TipTap editor stack: relies on ProseMirror DOM APIs; no native bindings exist for React Native.
  - Electron-specific surface area exposed via `window.electronAPI` (file dialogs, printing, OS menus, window management).
  - Keyboard shortcut handling and menu wiring (`useKeyboardShortcuts`, `menuService`) require native equivalents.
- **Desktop-only concerns to isolate**
  - Installer scripts, build packaging, and update flows in `scripts/` and `.github/workflows/`.
  - Squirrel auto-update, Windows ICU bootstrapping, and platform-specific assets.

## Key Risks Moving to React Native
| Area | Desktop Dependency | Tablet Risk | Mitigation Ideas |
| --- | --- | --- | --- |
| Editing Engine | TipTap + ProseMirror DOM | No supported RN renderer; major rewrite | Evaluate rich text via WebView wrapper (hosting existing web editor), or adopt a native markdown editor (eg `react-native-markdown-editor`, `remirror` via web) and align UX expectations. |
| Styling & Layout | Tailwind CSS, direct `<div>` markup | RN style objects; no CSS cascade | Adopt `nativewind` or `tamagui` for utility styles; rebuild layout with Flexbox components. |
| UI Components | Radix UI, shadcn patterns | Components unavailable on RN | Choose a tablet-friendly RN UI kit (eg `react-native-paper`, `gluestack`) or build custom primitives. |
| File Access | Electron dialogs, unrestricted FS | Mobile sandbox, permissions, limited path access | Use `expo-document-picker` / `react-native-document-picker` for Open/Save, `expo-file-system` or `react-native-fs` for storage, and OS share sheets for export. |
| Settings Storage | JSON file in `~/Documents/VibeMD` | No direct filesystem, sandbox rules | Migrate to `AsyncStorage`, MMKV, or SQLite; design migration for shared preferences if synchronization is needed. |
| Templates Directory | Arbitrary folder location | Need managed storage + import/export | Store templates in app sandbox; provide import/export workflow via pickers. |
| Print & Export | Native print dialog via IPC | iOS/Android print flows differ | Leverage `expo-print`/`react-native-print` or export to PDF and trigger share/print intents. |
| Keyboard & Shortcuts | Desktop-centric commands | External keyboards only; OS-level limitations | Support hardware keyboard via `react-native-keyevent` (Android) and `expo-keyboard`; design fallback touch gestures. |
| Build Toolchain | Electron Forge + Webpack | Needs Metro, native SDKs | Maintain separate mobile workspace with Metro config; consider monorepo tooling (Nx/Turbo). |

## Environment & Tooling Prerequisites
- Node.js LTS (matching repo policy) and npm or pnpm.
- Watchman (`brew install watchman`) for fast refresh on macOS.
- Xcode with latest iOS SDK + command line tools; ensure Apple developer account for device deployment.
- CocoaPods (`sudo gem install cocoapods`) for iOS dependency management.
- Android Studio with SDK Platform 34+, Android Emulator, and a configured `ANDROID_HOME`.
- Java JDK 17 (Temurin or Zulu distribution) for Android builds.
- Optional: Expo CLI (`npx expo install`) if adopting Expo-managed workflow for rapid iteration.

## React Native Workspace Setup
1. **Create dedicated app package**: scaffold `apps/mobile` via `npx create-expo-app VibeMDMobile --template expo-template-blank-typescript` or `npx react-native init VibeMDMobile --template react-native-template-typescript`.
2. **Adopt monorepo tooling**: use pnpm workspaces or Nx to share `src/shared` types and pure logic. Add path aliases in `tsconfig.json` and `metro.config.js` to point at shared code.
3. **State management**: reuse Zustand stores where possible; refactor any direct Electron calls into dependency-injected services so mobile can supply native implementations.
4. **Styling system**: choose `nativewind` (Tailwind-like) or `tamagui` for consistent theming. Document design tokens to mirror desktop appearance.
5. **Navigation**: integrate `@react-navigation/native` with a split-pane tablet layout (Drawer + Stack) to emulate sidebar + editor arrangement.
6. **Filesystem & persistence**: install `expo-file-system`, `expo-document-picker`, `expo-sharing` (Expo) or `react-native-fs`, `react-native-document-picker`, `react-native-share` (bare). Wrap them behind a `mobileFileService` mirroring `fileService` contracts.
7. **Markdown rendering/editing**:
   - Short term: embed existing web editor in a `WebView` (`react-native-webview`) and bridge markdown content over postMessage while exploring native options.
   - Long term: evaluate native editing stacks (`@mattermost/react-native-markdown-editor`, `react-native-zss-rich-text-editor`) or build a custom markdown editor with syntax highlighting via `@shopify/react-native-skia` + AST transforms.
8. **Icons & UI primitives**: replace `lucide-react` with `lucide-react-native` and adopt React Native component analogues for dialogs, menus, and toolbars.
9. **Localization & theming**: port existing theme logic to RN context providers; ensure dark mode respects OS appearance APIs.

## Experimental Implementation Phases
1. **Foundation**
   - Stand up the RN project, share TypeScript models, and configure linting/testing parity.
   - Build placeholder screens for sidebar, editor, and toolbar using static data.
2. **Data & Services**
   - Port Zustand stores, decoupling Electron-specific logic behind interfaces.
   - Introduce mobile-specific file and settings services backed by native modules.
3. **Editor Prototype**
   - Prototype the WebView-based editor bridge to re-use the TipTap experience quickly.
   - Define events for loading markdown, syncing changes, exporting HTML/Markdown, and handling formatting commands.
4. **Tablet UX Enhancements**
   - Implement split-view layout, drag-and-drop hooks (`react-native-draganddrop`, iPad multitasking), and gesture support.
   - Add hardware keyboard shortcuts and stylus (Apple Pencil/S Pen) interactions where feasible.
5. **Device Integration**
   - Wire up import/export (Files app, Google Drive), print/share, and notifications for autosave/status.
   - Validate offline storage, autosave intervals, and template management within sandbox rules.
6. **Testing & CI**
   - Add Jest + React Native Testing Library for unit/snapshot tests.
   - Configure Detox or Maestro for basic end-to-end flows on tablet simulators.
   - Extend GitHub Actions with a mobile job (`macos-latest`) running `expo-doctor`, `npm run test`, and optional build steps (`eas build` or `gradle assembleRelease`).

## Additional Considerations
- **Versioning & releases**: keep mobile experimental work on a guarded branch (eg `feature/mobile-rnd`) until architecture stabilises. Use feature flags to share business logic without impacting desktop builds.
- **Shared packages**: if significant shared logic emerges (markdown parsers, settings schemas), promote them into a `packages/` workspace to avoid circular imports.
- **Performance monitoring**: plan for profiling tools (`Flipper`, Xcode Instruments, Android Profiler) early, especially if embedding WebView for editing.
- **Security & privacy**: document how documents and templates are stored on-device, and update the privacy policy for mobile distribution.
- **Release targets**: for experimentation, opt into TestFlight (iPad) and Internal App Sharing (Android) before considering App Store or Play Store compliance work.

## Next Steps
- Validate markdown and template services for DOM-free execution; refactor as needed.
- Spike the WebView editor bridge to gauge complexity versus a full native editor rewrite.
- Draft design mocks for tablet layout to guide component rebuild workstreams.
- Decide on Expo vs bare workflow based on native module requirements and long-term maintenance preferences.
