import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { ListItem } from '@tiptap/extension-list-item';
import { Heading } from '@tiptap/extension-heading';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { TextAlign } from '@tiptap/extension-text-align';
import { Mathematics } from '@tiptap/extension-mathematics';
import { Extension } from '@tiptap/core';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useNavigationStore } from '@/services/navigationService';
import { editorService } from '@/services/editorService';
import { marked } from 'marked';
import TurndownService from 'turndown';
import { LinkDialog } from '../dialogs/LinkDialog';
import { ImageDialog } from '../dialogs/ImageDialog';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Code,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  CheckSquare,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  ChevronDown,
  Minus as HorizontalRuleIcon,
  Indent,
  Outdent,
  AlignLeft,
  AlignCenter,
  AlignRight,
  SquareFunction,
  SquarePower,
  Plus,
  Minus,
  X,
  Divide
} from 'lucide-react';
import { MathDialog } from '../dialogs/MathDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function TipTapEditor() {
  // IMPORTANT: Subscribe to the actual state, not the getter function
  // This ensures the component re-renders when document content changes
  const activeDocument = useDocumentStore((state) => {
    if (!state.activeDocumentId) return null;
    return state.documents.get(state.activeDocumentId) || null;
  });
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);
  const setScrollToHeadingHandler = useNavigationStore((state) => state.setScrollToHeadingHandler);

  // Dialog state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  // Context menu state
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  // Flag to prevent circular updates
  const isUpdatingFromEditor = React.useRef(false);
  const isUpdatingFromDocument = React.useRef(false);

  // Heading levels configuration
  const headingLevels = [
    { value: 'paragraph', label: 'Normal text', level: 0 },
    { value: 'heading1', label: 'Heading 1', level: 1 },
    { value: 'heading2', label: 'Heading 2', level: 2 },
    { value: 'heading3', label: 'Heading 3', level: 3 },
    { value: 'heading4', label: 'Heading 4', level: 4 },
    { value: 'heading5', label: 'Heading 5', level: 5 },
    { value: 'heading6', label: 'Heading 6', level: 6 },
  ];

  // Table commands configuration
  const tableCommands = [
    { value: 'insertRowBefore', label: 'Insert row above' },
    { value: 'insertRowAfter', label: 'Insert row below' },
    { value: 'insertColumnBefore', label: 'Insert column left' },
    { value: 'insertColumnAfter', label: 'Insert column right' },
    { value: 'deleteRow', label: 'Delete row' },
    { value: 'deleteColumn', label: 'Delete column' },
    { value: 'deleteTable', label: 'Delete table' },
  ];

  // Function to convert markdown to HTML
  const markdownToHtml = (markdown: string): string => {
    try {
      // First, protect LaTeX math expressions from being processed by marked
      const protectedMath: { content: string; placeholder: string; type: 'block' | 'inline' }[] = [];
      let protectedMarkdown = markdown;
      
      // Protect block math ($$...$$) - handle multi-line expressions
      protectedMarkdown = protectedMarkdown.replace(/\$\$([\s\S]*?)\$\$/g, (match, content) => {
        const placeholder = `<!-- MATH_BLOCK_${protectedMath.length} -->`;
        protectedMath.push({
          content: content.trim(),
          placeholder: placeholder,
          type: 'block'
        });
        return placeholder;
      });
      
      // Protect inline math ($...$) - but not $$ patterns
      protectedMarkdown = protectedMarkdown.replace(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g, (match, content) => {
        const placeholder = `<!-- MATH_INLINE_${protectedMath.length} -->`;
        protectedMath.push({
          content: content.trim(),
          placeholder: placeholder,
          type: 'inline'
        });
        return placeholder;
      });
      
      const html = marked.parse(protectedMarkdown, {
        gfm: true,
        breaks: false,
        pedantic: false,
      }) as string;
      
      // Add heading IDs for navigation
      let htmlWithIds = html.replace(/<h([1-6])>(.*?)<\/h[1-6]>/g, (match: string, level: string, content: string) => {
        // Extract text content from HTML (remove any HTML tags)
        const textContent = content.replace(/<[^>]*>/g, '');
        const id = generateHeadingId(textContent);
        return `<h${level} id="${id}">${content}</h${level}>`;
      });
      
      // Handle text alignment from HTML divs - CRITICAL FIX
      // First handle divs with paragraphs inside
      htmlWithIds = htmlWithIds.replace(/<div style="text-align: (center|right)">\s*<p>(.*?)<\/p>\s*<\/div>/g, (match: string, align: string, content: string) => {
        return `<p style="text-align: ${align}">${content}</p>`;
      });
      
      // Then handle divs with plain text content
      htmlWithIds = htmlWithIds.replace(/<div style="text-align: (center|right)">(.*?)<\/div>/g, (match: string, align: string, content: string) => {
        // If content doesn't start with a tag, wrap it in a paragraph
        if (!content.trim().startsWith('<')) {
          return `<p style="text-align: ${align}">${content}</p>`;
        } else {
          // For other content, wrap in div with text-align
          return `<div style="text-align: ${align}">${content}</div>`;
        }
      });
      
      // Restore protected math expressions
      let finalHtml = htmlWithIds;
      protectedMath.forEach((math) => {
        const mathHtml = math.type === 'block'
          ? `<div data-type="block-math" data-latex="${math.content}" class="math-node"></div>`
          : `<span data-type="inline-math" data-latex="${math.content}" class="math-node"></span>`;

        finalHtml = finalHtml.replace(math.placeholder, mathHtml);
      });

      // CRITICAL FIX: Ensure all math nodes have the math-node class
      // This handles cases where the Mathematics extension doesn't add the class
      finalHtml = finalHtml.replace(
        /<span data-type="inline-math" data-latex="([^"]*)"(?!\s+class="[^"]*math-node[^"]*")/g,
        '<span data-type="inline-math" data-latex="$1" class="math-node"'
      );
      finalHtml = finalHtml.replace(
        /<div data-type="block-math" data-latex="([^"]*)"(?!\s+class="[^"]*math-node[^"]*")/g,
        '<div data-type="block-math" data-latex="$1" class="math-node"'
      );

      // Additional fix: Handle math nodes that might be missing the class attribute entirely
      finalHtml = finalHtml.replace(
        /<span data-type="inline-math" data-latex="([^"]*)"(?!\s+class=)/g,
        '<span data-type="inline-math" data-latex="$1" class="math-node"'
      );
      finalHtml = finalHtml.replace(
        /<div data-type="block-math" data-latex="([^"]*)"(?!\s+class=)/g,
        '<div data-type="block-math" data-latex="$1" class="math-node"'
      );

      // Fix task lists - add data-type attributes for TipTap
      // marked converts `- [ ] task` to `<ul><li><input type="checkbox">task</li></ul>`
      // We need to add data-type="taskList" and data-type="taskItem" for our Turndown rules
      finalHtml = finalHtml.replace(/<ul>\s*<li><input[^>]*type="checkbox"[^>]*>/gi, (match) => {
        // Check if this UL already has data-type (avoid double-processing)
        if (match.includes('data-type="taskList"')) return match;
        // Add data-type to UL and LI
        return '<ul data-type="taskList"><li data-type="taskItem"><input type="checkbox">';
      });

      // Fix remaining task list items in the same list
      finalHtml = finalHtml.replace(/<li><input([^>]*)type="checkbox"([^>]*)>/gi, (match, before, after) => {
        if (match.includes('data-type="taskItem"')) return match;
        return `<li data-type="taskItem"><input${before}type="checkbox"${after}>`;
      });

      return finalHtml;
    } catch (error) {
      console.error('Error converting markdown to HTML:', error);
      return markdown; // Fallback to original content
    }
  };

  // Function to generate heading ID from text
  const generateHeadingId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  // Function to convert HTML to markdown
  const htmlToMarkdown = (html: string): string => {
    try {
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
        strongDelimiter: '**',
        linkStyle: 'inlined',
        linkReferenceStyle: 'full',
      });

      // CRITICAL: Add LaTeX math support FIRST to ensure highest priority
      turndownService.addRule('mathInlineNode', {
        filter: function (node) {
          // Only check SPAN elements
          if (node.nodeName !== 'SPAN' && node.nodeName !== 'span') return false;
          
          const elem = node as HTMLElement;
          const dataType = elem.getAttribute('data-type');
          const dataLatex = elem.getAttribute('data-latex');
          const className = elem.getAttribute('class') || '';

          // Match any span with data-type="inline-math" or data-latex attribute or math-node class
          const matches = dataType === 'inline-math' || 
                         (dataLatex !== null && dataLatex !== '') ||
                         className.includes('math-node');
          
          return matches;
        },
        replacement: function (content, node) {
          const elem = node as HTMLElement;
          // TipTap stores LaTeX in data-latex attribute or text content
          let latex = elem.getAttribute('data-latex') || elem.textContent?.trim() || '';
          
          // Remove surrounding $ if present (since we add them back)
          latex = latex.replace(/^\$/, '').replace(/\$$/, '').trim();
          
          return latex ? `$${latex}$` : '';
        }
      });

      turndownService.addRule('mathDisplayNode', {
        filter: function (node) {
          // Only check DIV elements
          if (node.nodeName !== 'DIV' && node.nodeName !== 'div') return false;
          
          const elem = node as HTMLElement;
          const dataType = elem.getAttribute('data-type');
          const dataLatex = elem.getAttribute('data-latex');
          const className = elem.getAttribute('class') || '';

          // Match any div with data-type="block-math" or data-latex attribute or math-node class
          const matches = dataType === 'block-math' || 
                         (dataLatex !== null && dataLatex !== '') ||
                         className.includes('math-node');
          
          return matches;
        },
        replacement: function (content, node) {
          const elem = node as HTMLElement;
          // TipTap stores LaTeX in data-latex attribute or text content
          let latex = elem.getAttribute('data-latex') || elem.textContent?.trim() || '';

          // Remove surrounding $$ if present (since we add them back)
          latex = latex.replace(/^\$\$/, '').replace(/\$\$$/, '').trim();

          return latex ? `\n$$${latex}$$\n` : '';
        }
      });

      // Add table support - FIXED: Only add header row if table actually has one
      turndownService.addRule('table', {
        filter: 'table',
        replacement: function (content, node) {
          const table = node as HTMLTableElement;
          const rows = Array.from(table.querySelectorAll('tr'));

          if (rows.length === 0) return '';

          let markdown = '\n';
          let hasHeaderRow = false;

          // Process each row
          rows.forEach((row, rowIndex) => {
            const headerCells = Array.from(row.querySelectorAll('th'));
            const dataCells = Array.from(row.querySelectorAll('td'));
            const allCells = [...headerCells, ...dataCells];

            if (allCells.length === 0) return;

            // Determine if this row is a header (has <th> tags)
            const isHeaderRow = headerCells.length > 0;
            if (isHeaderRow) hasHeaderRow = true;

            const cellContents = allCells.map(cell => {
              const cellText = cell.textContent || '';
              return cellText.replace(/\|/g, '\\|').trim();
            });

            markdown += '| ' + cellContents.join(' | ') + ' |\n';

            // Add separator row ONLY after an actual header row (with <th> tags)
            if (isHeaderRow) {
              const separators = allCells.map(cell => {
                const align = (cell as HTMLElement).style.textAlign;
                switch (align) {
                  case 'center': return ':---:';
                  case 'right': return '---:';
                  default: return '---';
                }
              });
              markdown += '| ' + separators.join(' | ') + ' |\n';
            }
          });

          // CRITICAL FIX: Markdown tables MUST have a header row
          // If no header row was found, add one at the beginning with empty headers
          if (!hasHeaderRow && rows.length > 0) {
            const firstRowCells = Array.from(rows[0].querySelectorAll('td')).length;
            const emptyHeaders = Array(firstRowCells).fill('').join(' | ');
            const separators = Array(firstRowCells).fill('---').join(' | ');
            // Prepend header row to markdown
            markdown = '\n| ' + emptyHeaders + ' |\n| ' + separators + ' |\n' + markdown.substring(1);
          }

          return markdown + '\n';
        }
      });

      // Add task list support - CRITICAL for preserving checkboxes
      turndownService.addRule('taskList', {
        filter: function (node) {
          return node.nodeName === 'UL' &&
                 (node as HTMLElement).getAttribute('data-type') === 'taskList';
        },
        replacement: function (content, node) {
          return '\n' + content;
        }
      });

      turndownService.addRule('taskItem', {
        filter: function (node) {
          return node.nodeName === 'LI' &&
                 (node as HTMLElement).getAttribute('data-type') === 'taskItem';
        },
        replacement: function (content, node) {
          const elem = node as HTMLElement;
          const checkbox = elem.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
          const isChecked = checkbox?.hasAttribute('checked') || checkbox?.checked || false;

          // Extract text from the div>p structure that TipTap creates
          // TipTap wraps task content in: <label><input><span></span></label><div><p>Task text</p></div>
          const textDiv = elem.querySelector('div');
          const taskText = textDiv?.textContent?.trim() || '';

          return '- [' + (isChecked ? 'x' : ' ') + '] ' + taskText + '\n';
        }
      });

      // Add strikethrough support
      turndownService.addRule('strikethrough', {
        filter: function (node) {
          return node.nodeName === 'DEL' || node.nodeName === 'S' || node.nodeName === 'STRIKE';
        },
        replacement: function (content) {
          return '~~' + content + '~~';
        }
      });

      // Add superscript support
      turndownService.addRule('superscript', {
        filter: 'sup',
        replacement: function (content) {
          return '<sup>' + content + '</sup>';
        }
      });

      // Add subscript support
      turndownService.addRule('subscript', {
        filter: 'sub',
        replacement: function (content) {
          return '<sub>' + content + '</sub>';
        }
      });

      // Add text alignment support - check both style and text-align attribute
      turndownService.addRule('textAlign', {
        filter: function (node, options) {
          if (node.nodeName === 'P') {
            const elem = node as HTMLElement;
            const styleAlign = elem.style?.textAlign;
            const attrAlign = elem.getAttribute('style')?.includes('text-align');

            // Match if has text-align style (center or right)
            return !!(styleAlign && styleAlign !== 'left' && (styleAlign === 'center' || styleAlign === 'right'));
          }
          return false;
        },
        replacement: function (content, node) {
          const elem = node as HTMLElement;
          const align = elem.style?.textAlign || elem.getAttribute('style')?.match(/text-align:\s*([^;]+)/)?.[1];
          
          // Ensure we have a valid alignment value
          if (align && (align === 'center' || align === 'right')) {
            return `<div style="text-align: ${align}">${content}</div>\n\n`;
          }
          
          // Fallback to original content if no valid alignment
          return content;
        }
      });

      // Keep headings as markdown, but preserve alignment
      turndownService.addRule('headingWithAlignment', {
        filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        replacement: function (content, node, options) {
          const hLevel = parseInt(node.nodeName.charAt(1));
          const hPrefix = '#'.repeat(hLevel);
          const align = (node as HTMLElement).style?.textAlign;

          // If heading has alignment, wrap in div
          if (align && align !== 'left' && (align === 'center' || align === 'right')) {
            return `<div style="text-align: ${align}">${hPrefix} ${content}</div>\n\n`;
          }

          // Default heading
          return hPrefix + ' ' + content + '\n\n';
        }
      });

      // CRITICAL: Pre-process HTML to ensure math nodes are properly formatted
      let processedHtml = html;
      
      // Ensure all math nodes have the math-node class
      processedHtml = processedHtml.replace(
        /<span data-type="inline-math" data-latex="([^"]*)"(?!\s+class=)/g,
        '<span data-type="inline-math" data-latex="$1" class="math-node"'
      );
      processedHtml = processedHtml.replace(
        /<div data-type="block-math" data-latex="([^"]*)"(?!\s+class=)/g,
        '<div data-type="block-math" data-latex="$1" class="math-node"'
      );
      
      // Handle math nodes that might have other attributes but no class
      processedHtml = processedHtml.replace(
        /<span data-type="inline-math" data-latex="([^"]*)"(?!\s+class="[^"]*math-node[^"]*")/g,
        '<span data-type="inline-math" data-latex="$1" class="math-node"'
      );
      processedHtml = processedHtml.replace(
        /<div data-type="block-math" data-latex="([^"]*)"(?!\s+class="[^"]*math-node[^"]*")/g,
        '<div data-type="block-math" data-latex="$1" class="math-node"'
      );

      // CRITICAL FIX: Extract math nodes before Turndown processing
      const mathNodesData: Array<{type: 'inline' | 'block', latex: string, placeholder: string}> = [];
      let mathProcessedHtml = processedHtml;
      
      // Replace math nodes with placeholders before Turndown processing
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = processedHtml;
      const mathNodes = tempDiv.querySelectorAll('[data-type="inline-math"], [data-type="block-math"], [data-latex]');
      
      mathNodes.forEach((node, index) => {
        const dataType = node.getAttribute('data-type');
        const dataLatex = node.getAttribute('data-latex');
        const className = node.getAttribute('class') || '';

        if (dataLatex && (dataType === 'inline-math' || dataType === 'block-math' || className.includes('math-node'))) {
          // Use a unique marker that won't be escaped by Turndown
          const placeholder = `___MATH_PLACEHOLDER_${index}___`;
          const type = dataType === 'block-math' ? 'block' : 'inline';

          mathNodesData.push({ type, latex: dataLatex, placeholder });

          // Replace the math node with a placeholder
          mathProcessedHtml = mathProcessedHtml.replace(node.outerHTML, placeholder);
        }
      });

      const markdown = turndownService.turndown(mathProcessedHtml);

      // Restore math nodes in markdown
      let finalMarkdown = markdown;
      mathNodesData.forEach(({ type, latex, placeholder }) => {
        const mathMarkdown = type === 'block' ? `\n$$${latex}$$\n` : `$${latex}$`;

        // Turndown escapes underscores as \_
        // So ___MATH_PLACEHOLDER_0___ becomes \\_\\_\\_MATH\\_PLACEHOLDER\\_0\\_\\_\\_
        const escapedPlaceholder = placeholder.replace(/_/g, '\\_');

        // Try both the original and escaped version
        const regex1 = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const regex2 = new RegExp(escapedPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

        finalMarkdown = finalMarkdown.replace(regex1, mathMarkdown);
        finalMarkdown = finalMarkdown.replace(regex2, mathMarkdown);
      });

      return finalMarkdown;
    } catch (error) {
      console.error('Error converting HTML to markdown:', error);
      return html; // Fallback to original content
    }
  };

  // Custom extension to preserve heading IDs
  const HeadingIdExtension = Extension.create({
    name: 'headingId',

    addGlobalAttributes() {
      return [
        {
          types: ['heading'],
          attributes: {
            id: {
              default: null,
              parseHTML: element => element.getAttribute('id'),
              renderHTML: attributes => {
                if (!attributes.id) {
                  return {};
                }
                return {
                  id: attributes.id,
                };
              },
            },
          },
        },
      ];
    },
  });

  // Custom extension for list indentation keyboard shortcuts
  const ListIndentExtension = Extension.create({
    name: 'listIndent',

    addKeyboardShortcuts() {
      return {
        'Tab': () => {
          // Check if we're in a list
          if (this.editor.isActive('listItem')) {
            return this.editor.commands.sinkListItem('listItem');
          }
          return false;
        },
        'Shift-Tab': () => {
          // Check if we're in a list
          if (this.editor.isActive('listItem')) {
            return this.editor.commands.liftListItem('listItem');
          }
          return false;
        },
      };
    },
  });

  // Custom TableCell extension with alignment support
  const TableCellWithAlignment = TableCell.extend({
    addAttributes() {
      return {
        textAlign: {
          default: 'left',
          parseHTML: (element: HTMLElement) => element.style.textAlign || 'left',
          renderHTML: (attributes: any) => {
            if (!attributes.textAlign || attributes.textAlign === 'left') {
              return {};
            }
            return {
              style: `text-align: ${attributes.textAlign}`,
            };
          },
        },
        colspan: {
          default: 1,
          parseHTML: (element: HTMLElement) => parseInt(element.getAttribute('colspan') || '1'),
          renderHTML: (attributes: any) => {
            if (!attributes.colspan || attributes.colspan === 1) {
              return {};
            }
            return {
              colspan: attributes.colspan,
            };
          },
        },
        rowspan: {
          default: 1,
          parseHTML: (element: HTMLElement) => parseInt(element.getAttribute('rowspan') || '1'),
          renderHTML: (attributes: any) => {
            if (!attributes.rowspan || attributes.rowspan === 1) {
              return {};
            }
            return {
              rowspan: attributes.rowspan,
            };
          },
        },
      };
    },
  });

  // Custom Mathematics extension that ensures proper HTML output
  const MathematicsWithClass = Mathematics.extend({
    addGlobalAttributes() {
      return [
        {
          types: ['mathInline'],
          attributes: {
            class: {
              default: 'math-node',
              parseHTML: () => 'math-node',
              renderHTML: () => ({ class: 'math-node' }),
            },
          },
        },
        {
          types: ['mathBlock'],
          attributes: {
            class: {
              default: 'math-node',
              parseHTML: () => 'math-node',
              renderHTML: () => ({ class: 'math-node' }),
            },
          },
        },
      ];
    },
  });

  // Math insertion is handled directly by the Mathematics extension

  // Custom Table extension to fix navigation issues
  const TableWithNavigationFix = Table.extend({
    addKeyboardShortcuts() {
      return {
        // Override default arrow key behavior to prevent navigation errors
        'ArrowUp': ({ editor }: { editor: any }) => {
          if (editor.isActive('table')) {
            // Use safer navigation method
            try {
              return editor.commands.goToPreviousCell();
            } catch (error) {
              console.warn('[Table] Navigation error prevented:', error);
              return false;
            }
          }
          return false;
        },
        'ArrowDown': ({ editor }: { editor: any }) => {
          if (editor.isActive('table')) {
            // Use safer navigation method
            try {
              return editor.commands.goToNextCell();
            } catch (error) {
              console.warn('[Table] Navigation error prevented:', error);
              return false;
            }
          }
          return false;
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      // Core extensions (CommonMark compliant)
      StarterKit.configure({
        // Exclude conflicting extensions
        bulletList: false,
        orderedList: false,
        heading: false, // Use custom Heading extension instead
        listItem: false, // Exclude to prevent duplicate
        link: false, // Exclude to prevent duplicate
        horizontalRule: false, // Use custom HorizontalRule extension
        hardBreak: false, // Disable hardBreak to prevent line break issues
        // Keep strikethrough, code, and codeBlock with default configurations
      }),

      // Custom extensions for better control
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6], // Support all heading levels
      }),
      BulletList,
      OrderedList,
      ListItem,
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item-content',
        },
      }),
      Superscript,
      Subscript,
      HorizontalRule,
      HeadingIdExtension,
      ListIndentExtension,

      // Text alignment support
      TextAlign.configure({
        types: ['heading', 'paragraph', 'tableCell'],
        alignments: ['left', 'center', 'right'],
      }),

      // Link support (CommonMark) with autolink enabled
      Link.configure({
        openOnClick: false,
        autolink: true, // Enable autolinks (GFM feature)
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      
      TableWithNavigationFix.configure({
        resizable: false, // Disable resizing to prevent width: 0px issue
        allowTableNodeSelection: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow,
      TableHeader,
      TableCellWithAlignment,

      // Mathematics extension (always enabled) - using custom version with class attribute
      MathematicsWithClass.configure({
        katexOptions: {
          throwOnError: false,
          errorColor: '#cc0000',
          displayMode: false, // Default to inline mode
        },
      }),
    ],
    content: activeDocument?.content ? markdownToHtml(activeDocument.content) : '',
    autofocus: 'start', // Auto-focus at start
    onUpdate: ({ editor }) => {
      if (activeDocument && !isUpdatingFromDocument.current) {
        isUpdatingFromEditor.current = true;
        const html = editor.getHTML();
        const markdown = htmlToMarkdown(html);
        updateDocument(activeDocument.id, { content: markdown });
        markAsModified(activeDocument.id);
        // Reset flag after a short delay to allow the update to propagate
        setTimeout(() => {
          isUpdatingFromEditor.current = false;
        }, 50);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Update toolbar state when selection changes
      setUpdateTrigger(prev => prev + 1);
    },
  });

  // State to force toolbar re-render when editor state changes
  const [updateTrigger, setUpdateTrigger] = React.useState(0);
  
  // State for math dialog
  const [mathDialogOpen, setMathDialogOpen] = React.useState(false);

  // Track the last document ID to detect document switches
  const lastDocumentId = React.useRef<string | null>(null);

  // Function to save current editor content to document store
  const saveCurrentContent = React.useCallback(() => {
    if (!editor || !lastDocumentId.current) return;
    
    const html = editor.getHTML();
    const markdown = htmlToMarkdown(html);
    
    console.log('[Save Current] Saving content for document:', lastDocumentId.current);
    console.log('[Save Current] Content length:', markdown.length);
    
    updateDocument(lastDocumentId.current, { content: markdown });
    markAsModified(lastDocumentId.current);
  }, [editor, updateDocument, markAsModified]);

  // Register save function with editor service
  React.useEffect(() => {
    editorService.setSaveCurrentContentCallback(saveCurrentContent);
    return () => {
      editorService.clearSaveCallback();
    };
  }, [saveCurrentContent]);

  // Update editor content when active document changes
  React.useEffect(() => {
    if (!editor) return;

    // If no active document, clear the editor
    if (!activeDocument) {
      editor.commands.clearContent();
      lastDocumentId.current = null;
      return;
    }

    // Detect if we've switched to a different document
    const isDocumentSwitch = lastDocumentId.current !== activeDocument.id;

    if (isDocumentSwitch) {
      // CRITICAL: Save the previous document's content before switching
      if (lastDocumentId.current) {
        saveCurrentContent();
      }
      
      // Force reset the flag on document switch
      isUpdatingFromEditor.current = false;
      lastDocumentId.current = activeDocument.id;
      
      console.log('[Document Switch] Switched to document:', activeDocument.filename);
    }

    // Skip if the update came from the editor itself to prevent circular updates
    // BUT allow updates on document switches
    if (isUpdatingFromEditor.current && !isDocumentSwitch) {
      return;
    }

    const currentContent = editor.getHTML();
    const newContent = markdownToHtml(activeDocument.content);

    // Only update if content has actually changed to avoid unnecessary updates
    if (currentContent !== newContent) {
      console.log('[Content Update] Setting new content for document:', activeDocument.filename);
      console.log('[Content Update] Content length:', activeDocument.content.length);
      
      isUpdatingFromDocument.current = true;
      // Use emitUpdate: false to prevent triggering onUpdate during document switch
      editor.commands.setContent(newContent, { emitUpdate: false });
      
      // Small delay to ensure the content is properly set before allowing updates
      setTimeout(() => {
        isUpdatingFromDocument.current = false;
        console.log('[Content Update] Content update completed');
      }, 100);
    } else {
      console.log('[Content Update] Content unchanged, skipping update');
    }
  }, [editor, activeDocument?.id, activeDocument?.content, saveCurrentContent]);

  // Save content when component unmounts or editor changes
  React.useEffect(() => {
    return () => {
      // Save current content when component unmounts
      if (editor && lastDocumentId.current) {
        saveCurrentContent();
      }
    };
  }, [editor, saveCurrentContent]);

  // Update toolbar when editor state changes
  React.useEffect(() => {
    if (!editor) return;
    
    const updateToolbar = () => {
      setUpdateTrigger(prev => prev + 1);
    };
    
    editor.on('selectionUpdate', updateToolbar);
    editor.on('transaction', updateToolbar);
    
    return () => {
      editor.off('selectionUpdate', updateToolbar);
      editor.off('transaction', updateToolbar);
    };
  }, [editor]);

  // Set up navigation handler for outline-to-editor navigation
  React.useEffect(() => {
    if (editor) {
      const scrollToHeading = (headingId: string) => {
        // Find the heading element in the editor
        const headingElement = editor.view.dom.querySelector(`h1[id="${headingId}"], h2[id="${headingId}"], h3[id="${headingId}"], h4[id="${headingId}"], h5[id="${headingId}"], h6[id="${headingId}"]`);
        
        if (headingElement) {
          // Scroll to the heading
          headingElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
          
          // Focus the editor and position cursor at the heading
          editor.commands.focus();
          
          // Find the position of the heading in the editor
          const pos = editor.view.posAtDOM(headingElement, 0);
          if (pos !== null) {
            editor.commands.setTextSelection(pos);
          }
        }
      };
      
      setScrollToHeadingHandler(scrollToHeading);
    }
  }, [editor, setScrollToHeadingHandler]);

  // Get current heading level for dropdown
  const getCurrentHeading = () => {
    if (!editor) return 'paragraph';
    
    for (let level = 1; level <= 6; level++) {
      if (editor.isActive('heading', { level })) {
        return `heading${level}`;
      }
    }
    return 'paragraph';
  };

  // Handle heading change
  const handleHeadingChange = (value: string) => {
    if (!editor) return;
    
    const level = parseInt(value.replace('heading', '')) || 0;
    
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().setHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
    }
    
    // Focus editor after selection
    setTimeout(() => {
      editor.commands.focus();
    }, 100);
  };

  // Handle table command
  const handleTableCommand = (command: string) => {
    if (!editor) return;
    
    switch (command) {
      case 'insertRowBefore':
        editor.chain().focus().addRowBefore().run();
        break;
      case 'insertRowAfter':
        editor.chain().focus().addRowAfter().run();
        break;
      case 'insertColumnBefore':
        editor.chain().focus().addColumnBefore().run();
        break;
      case 'insertColumnAfter':
        editor.chain().focus().addColumnAfter().run();
        break;
      case 'deleteRow':
        editor.chain().focus().deleteRow().run();
        break;
      case 'deleteColumn':
        editor.chain().focus().deleteColumn().run();
        break;
      case 'deleteTable':
        editor.chain().focus().deleteTable().run();
        break;
    }
    
    // Focus editor after command
    setTimeout(() => {
      editor.commands.focus();
    }, 100);
  };

  // Handle context menu
  const handleContextMenu = (event: React.MouseEvent) => {
    if (!editor?.isActive('table')) return;
    
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setContextMenuOpen(true);
  };

  // Close context menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setContextMenuOpen(false);
    };
    
    if (contextMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenuOpen]);

  // Toolbar button configuration - memoized to update when editor state changes
  const toolbarButtons = React.useMemo(() => [
    {
      id: 'bold',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive('bold') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <Bold className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold (Ctrl+B - click again to exit)</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'italic',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive('italic') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <Italic className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic (Ctrl+I - click again to exit)</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'strikethrough',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive('strike') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <Strikethrough className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Strikethrough (click again to exit)</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'code',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleCode().run()}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive('code') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <Code className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Inline Code (click again to exit)</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'alignLeft',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                editor?.chain().focus().setTextAlign('left').run();
              }}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive({ textAlign: 'left' }) ||
                editor?.isActive('tableCell', { textAlign: 'left' }) ?
                'bg-accent text-accent-foreground' : ''
              }`}
            >
              <AlignLeft className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Left</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'alignCenter',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                editor?.chain().focus().setTextAlign('center').run();
              }}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive({ textAlign: 'center' }) ||
                editor?.isActive('tableCell', { textAlign: 'center' }) ?
                'bg-accent text-accent-foreground' : ''
              }`}
            >
              <AlignCenter className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Center</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'alignRight',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                editor?.chain().focus().setTextAlign('right').run();
              }}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive({ textAlign: 'right' }) ||
                editor?.isActive('tableCell', { textAlign: 'right' }) ?
                'bg-accent text-accent-foreground' : ''
              }`}
            >
              <AlignRight className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Right</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'heading',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Select value={getCurrentHeading()} onValueChange={handleHeadingChange}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Select heading" />
              </SelectTrigger>
              <SelectContent>
                {headingLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipTrigger>
          <TooltipContent>
            <p>Text Style</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'bulletList',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive('bulletList') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bullet List</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'orderedList',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive('orderedList') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <ListOrdered className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Numbered List</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'indent',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().sinkListItem('listItem').run()}
              disabled={!editor?.can().sinkListItem('listItem')}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground disabled:opacity-30 disabled:cursor-not-allowed ${
                editor?.isActive('listItem') ? '' : ''
              }`}
            >
              <Indent className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Indent List (Tab)</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'outdent',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().liftListItem('listItem').run()}
              disabled={!editor?.can().liftListItem('listItem')}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground disabled:opacity-30 disabled:cursor-not-allowed ${
                editor?.isActive('listItem') ? '' : ''
              }`}
            >
              <Outdent className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Outdent List (Shift+Tab)</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'taskList',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                console.log('[TaskList] Toggling task list');
                console.log('[TaskList] Before toggle - isActive:', editor?.isActive('taskList'));
                console.log('[TaskList] Current selection:', editor?.state.selection);
                const result = editor?.chain().focus().toggleTaskList().run();
                console.log('[TaskList] Toggle result:', result);
                console.log('[TaskList] After toggle - isActive:', editor?.isActive('taskList'));
                console.log('[TaskList] HTML after toggle:', editor?.getHTML());
              }}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive('taskList') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <CheckSquare className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Task List</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'blockquote',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive('blockquote') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <Quote className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Quote</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'codeBlock',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                console.log('[CodeBlock] Toggling code block');
                editor?.chain().focus().toggleCodeBlock().run();
                console.log('[CodeBlock] After toggle, isActive:', editor?.isActive('codeBlock'));
              }}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive('codeBlock') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <Code className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Code Block</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'horizontalRule',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              className="p-2 rounded hover:bg-gray-100"
            >
              <HorizontalRuleIcon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Horizontal Rule</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'link',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setLinkDialogOpen(true)}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive('link') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <LinkIcon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Link</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'image',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setImageDialogOpen(true)}
              className="p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Image</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'table',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                if (!editor) return;

                console.log('[Table] Inserting table');
                try {
                  // Insert a simple 3x3 table with proper structure
                  // Use withHeaderRow: false to avoid navigation issues
                  editor.chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
                    .run();

                  console.log('[Table] After insert, isActive:', editor.isActive('table'));
                  console.log('[Table] HTML:', editor.getHTML());
                } catch (error) {
                  console.error('[Table] Error inserting table:', error);
                }
              }}
              className="p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground"
            >
              <TableIcon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Table</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'tableCommands',
      component: editor?.isActive('table') ? (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Select onValueChange={handleTableCommand}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Table actions" />
              </SelectTrigger>
              <SelectContent>
                {tableCommands.map((command) => (
                  <SelectItem key={command.value} value={command.value}>
                    {command.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipTrigger>
          <TooltipContent>
            <p>Table Actions</p>
          </TooltipContent>
        </Tooltip>
      ) : null,
    },
    {
      id: 'superscript',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleSuperscript().run()}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive('superscript') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <SuperscriptIcon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Superscript (click again to exit)</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'subscript',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleSubscript().run()}
              className={`p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground ${
                editor?.isActive('subscript') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <SubscriptIcon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Subscript (click again to exit)</p>
          </TooltipContent>
        </Tooltip>
      ),
    },

    // Math button (always shown)
    {
      id: 'insertMath',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setMathDialogOpen(true)}
              className="p-2 rounded hover:bg-accent hover:text-accent-foreground text-foreground"
            >
              <SquareFunction className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Math Formula</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
  ], [editor, updateTrigger]); // Re-create when editor state changes

  // Filter out null components (like tableCommands when not in table)
  const visibleToolbarButtons = toolbarButtons.filter(button => button.component !== null);

  // Handler for math dialog
  const handleMathInsert = (type: 'inline' | 'block', latex: string) => {
    console.log('[MathDialog] Inserting math:', { type, latex });

    if (!editor) {
      console.error('[MathDialog] No editor instance available');
      return;
    }

    try {
      if (type === 'inline') {
        console.log('[MathDialog] Attempting to insert inline math');
        // Use the Mathematics extension command directly
        const result = editor.chain().focus().insertInlineMath({ latex }).run();
        console.log('[MathDialog] Insert inline math result:', result);
      } else {
        console.log('[MathDialog] Attempting to insert block math');
        // Use the Mathematics extension command directly
        const result = editor.chain().focus().insertBlockMath({ latex }).run();
        console.log('[MathDialog] Insert block math result:', result);
      }

      // Close the dialog after successful insertion
      setMathDialogOpen(false);
    } catch (error) {
      console.error('[MathDialog] Error inserting math:', error);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-background">
          {visibleToolbarButtons.map((button) => (
            <React.Fragment key={button.id}>
              {button.component}
            </React.Fragment>
          ))}
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto">
          <EditorContent
            editor={editor}
            className="h-full p-4 max-w-none focus:outline-none"
            style={{ 
              '--editor-base-font-size': `${settings.editor.fontSize}px`,
              '--editor-font-family': settings.editor.fontFamily || 'Arial',
              fontSize: `${settings.editor.fontSize}px`,
              fontFamily: settings.editor.fontFamily || 'Arial'
            } as React.CSSProperties}
            onWheel={(e) => {
              // Allow scrolling without preventing default
            }}
            onContextMenu={handleContextMenu}
          />
        </div>

        {/* Context Menu */}
        {contextMenuOpen && editor?.isActive('table') && (
          <div
            className="fixed bg-white border border-gray-300 rounded shadow-lg z-50"
            style={{
              left: `${contextMenuPosition.x}px`,
              top: `${contextMenuPosition.y}px`,
              minWidth: '200px',
            }}
          >
            {/* Row Operations */}
            <div className="px-4 py-2 text-xs font-bold text-gray-600 border-b">
              Rows
            </div>
            <button
              onClick={() => {
                editor?.chain().focus().addRowBefore().run();
                setContextMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              Insert Row Above
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().addRowAfter().run();
                setContextMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              Insert Row Below
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this row?')) {
                  editor?.chain().focus().deleteRow().run();
                }
                setContextMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-red-600"
            >
              Delete Row
            </button>

            {/* Column Operations */}
            <div className="px-4 py-2 text-xs font-bold text-gray-600 border-b">
              Columns
            </div>
            <button
              onClick={() => {
                editor?.chain().focus().addColumnBefore().run();
                setContextMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              Insert Column Left
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().addColumnAfter().run();
                setContextMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              Insert Column Right
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this column?')) {
                  editor?.chain().focus().deleteColumn().run();
                }
                setContextMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-red-600"
            >
              Delete Column
            </button>

            {/* Table Operations */}
            <div className="px-4 py-2 text-xs font-bold text-gray-600 border-b border-red-300">
              Table
            </div>
            <button
              onClick={() => {
                if (confirm('Delete entire table?')) {
                  editor?.chain().focus().deleteTable().run();
                }
                setContextMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            >
              Delete Table
            </button>
          </div>
        )}

        {/* Dialogs */}
        <LinkDialog
          open={linkDialogOpen}
          onClose={() => setLinkDialogOpen(false)}
          onInsert={(url: string, text: string) => {
            if (editor) {
              if (text) {
                // Create a proper TipTap link with text and URL
                editor.chain().focus().insertContent({
                  type: 'text',
                  text: text,
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href: url,
                        target: '_blank',
                        rel: 'noopener noreferrer'
                      }
                    }
                  ]
                }).run();
              } else {
                // If no text provided, just set link on current selection
                editor.chain().focus().setLink({ href: url }).run();
              }
            }
            setLinkDialogOpen(false);
          }}
        />

        <ImageDialog
          open={imageDialogOpen}
          onClose={() => setImageDialogOpen(false)}
          onInsert={(url: string, alt: string) => {
            if (editor) {
              editor.chain().focus().setImage({ src: url, alt }).run();
            }
            setImageDialogOpen(false);
          }}
        />
        
        {/* Math Dialog */}
        <MathDialog
          open={mathDialogOpen}
          onOpenChange={setMathDialogOpen}
          onInsert={handleMathInsert}
        />
      </div>
    </TooltipProvider>
  );
}