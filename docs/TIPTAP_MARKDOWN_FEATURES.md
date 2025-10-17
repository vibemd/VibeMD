# Tiptap Markdown Support Overview

Tiptap's Markdown extension is CommonMark-compliant and provides bidirectional support for parsing Markdown strings into Tiptap's JSON format and serializing editor content back to Markdown. The extension integrates MarkedJS as its parser and supports custom tokenizers for extending Markdown syntax.

## Core/Included Extensions (via StarterKit)

### CommonMark Compliant Features

| Feature | Extension | Markdown Syntax | Compliance |
|---------|-----------|-----------------|-----------|
| Headings (H1-H6) | Heading | `# Heading` | CommonMark |
| Bold text | Bold | `**bold**` | CommonMark |
| Italic text | Italic | `*italic*` | CommonMark |
| Inline code | Code | `` `code` `` | CommonMark |
| Code blocks | CodeBlock | ` ``` ` fenced | CommonMark |
| Paragraphs | Paragraph | Plain text | CommonMark |
| Hard line breaks | HardBreak | Two spaces + newline | CommonMark |
| Bullet lists | BulletList | `- item` | CommonMark |
| Ordered lists | OrderedList | `1. item` | CommonMark |
| List items | ListItem | (part of lists) | CommonMark |
| Blockquotes | Blockquote | `> quote` | CommonMark |
| Horizontal rules | HorizontalRule | `---` or `***` | CommonMark |
| Links | Link | `[text](url)` | CommonMark |
| Images | Image | `![alt](src)` | CommonMark |

### GitHub Flavored Markdown (GFM) Features

| Feature | Extension | Markdown Syntax | Compliance |
|---------|-----------|-----------------|-----------|
| Strikethrough | Strike | `~~text~~` | GFM |
| Tables | Table + TableRow + TableCell + TableHeader | Pipe syntax `\|` | GFM |
| Task lists | TaskList + TaskItem | `- [ ] item` | GFM |

## Additional Open Source Extensions (Non-Paid)

### Text Formatting (Non-Standard)

| Feature | Extension | Notes |
|---------|-----------|-------|
| Underline | Underline | `<u>text</u>` in HTML |
| Subscript | Subscript | `~subscript~` (custom) |
| Superscript | Superscript | `^superscript^` (custom) |
| Text color | Color | Custom syntax |
| Background color | BackgroundColor | Custom syntax |
| Text alignment | TextAlign | Custom syntax |

### Content Nodes

| Feature | Extension | Markdown Support | Notes |
|---------|-----------|-----------------|-------|
| YouTube embeds | Youtube | Custom syntax | `!youtube[id]` (configurable) |
| Details/Collapsible | Details + DetailsSummary + DetailsContent | Limited | `<details>` HTML elements |
| Mentions | Mention | Limited | Custom tokenizer support |
| Mathematics | Mathematics | Limited | LaTeX formulas via custom syntax |
| Emoji | Emoji | Limited | Custom emoji syntax |

### Functional Extensions (Markdown-Relevant)

| Feature | Extension | Impact on Markdown |
|---------|-----------|-------------------|
| Undo/Redo | UndoRedo | Affects editing, preserved in serialization |
| List Keymap | ListKeymap | Improves list behavior |
| Syntax Highlighting | CodeBlockLowlight | Visual only, doesn't affect markdown |
| Placeholder | Placeholder | UI only |
| Trailing Node | TrailingNode | Ensures valid document structure |
| Gapcursor | Gapcursor | Improves cursor positioning |
| Dropcursor | Dropcursor | Visual feedback only |

## Configuration & Options

The Markdown extension accepts configuration options including:

- **Indentation style** - spaces or tabs
- **Indentation size** - number of spaces or tabs per level
- **MarkedJS options**:
  - GFM mode (enable/disable GitHub Flavored Markdown)
  - Breaks (convert `\n` to `<br>`)
  - Pedantic mode (strict Markdown compliance)
  - Smartypants (smart quotes and dashes)

## Limitations

Current limitations include:

- **Comments** - Not supported yet
- **Multiple child nodes in tables** - Markdown tables support only one child node per cell

## Standards Compliance Summary

- **100% CommonMark** - All basic markdown features from the CommonMark spec
- **GFM Support** - Tables, task lists, and strikethrough (configurable via MarkedJS options)
- **Non-standard Extensions** - Subscript, superscript, underline, and color features require custom markdown syntax definitions

## Extensibility

The architecture is extensible, allowing developers to define custom Markdown syntax handlers for any extension through:

- `createBlockMarkdownSpec` - For creating custom block-level markdown syntax
- `createInlineMarkdownSpec` - For creating custom inline markdown syntax

Each extension can define its own parsing and rendering logic for markdown representation.
