# VibeMD

 1.0.3 **A modern, cross-platform markdown editor with WYSIWYG editing, LaTeX math support, and seamless native OS integration.**

* * *

## Overview

![Screenshot](https://github.com/vibemd/VibeMD/blob/main/docs/Screenshot.png)

VibeMD is an Electron-based desktop markdown editor that combines the simplicity and portability of markdown with the convenience of rich-text WYSIWYG editing. Built with React, TypeScript, and TipTap, it provides a distraction-free writing environment with real-time formatting, comprehensive markdown support (CommonMark + GFM), and mathematical expression rendering.

**Perfect for:**

-   Technical documentation and software development

-   Academic writing and research papers

-   Note-taking and knowledge management

-   Project proposals and meeting notes

-   Scientific writing with mathematical expressions


* * *

## Download

**[📥 Download the latest release](https://github.com/vibemd/VibeMD/releases/latest)**

### Choose Your Platform

- **macOS Apple Silicon (M1/M2/M3/M4)**: Download `VibeMD-darwin-arm64-*.zip`
- **macOS Intel**: Download `VibeMD-darwin-x64-*.zip`
- **Windows x64**: Download `VibeMD-win32-x64-*.zip` or installer
- **Windows ARM64**: Download `VibeMD-win32-arm64-*.zip` or installer

See all releases: [Releases Page](https://github.com/vibemd/VibeMD/releases)

* * *

## Key Features

### Editor Capabilities

-   **WYSIWYG Editing**: Real-time rich-text editing with the TipTap editor framework
    
-   **Full Markdown Support**: 100% CommonMark compliance + 85% GitHub Flavored Markdown (GFM)
    
-   **Mathematical Expressions**: Complete LaTeX math rendering powered by KaTeX
    
    -   Intuitive formula insertion dialog (ƒ button)
        
    -   Inline math (`<!-- MATH_INLINE_2 -->`) and block math (`<!-- MATH_BLOCK_0 -->`)
        
    -   Real-time LaTeX preview
        
    -   Support for complex formulas, matrices, integrals, and more
        
-   **Syntax Highlighting**: Code blocks with language-specific highlighting
    
-   **Tables**: Full table support with context menu editing
    
-   **Task Lists**: Interactive checkboxes for project management
    
-   **List Management**: Indent/outdent with Tab/Shift+Tab shortcuts
    
-   **Image & Link Support**: Easy insertion with dialog-based UI
    
-   **Text Alignment**: Left/center/right alignment for text and tables
    

### Document Management

-   **Multi-Document Interface**: Work with multiple files simultaneously
    
-   **Auto-Save**: Automatic background saving prevents data loss
    
-   **Automatic Path Initialization**: First-launch auto-detection of OS documents folder
    
    -   Auto-sets default save location to user's Documents folder
        
    -   Auto-configures templates directory
        
    -   Works seamlessly across macOS, Windows, and Linux
        
-   **Template System**: Built-in and custom templates for recurring document types
    
-   **File Organization**: Sidebar with files list and document outline navigation
    

###Native OS Integration

-   **Platform-Native Menus**: macOS, Windows, and Linux menu bars
    
-   **Native File Dialogs**: Open/save dialogs match OS appearance
    
-   **Print Support**: System print dialog integration
    
-   **Window Management**: Native window controls and behaviors
    
-   **Theme Integration**: Automatic system theme detection
    

* * *

## Technology Stack

### Core Framework

-   **Electron 38.2.2**: Cross-platform desktop framework
    
-   **React 19.2.0**: UI component library
    
-   **TypeScript 4.5.4**: Type-safe development
    
-   **Electron Forge 7.10.2**: Build and packaging toolchain
    

### Editor & Markdown

-   **TipTap 3.7.1**: Headless editor framework with extensions
    
-   **Marked 16.4.0**: Markdown parser with GFM support
    
-   **Turndown 7.2.1**: HTML to Markdown converter
    
-   **Remark 15.0.1**: Markdown processor with GFM plugin
    
-   **KaTeX 0.16.25**: Fast LaTeX math typesetting
    

### UI & State Management

-   **Radix UI**: Accessible, unstyled UI primitives
    
-   **Tailwind CSS 3.4.18**: Utility-first CSS framework
    
-   **Zustand 5.0.8**: Lightweight state management
    
-   **Lucide React 0.545.0**: Beautiful icon library
    

* * *

## Installation

### Prerequisites

-   Node.js 16.x or higher
    
-   npm 7.x or higher
    

### Development Setup

1.  **Clone the repository:**
    
    ```bash
    git clone <repository-url>
    cd VibeMD
    ```
    
2.  **Install dependencies:**
    
    ```bash
    npm install
    ```
    
3.  **Start development server:**
    
    ```bash
    npm start
    ```
    

### Building for Production

#### Automated Builds (GitHub Actions)

VibeMD uses GitHub Actions for automated builds. Push a version tag to trigger a release:

```bash
# Update version in package.json, then:
git tag v1.0.1
git push origin v1.0.1
```

This automatically builds for all platforms and creates a GitHub Release.

#### Manual Builds

1.  **Build all platforms:**

    ```bash
    ./build-all.sh
    ```

2.  **Build specific platform:**

    ```bash
    npm run build:mac-arm64    # macOS Apple Silicon
    npm run build:mac-x64      # macOS Intel
    npm run build:win-x64      # Windows x64
    npm run build:win-arm64    # Windows ARM64
    ```


This creates platform-specific distributables in the `out/` directory:

-   **macOS**: `.zip` archives

-   **Windows**: `.zip` archives (portable)

-   **Windows installers**: `.exe` and `.msi` (when built on Windows)


For detailed build instructions, see [docs/BUILD.md](docs/BUILD.md) or [docs/BUILD_GUIDE.md](docs/BUILD_GUIDE.md).

* * *

## Quick Start

### Creating Your First Document

1.  Launch VibeMD
    
2.  Click **New Document** or press `Cmd+N` (`Ctrl+N` on Windows/Linux)
    
3.  Start typing!
    

VibeMD automatically saves your work, so you can focus on writing.

### Using Templates

1.  Click **Use Template** button (or go to Templates tab in sidebar)
    
2.  Select a template (Meeting Notes, Project Proposal, etc.)
    
3.  Click **Use Template**
    
4.  Customize the content
    

### Inserting Math Formulas

1.  Click the **ƒ** (Formula) button in the toolbar
    
2.  Choose **Inline Math** ($...$) or **Block Math** (
    
    
$...$

    
    )
    
3.  Enter your LaTeX formula (e.g., `E = mc^2`)
    
4.  Click **Insert Math**
    

The formula renders immediately in your document!

* * *

## Keyboard Shortcuts

### File Operations

| Action | macOS | Windows/Linux |
| --- | --- | --- |
| New Document | Cmd+N | Ctrl+N |
| Open | Cmd+O | Ctrl+O |
| Save | Cmd+S | Ctrl+S |
| Save As | Cmd+Shift+S | Ctrl+Shift+S |
| Print | Cmd+P | Ctrl+P |

### Text Formatting

| Action | macOS | Windows/Linux |
| --- | --- | --- |
| Bold | Cmd+B | Ctrl+B |
| Italic | Cmd+I | Ctrl+I |
| Underline | Cmd+U | Ctrl+U |

### Editing

| Action | macOS | Windows/Linux |
| --- | --- | --- |
| Undo | Cmd+Z | Ctrl+Z |
| Redo | Cmd+Shift+Z | Ctrl+Shift+Z |

### Lists

| Action | Shortcut |
| --- | --- |
| Indent List Item | Tab |
| Outdent List Item | Shift+Tab |

### Application

| Action | macOS | Windows/Linux |
| --- | --- | --- |
| Settings | Cmd+, | Ctrl+, |
| Quit | Cmd+Q | Ctrl+Q |

For complete keyboard shortcut list, see the User Guide.

* * *

## Documentation

-   [**User Guide**](docs/USER_GUIDE.md): Complete guide to using VibeMD

-   [**Architecture Guide**](docs/ARCHITECTURE_GUIDE.md): Technical architecture and component documentation

-   **Markdown Conformance**: CommonMark, GFM, and LaTeX specification compliance

-   [**Build Instructions**](docs/BUILD.md): Platform-specific build instructions

-   [**Deployment Guide**](docs/DEPLOYMENT_GUIDE.md): Deployment and automatic path initialization
    

* * *

## Project Structure

```
VibeMD/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts            # Main entry point
│   │   ├── window.ts           # Window management
│   │   └── handlers/           # IPC handlers
│   │
│   ├── preload/                # Preload scripts
│   │   └── index.ts            # Context bridge API
│   │
│   ├── renderer/               # React application
│   │   ├── App.tsx             # Root component
│   │   ├── components/         # UI components
│   │   │   ├── dialogs/        # Modal dialogs
│   │   │   ├── editor/         # TipTap editor
│   │   │   ├── layout/         # Layout components
│   │   │   ├── sidebar/        # Sidebar tabs
│   │   │   └── ui/             # Reusable UI primitives
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # Business logic
│   │   ├── stores/             # Zustand state stores
│   │   └── styles/             # Global styles
│   │
│   └── shared/                 # Shared types
│
├── docs/                       # Documentation
├── templates/                  # Built-in templates
├── scripts/                    # Build scripts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── forge.config.ts
```

See [Architecture Guide](docs/ARCHITECTURE_GUIDE.md) for detailed component documentation.

* * *

## Development

### Project Scripts

```bash
npm start              # Start development server
npm run package        # Package for current platform
npm run make           # Build distributables
npm run lint           # Run ESLint
```

### Process Management (macOS/Linux)

```bash
./vibemd.sh start      # Start in background
./vibemd.sh stop       # Stop all instances
./vibemd.sh restart    # Restart application
./vibemd.sh status     # Check running status
./vibemd.sh logs       # View application logs
```

### Adding New Features

1.  **IPC Handlers**: Add to `src/main/handlers/`
    
2.  **Preload API**: Update `src/preload/index.ts`
    
3.  **Type Definitions**: Add to `src/shared/types.ts`
    
4.  **UI Components**: Add to `src/renderer/components/`
    
5.  **State Management**: Update relevant store in `src/renderer/stores/`
    

* * *

## Markdown Support

### CommonMark Compliance: 100%

-   Headings (H1-H6)
    
-   Paragraphs and line breaks
    
-   Emphasis (bold, italic)
    
-   Code (inline and blocks)
    
-   Blockquotes
    
-   Lists (ordered, unordered)
    
-   Links and images
    
-   Horizontal rules
    

### GitHub Flavored Markdown: 85%

-   Tables with full editing
    
-   Strikethrough (`~~text~~`)
    
-   Task lists with interactive checkboxes
    
-   Automatic URL linking
    

### Extended Features

-   Superscript and subscript
    
-   LaTeX mathematical expressions (KaTeX)
    
-   List indentation (Tab/Shift+Tab)
    
-   Text alignment (left/center/right)
    

For complete specification compliance details, see Markdown Conformance.

* * *

## Settings

Access Settings with `Cmd+,` (`Ctrl+,`) or click the Settings button.

### Appearance

-   **Theme**: Light, Dark, or System (auto-matches OS theme)
    
-   **Color Scheme**: Automatic theme-based syntax highlighting
    

### Files

-   **Default Save Path**: Auto-initialized to your Documents folder
    
-   **Templates Location**: Auto-set to `Documents/VibeMD/Templates`
    
-   **Auto-Save**: Automatic background saving (recommended: enabled)
    

### Editor

-   **Font Size**: Adjustable from 10-24pt (default: 12pt)
    
-   **Font Family**: Choose your preferred font
    
-   **Line Numbers**: Show/hide line numbers
    

* * *

## Licensing

**VibeMD** is licensed under the MIT License.

Copyright © 2025 ONLY1 Pty Ltd

See LICENSE file for full details.

### Third-Party Licenses

VibeMD incorporates open-source software. Full license information for all third-party components is available in the About section (Settings → About).

Major components:

-   Electron (MIT)
    
-   React (MIT)
    
-   TipTap (MIT)
    
-   Tailwind CSS (MIT)
    
-   Radix UI (MIT)
    
-   KaTeX (MIT)
    
-   And many others - see application About section for complete list
    

* * *

## Support

For issues, questions, or contributions:

-   **Email**: [hello@vibemd.app](mailto:hello@vibemd.app)
    
-   **Version**: VibeMD v1.0.1
    

* * *

## Acknowledgments

VibeMD is built on the shoulders of giants. Special thanks to:

-   The Electron team for the amazing cross-platform framework
    
-   The TipTap team for the flexible editor framework
    
-   The Radix UI team for accessible UI primitives
    
-   The Tailwind CSS team for the utility-first CSS framework
    
-   The KaTeX team for beautiful mathematical typesetting
    
-   All open-source contributors whose libraries make this project possible
    

* * *

**VibeMD v1.0.2** - Modern Markdown Editing for Everyone

Happy writing! 📝
