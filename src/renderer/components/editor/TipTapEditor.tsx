import React, { useRef, useState, useLayoutEffect } from 'react';
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
import { HardBreak } from '@tiptap/extension-hard-break';
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
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4,
  Heading5,
  Heading6,
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
  Plus,
  Minus,
  Trash2,
  ChevronDown,
  Minus as HorizontalRuleIcon
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
      // Configure marked for GFM support
      marked.setOptions({
        gfm: true,
        breaks: false,
        pedantic: false,
        smartypants: false,
      });

      return marked(markdown);
    } catch (error) {
      console.error('Error converting markdown to HTML:', error);
      return markdown; // Fallback to original content
    }
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
        hardBreak: false, // Use custom HardBreak extension
        horizontalRule: false, // Use custom HorizontalRule extension
        // Enable strikethrough (GFM)
        strike: true,
      }),
      
      // Custom extensions for better control
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6], // Support all heading levels
      }),
      BulletList,
      OrderedList,
      ListItem,
      TaskList,
      TaskItem,
      Superscript,
      Subscript,
      HardBreak,
      HorizontalRule,
      HeadingIdExtension,
      
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
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: activeDocument?.content ? markdownToHtml(activeDocument.content) : '',
    autofocus: 'start', // Auto-focus at start
    onKeyDown: ({ event }) => {
      // Escape key: clear all formatting
      if (event.key === 'Escape') {
        event.preventDefault();
        editor
          ?.chain()
          .focus()
          .clearNodes()
          .clearMarks()
          .setParagraph()
          .run();
        return true;
      }
    },
    onUpdate: ({ editor }) => {
      if (activeDocument) {
        const html = editor.getHTML();
        const markdown = htmlToMarkdown(html);
        updateDocument(activeDocument.id, { content: markdown });
        markAsModified(activeDocument.id);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Update heading state for navigation
      const { from } = editor.state.selection;
      const $from = editor.state.doc.resolve(from);
      const headingNode = $from.node($from.depth);
      
      if (headingNode && headingNode.type.name === 'heading') {
        const headingId = headingNode.attrs.id;
        if (headingId) {
          setScrollToHeadingHandler(headingId);
        }
      }
    },
  });

  // State to force toolbar re-render when editor state changes
  const [, forceUpdate] = React.useState({});
  
  // Update toolbar when editor state changes
  React.useEffect(() => {
    if (!editor) return;
    
    const updateToolbar = () => {
      forceUpdate({});
    };
    
    editor.on('selectionUpdate', updateToolbar);
    editor.on('transaction', updateToolbar);
    
    return () => {
      editor.off('selectionUpdate', updateToolbar);
      editor.off('transaction', updateToolbar);
    };
  }, [editor]);

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

  // Toolbar button configuration - memoized to update when editor state changes
  const toolbarButtons = React.useMemo(() => [
    {
      id: 'bold',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('bold') ? 'bg-blue-200 text-blue-800' : ''
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
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('italic') ? 'bg-blue-200 text-blue-800' : ''
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
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('strike') ? 'bg-blue-200 text-blue-800' : ''
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
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('code') ? 'bg-blue-200 text-blue-800' : ''
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
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('bulletList') ? 'bg-blue-200 text-blue-800' : ''
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
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('orderedList') ? 'bg-blue-200 text-blue-800' : ''
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
      id: 'taskList',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleTaskList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('taskList') ? 'bg-blue-200 text-blue-800' : ''
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
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('blockquote') ? 'bg-blue-200 text-blue-800' : ''
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
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('codeBlock') ? 'bg-blue-200 text-blue-800' : ''
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
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('link') ? 'bg-blue-200 text-blue-800' : ''
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
              className="p-2 rounded hover:bg-gray-100"
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
              onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className="p-2 rounded hover:bg-gray-100"
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
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('superscript') ? 'bg-blue-200 text-blue-800' : ''
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
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('subscript') ? 'bg-blue-200 text-blue-800' : ''
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
    {
      id: 'clearFormatting',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().clearMarks().run()}
              className="p-2 rounded hover:bg-gray-100 bg-yellow-100 text-yellow-800"
            >
              <span className="text-xs font-semibold">Clear</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear all inline formatting</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'normalText',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => 
                editor
                  ?.chain()
                  .focus()
                  .clearNodes()
                  .clearMarks()
                  .setParagraph()
                  .run()
              }
              className="p-2 rounded hover:bg-gray-100 bg-green-100 text-green-800"
            >
              <span className="text-xs font-semibold">Normal</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset to normal paragraph text</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
  ], [editor, forceUpdate]); // Re-create when editor state changes

  // Filter out null components (like tableCommands when not in table)
  const visibleToolbarButtons = toolbarButtons.filter(button => button.component !== null);

  if (!editor) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-white">
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
            className="h-full p-4 prose prose-sm max-w-none focus:outline-none"
            onWheel={(e) => {
              // Allow scrolling without preventing default
            }}
          />
        </div>

        {/* Dialogs */}
        <LinkDialog
          open={linkDialogOpen}
          onClose={() => setLinkDialogOpen(false)}
          onInsert={(url: string, text: string) => {
            if (editor) {
              if (text) {
                editor.chain().focus().insertContent(`[${text}](${url})`).run();
              } else {
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