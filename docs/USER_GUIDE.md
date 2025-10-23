# VibeMD User Guide

**Version:** 1.0.8
**Date:** October 20, 2025

Welcome to VibeMD, a modern markdown editor that combines the simplicity of markdown with the convenience of WYSIWYG (What You See Is What You Get) editing. This guide will help you get the most out of VibeMD.

## Table of Contents

1. [Getting Started](#getting-started)
2. [The VibeMD Interface](#the-vibemd-interface)
3. [Working with Documents](#working-with-documents)
4. [Formatting Text](#formatting-text)
5. [Working with Lists](#working-with-lists)
6. [Tables](#tables)
7. [Mathematical Expressions](#mathematical-expressions)
8. [Images and Links](#images-and-links)
9. [Templates](#templates)
10. [Settings and Customization](#settings-and-customization)
11. [Keyboard Shortcuts](#keyboard-shortcuts)
12. [Tips and Tricks](#tips-and-tricks)
13. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Launch

When you first launch VibeMD, the application automatically configures itself for your operating system:

- **Default Save Location**: Set to your Documents folder
- **Templates Location**: Set to Documents/VibeMD/Templates
- **Theme**: Matches your system theme (light or dark)

You can change these settings at any time from **Settings** (⌘+, on macOS or Ctrl+, on Windows/Linux).

### Creating Your First Document

1. Launch VibeMD
2. Click **New Document** or press ⌘+N (Ctrl+N on Windows/Linux)
3. Start typing!

VibeMD automatically saves your work as you type, so you never have to worry about losing your content.

---

## The VibeMD Interface

### Main Components

**Toolbar** (top of window)
- File operations: New, Open, Save, Print
- Formatting buttons: Bold, Italic, Strikethrough, etc.
- Content buttons: Insert tables, images, links, formulas
- Settings button

**Editor** (center)
- Main writing area with WYSIWYG editing
- Real-time markdown rendering
- Syntax highlighting for code blocks

**Sidebar** (left, collapsible)
- **Files Tab**: List of open documents
- **Outline Tab**: Navigate document headings
- **Templates Tab**: Browse and use templates

### Theme Support

VibeMD supports three theme modes:
- **Light**: Clean, bright interface
- **Dark**: Easy on the eyes in low-light conditions
- **System**: Automatically matches your OS theme

Change themes in **Settings → Appearance → Theme**.

---

## Working with Documents

### Creating Documents

**New Document**
- Click **New Document** button or press ⌘+N (Ctrl+N)
- Document appears in sidebar with default title "Untitled"
- Start typing immediately

**From Template**
- Click **Use Template** button (when no documents open)
- Or switch to **Templates** tab in sidebar
- Click **Use Template** on desired template

### Opening Documents

**Open Existing File**
- Click **Open** button or press ⌘+O (Ctrl+O)
- Navigate to your markdown file (.md or .vibe)
- File opens in editor with full formatting

**Multiple Documents**
- Open multiple files simultaneously
- Switch between documents using sidebar Files tab
- Each document maintains its own undo/redo history

### Saving Documents

**Auto-Save** (Recommended)
- Enabled by default in Settings
- Automatically saves changes every few seconds
- No need to manually save

**Manual Save**
- Press ⌘+S (Ctrl+S) to save current document
- If not yet saved, prompts for file location
- Saves to your default save path

**Save As**
- Press ⌘+Shift+S (Ctrl+Shift+S)
- Save document with new name or location
- Original file remains unchanged

### Printing Documents

**Print**
- Click **Print** button or press ⌘+P (Ctrl+P)
- System print dialog appears
- Choose printer and options
- Print preview shows formatted document

---

## Formatting Text

VibeMD provides comprehensive text formatting through both toolbar buttons and markdown syntax.

### Basic Formatting

**Bold Text**
- Toolbar: Click **B** button
- Keyboard: ⌘+B (Ctrl+B)
- Markdown: `**bold text**` or `__bold text__`

**Italic Text**
- Toolbar: Click **I** button
- Keyboard: ⌘+I (Ctrl+I)
- Markdown: `*italic text*` or `_italic text_`

**Strikethrough**
- Toolbar: Click **S̶** button
- Markdown: `~~strikethrough text~~`

**Inline Code**
- Toolbar: Click **</>** button
- Markdown: `` `code` ``

**Superscript**
- Toolbar: Click **x²** button
- Markdown: `x^2`
- Example: E = mc²

**Subscript**
- Toolbar: Click **x₂** button
- Markdown: `H_2O`
- Example: H₂O

### Headings

**Using Toolbar**
- Click **Heading** dropdown
- Select level (H1 through H6) or "Normal text"

**Using Markdown**
```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

**Tips:**
- H1 is largest, typically for document title
- H2-H3 for main sections
- H4-H6 for subsections
- Headings appear in Outline tab for easy navigation

### Text Alignment

**Align Left** (default)
- Toolbar: Click left-align button
- Default for most text

**Align Center**
- Toolbar: Click center-align button
- Good for titles and special sections

**Align Right**
- Toolbar: Click right-align button
- Use sparingly for visual effect

**Note:** Alignment also works for tables and images.

### Blockquotes

**Create Quote**
- Toolbar: Click **"** button
- Markdown: `> This is a quote`

**Nested Quotes**
```markdown
> First level quote
>> Nested quote
>>> Deeply nested quote
```

### Horizontal Rules

**Insert Line**
- Toolbar: Click **—** button
- Markdown: `---` or `***` or `___`

Use horizontal rules to separate sections visually.

---

## Working with Lists

### Bullet Lists (Unordered)

**Create List**
- Toolbar: Click bullet list button
- Markdown: `- Item` or `* Item`

**Example:**
```markdown
- First item
- Second item
- Third item
```

### Numbered Lists (Ordered)

**Create List**
- Toolbar: Click numbered list button
- Markdown: `1. Item`

**Example:**
```markdown
1. First item
2. Second item
3. Third item
```

**Note:** Numbers auto-increment; you can use `1.` for all items.

### Task Lists

**Create Task List**
- Toolbar: Click checkbox list button
- Markdown: `- [ ] Task` (unchecked) or `- [x] Task` (checked)

**Example:**
```markdown
- [x] Completed task
- [ ] Pending task
- [ ] Another pending task
```

**Interactive Checkboxes:**
- Click checkboxes in editor to toggle completion
- Perfect for to-do lists and project tracking

### Nested Lists

**Indent/Outdent**
- **Tab**: Indent list item (make it a sub-item)
- **Shift+Tab**: Outdent list item (move it up a level)
- **Toolbar**: Use Indent/Outdent buttons

**Example:**
```markdown
- Main item
  - Sub-item
    - Sub-sub-item
  - Another sub-item
- Another main item
```

**Works with all list types:**
- Bullet lists
- Numbered lists
- Task lists
- Mix and match!

---

## Tables

### Creating Tables

**Insert Table**
- Toolbar: Click **table** button
- Default: 3 rows × 3 columns
- Table appears in editor

### Editing Tables

**Add Content**
- Click any cell to start typing
- Tab to move to next cell
- Shift+Tab to move to previous cell

**Right-Click Menu**
- Right-click any cell for context menu
- Add/delete rows above or below
- Add/delete columns left or right
- Delete entire table

**Table Options:**
- **Add Column Before**: Insert column to the left
- **Add Column After**: Insert column to the right
- **Delete Column**: Remove current column
- **Add Row Before**: Insert row above
- **Add Row After**: Insert row below
- **Delete Row**: Remove current row
- **Delete Table**: Remove entire table

### Markdown Syntax

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

**Tips:**
- Tables auto-adjust column widths
- Use alignment buttons to align table content
- Copy/paste cells work as expected

---

## Mathematical Expressions

VibeMD includes full LaTeX math support powered by KaTeX, perfect for scientific writing, mathematics, and technical documentation.

### Inserting Math Formulas

**Formula Dialog**
1. Click **ƒ** (Formula) button in toolbar
2. Dialog opens with two options:
   - **Inline Math** ($...$): Math within text
   - **Block Math** ($$...$$): Centered, on its own line

3. Enter LaTeX formula in plain text
4. Click **Insert Math**

### Inline Math

**Use Case:** Math within a sentence

**Example Entry:**
```
E = mc^2
```

**Renders As:** E = mc² (within your text)

**More Examples:**
- `x^2 + y^2 = z^2` → Pythagorean theorem
- `\frac{1}{2}` → One-half fraction
- `\sqrt{2}` → Square root of 2

### Block Math

**Use Case:** Display equations, centered formulas

**Example Entry:**
```
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
```

**Renders As:** Centered Gaussian integral

**More Examples:**

**Matrix:**
```
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
```

**Summation:**
```
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
```

**Fraction:**
```
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
```

### Common LaTeX Syntax

**Superscripts and Subscripts:**
- `x^2` → x²
- `x_i` → xᵢ
- `x^{10}` → x¹⁰ (use braces for multi-character)

**Greek Letters:**
- `\alpha` → α
- `\beta` → β
- `\gamma` → γ
- `\Delta` → Δ (capital)
- `\omega` → ω

**Fractions:**
- `\frac{a}{b}` → a/b (as fraction)
- `\dfrac{a}{b}` → Display-style fraction

**Roots:**
- `\sqrt{x}` → √x
- `\sqrt[3]{x}` → ∛x (cube root)

**Calculus:**
- `\int` → ∫ (integral)
- `\sum` → ∑ (summation)
- `\prod` → ∏ (product)
- `\lim_{x \to 0}` → limit notation

**Operators:**
- `\pm` → ±
- `\times` → ×
- `\div` → ÷
- `\leq` → ≤
- `\geq` → ≥
- `\neq` → ≠

**Tips:**
- Use `{}` to group terms: `x^{2y}` not `x^2y`
- Add spaces with `\,` `\;` `\quad`
- Use `\text{...}` for text within math
- Preview renders immediately after insertion

---

## Images and Links

### Inserting Links

**Using Toolbar**
1. Select text (or place cursor where link should appear)
2. Click **link** button
3. Enter URL
4. Click OK

**Markdown Syntax:**
```markdown
[Link text](https://example.com)
```

**Auto-Links:**
- Paste URLs directly: `https://example.com`
- Automatically becomes clickable link

### Inserting Images

**Using Toolbar**
1. Click **image** button
2. Enter image URL or local file path
3. Optionally add alt text
4. Click OK

**Markdown Syntax:**
```markdown
![Alt text](path/to/image.png)
```

**Supported Formats:**
- PNG, JPEG, GIF, SVG
- Local files or URLs
- Inline or block display

**Image Tips:**
- Use descriptive alt text for accessibility
- Local images should be in same directory or use relative paths
- Use alignment buttons to position images

---

## Templates

Templates provide pre-formatted document structures for common use cases.

### Using Built-In Templates

**When No Documents Open:**
1. Click **Use Template** button
2. Template list appears
3. Click **Use Template** on desired option

**From Sidebar:**
1. Click **Templates** tab
2. Browse available templates
3. Click **Use Template**

**Built-In Templates:**
- **Meeting Notes**: Structured meeting documentation
- **Project Proposal**: Project planning template
- **Technical Documentation**: Software/technical writing
- **Research Paper**: Academic writing format
- **And more!**

### Creating Custom Templates

**Method 1: Save Current Document**
1. Create document with desired structure
2. Save As with `.vibe` extension
3. Save to Templates folder (Documents/VibeMD/Templates)

**Method 2: Edit Existing Template**
1. Use existing template
2. Modify to your needs
3. Save As new template

**Template Tips:**
- Use placeholders like `[Your Name]` or `[Date]`
- Include helpful comments or instructions
- Organize templates in subfolders
- Share templates with team members

### Managing Templates

**Templates Location:**
- Default: Documents/VibeMD/Templates
- Change in **Settings → Files → Templates Location**

**Organization:**
- Create subfolders for categories
- Use descriptive filenames
- Keep library organized

---

## Settings and Customization

Access Settings with ⌘+, (Ctrl+,) or click Settings button.

### General Settings

**Open Last Document on Startup**
- Automatically open your last working document
- Convenient for ongoing projects

**Auto-Save**
- Enable/disable automatic saving
- Set save interval (seconds)
- Recommended: Keep enabled

### Appearance Settings

**Theme**
- **Light**: Bright, clean interface
- **Dark**: Easy on eyes in low light
- **System**: Matches OS theme automatically

**Color Scheme:**
- Changes automatically with theme
- Syntax highlighting in code blocks
- Consistent UI colors

### Files Settings

**Default Save Path**
- Where new documents are saved
- Default: Your Documents folder
- Change to any folder you prefer

**Templates Location**
- Where VibeMD looks for templates
- Default: Documents/VibeMD/Templates
- Can use custom folder

**Reset to Defaults:**
- Settings automatically initialize on first launch
- Paths set to OS-appropriate locations

### Editor Settings

**Font Size**
- Adjust editor text size
- Range: 10-24 pt
- Default: 12 pt

**Font Family**
- Change editor font
- Default: Arial
- Monospace fonts available

**Line Numbers**
- Show/hide line numbers
- Default: Hidden
- Useful for technical writing

### About

View application information:
- Version number
- Build date
- License information
- Third-party component licenses
- Copyright information

---

## Keyboard Shortcuts

### File Operations

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| New Document | ⌘+N | Ctrl+N |
| Open Document | ⌘+O | Ctrl+O |
| Save | ⌘+S | Ctrl+S |
| Save As | ⌘+Shift+S | Ctrl+Shift+S |
| Print | ⌘+P | Ctrl+P |

### Text Formatting

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Bold | ⌘+B | Ctrl+B |
| Italic | ⌘+I | Ctrl+I |
| Underline | ⌘+U | Ctrl+U |

### Editing

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Undo | ⌘+Z | Ctrl+Z |
| Redo | ⌘+Shift+Z | Ctrl+Shift+Z |
| Select All | ⌘+A | Ctrl+A |
| Cut | ⌘+X | Ctrl+X |
| Copy | ⌘+C | Ctrl+C |
| Paste | ⌘+V | Ctrl+V |

### Lists

| Action | Shortcut |
|--------|----------|
| Indent List Item | Tab |
| Outdent List Item | Shift+Tab |

### Application

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Settings | ⌘+, | Ctrl+, |
| Quit | ⌘+Q | Ctrl+Q |

### Navigation

| Action | Shortcut |
|--------|----------|
| Hard Break | Shift+Enter |

---

## Tips and Tricks

### Power User Tips

**1. Use Keyboard Shortcuts**
- Learn common shortcuts for faster workflow
- Especially: ⌘+S (save), ⌘+B (bold), ⌘+I (italic)

**2. Sidebar Navigation**
- Use Outline tab for long documents
- Jump to sections with one click
- See document structure at a glance

**3. Multiple Documents**
- Keep reference documents open alongside working document
- Switch quickly between files
- Each maintains independent undo history

**4. Templates for Consistency**
- Create templates for recurring document types
- Maintain consistent formatting
- Save time on document setup

**5. Auto-Save**
- Enable auto-save (it's on by default!)
- Never worry about losing work
- Focus on writing, not saving

**6. Math Mode for Technical Writing**
- Use inline math for equations in sentences
- Use block math for display equations
- LaTeX syntax is standard and portable

**7. Task Lists for To-Dos**
- Interactive checkboxes
- Track project progress
- Export as markdown to share with team

### Markdown Best Practices

**Heading Hierarchy**
- Use H1 for document title (one per document)
- H2 for main sections
- H3-H6 for subsections
- Don't skip levels

**List Consistency**
- Choose `-` or `*` for bullets and stick with it
- Use numbered lists for sequences
- Nest lists for hierarchy

**Links and References**
- Use descriptive link text
- Avoid "click here" links
- Add alt text to images

**Code Blocks**
- Specify language for syntax highlighting
- ``` ```python
- Improves readability

**Tables**
- Keep tables simple and readable
- Use headings row for column labels
- Align numeric data right

---

## Troubleshooting

### Common Issues

**Q: My document isn't saving**
- Check if auto-save is enabled in Settings
- Ensure you have write permissions to save location
- Try Save As to specify a new location

**Q: Formatting buttons aren't working**
- Ensure you have text selected (for some operations)
- Try clicking in the editor first
- Check that you're in edit mode, not preview

**Q: Tables aren't displaying correctly**
- Ensure table has consistent column counts
- Try deleting and recreating table
- Check markdown syntax if editing raw code

**Q: Math formulas not rendering**
- Verify LaTeX syntax is correct
- Use `{}` for multi-character superscripts/subscripts
- Check that formula dialog inserted properly

**Q: Images not showing**
- Verify image path is correct
- Use relative paths for portability
- Ensure image file exists at specified location

**Q: Theme not changing**
- Restart application after theme change
- Check OS theme if using "System" mode
- Try switching to explicit Light or Dark mode

**Q: Templates not appearing**
- Check Templates Location in Settings
- Ensure templates folder exists
- Templates should have `.md` or `.vibe` extension
- Try creating default templates folder manually

**Q: Can't find my saved documents**
- Check Default Save Path in Settings
- Use Open dialog to browse all locations
- Check recent files in Files tab

### Performance Issues

**Large Documents**
- Break very large documents into smaller files
- Use templates to maintain consistency across files
- Reference other documents with links

**Many Open Documents**
- Close unused documents to free memory
- Save and close periodically
- Keep 5-10 documents open maximum

### Getting Help

**Resources:**
- Check README.md for technical documentation
- Review DEPLOYMENT_GUIDE.md for installation issues
- Consult BUILD.md for platform-specific information

**Support:**
- Email: hello@vibemd.app
- Include VibeMD version number
- Describe issue with steps to reproduce
- Attach screenshots if helpful

---

## Appendix: Markdown Reference

### Quick Syntax Guide

```markdown
# Heading 1
## Heading 2
### Heading 3

**bold** or __bold__
*italic* or _italic_
~~strikethrough~~
`inline code`

> Blockquote

- Bullet list
* Also bullet list

1. Numbered list
2. Second item

- [ ] Task list
- [x] Completed task

[Link text](https://example.com)
![Image alt text](path/to/image.png)

---

Horizontal rule

---

```python
# Code block with syntax highlighting
def hello():
    print("Hello, VibeMD!")
```

| Table | Header |
|-------|--------|
| Cell  | Cell   |

Inline math: $E = mc^2$

Block math:
$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

---

## Conclusion

VibeMD combines the power of markdown with the ease of WYSIWYG editing, providing a seamless writing experience for notes, documentation, academic papers, and more.

**Key Takeaways:**
- WYSIWYG editing with full markdown support
- Powerful formatting and mathematical typesetting
- Templates for consistency and productivity
- Auto-save keeps your work safe
- Cross-platform with native OS integration

**Happy writing with VibeMD!**

---

**VibeMD User Guide v1.0.0**
**Copyright © 2025 ONLY1 Pty Ltd**
**Last Updated: October 20, 2025**

