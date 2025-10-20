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
import { Extension } from '@tiptap/core';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useNavigationStore } from '@/services/navigationService';
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
  Outdent
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function TipTapEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
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
      const html = marked.parse(markdown, {
        gfm: true,
        breaks: false,
        pedantic: false,
      }) as string;
      
      // Add heading IDs for navigation
      const htmlWithIds = html.replace(/<h([1-6])>(.*?)<\/h[1-6]>/g, (match: string, level: string, content: string) => {
        // Extract text content from HTML (remove any HTML tags)
        const textContent = content.replace(/<[^>]*>/g, '');
        const id = generateHeadingId(textContent);
        return `<h${level} id="${id}">${content}</h${level}>`;
      });
      
      return htmlWithIds;
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

      // Add table support
      turndownService.addRule('table', {
        filter: 'table',
        replacement: function (content, node) {
          const table = node as HTMLTableElement;
          const rows = Array.from(table.querySelectorAll('tr'));
          if (rows.length === 0) return '';
          
          let markdown = '\n';
          
          // Process each row
          rows.forEach((row, rowIndex) => {
            const cells = Array.from(row.querySelectorAll('td, th'));
            if (cells.length === 0) return;
            
            const cellContents = cells.map(cell => {
              const cellText = cell.textContent || '';
              return cellText.replace(/\|/g, '\\|').trim();
            });
            
            markdown += '| ' + cellContents.join(' | ') + ' |\n';
            
            // Add separator row after header row
            if (rowIndex === 0) {
              const separator = cells.map(() => '---').join(' | ');
              markdown += '| ' + separator + ' |\n';
            }
          });
          
          return markdown + '\n';
        }
      });

      return turndownService.turndown(html);
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
      
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: activeDocument?.content ? markdownToHtml(activeDocument.content) : '',
    autofocus: 'start', // Auto-focus at start
    onUpdate: ({ editor }) => {
      if (activeDocument) {
        isUpdatingFromEditor.current = true;
        const html = editor.getHTML();
        console.log('[TipTap onUpdate] HTML:', html);
        const markdown = htmlToMarkdown(html);
        console.log('[TipTap onUpdate] Markdown:', markdown);
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

  // Update editor content when active document changes
  React.useEffect(() => {
    if (!editor) return;

    // If no active document, clear the editor
    if (!activeDocument) {
      console.log('[TipTap setContent] No active document, clearing editor');
      editor.commands.clearContent();
      return;
    }

    // Skip if the update came from the editor itself to prevent circular updates
    if (isUpdatingFromEditor.current) {
      console.log('[TipTap setContent] Skipping - update from editor');
      return;
    }

    const currentContent = editor.getHTML();
    const newContent = markdownToHtml(activeDocument.content);

    // Only update if content has actually changed to avoid unnecessary updates
    if (currentContent !== newContent) {
      console.log('[TipTap setContent] Setting new content:', newContent);
      editor.commands.setContent(newContent, { emitUpdate: false });
    }
  }, [editor, activeDocument?.id, activeDocument?.content]);

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
                console.log('[Table] Inserting table');
                editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                console.log('[Table] After insert, isActive:', editor?.isActive('table'));
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
  ], [editor, updateTrigger]); // Re-create when editor state changes

  // Filter out null components (like tableCommands when not in table)
  const visibleToolbarButtons = toolbarButtons.filter(button => button.component !== null);

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
      </div>
    </TooltipProvider>
  );
}