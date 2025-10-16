import React, { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { marked } from 'marked';
import TurndownService from 'turndown';
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
  ChevronDown
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function TipTapEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);

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
      // Use the synchronous version of marked with GFM support
      const result = marked(markdown, {
        breaks: true,
        gfm: true,
      });
      return typeof result === 'string' ? result : String(result);
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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
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
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Superscript,
      Subscript,
    ],
    content: activeDocument?.content ? markdownToHtml(activeDocument.content) : '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (activeDocument) {
        const markdownContent = htmlToMarkdown(html);
        if (markdownContent !== activeDocument.content) {
          updateDocument(activeDocument.id, { content: markdownContent });
          markAsModified(activeDocument.id);
        }
      }
    },
  });

  // Helper function to get current heading
  const getCurrentHeading = () => {
    if (editor?.isActive('heading', { level: 1 })) return 'heading1';
    if (editor?.isActive('heading', { level: 2 })) return 'heading2';
    if (editor?.isActive('heading', { level: 3 })) return 'heading3';
    if (editor?.isActive('heading', { level: 4 })) return 'heading4';
    if (editor?.isActive('heading', { level: 5 })) return 'heading5';
    if (editor?.isActive('heading', { level: 6 })) return 'heading6';
    return 'paragraph';
  };

  // Handle heading change
  const handleHeadingChange = (value: string) => {
    if (value === 'paragraph') {
      editor?.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(value.replace('heading', '')) as 1 | 2 | 3 | 4 | 5 | 6;
      editor?.chain().focus().toggleHeading({ level }).run();
    }
  };

  // Handle table command
  const handleTableCommand = (command: string) => {
    switch (command) {
      case 'insertRowBefore':
        editor?.chain().focus().addRowBefore().run();
        break;
      case 'insertRowAfter':
        editor?.chain().focus().addRowAfter().run();
        break;
      case 'insertColumnBefore':
        editor?.chain().focus().addColumnBefore().run();
        break;
      case 'insertColumnAfter':
        editor?.chain().focus().addColumnAfter().run();
        break;
      case 'deleteRow':
        editor?.chain().focus().deleteRow().run();
        break;
      case 'deleteColumn':
        editor?.chain().focus().deleteColumn().run();
        break;
      case 'deleteTable':
        editor?.chain().focus().deleteTable().run();
        break;
    }
  };

  // Toolbar button configuration
  const toolbarButtons = [
    {
      id: 'bold',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('bold') ? 'bg-gray-200' : ''
              }`}
            >
              <Bold className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold (Ctrl+B)</p>
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
                editor?.isActive('italic') ? 'bg-gray-200' : ''
              }`}
            >
              <Italic className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic (Ctrl+I)</p>
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
                editor?.isActive('strike') ? 'bg-gray-200' : ''
              }`}
            >
              <Strikethrough className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Strikethrough</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'separator1',
      component: <div className="w-px bg-gray-300 mx-1" />,
    },
    {
      id: 'headings',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Select value={getCurrentHeading()} onValueChange={handleHeadingChange}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Select heading" />
              </SelectTrigger>
              <SelectContent>
                {headingLevels.map((heading) => (
                  <SelectItem key={heading.value} value={heading.value}>
                    {heading.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipTrigger>
          <TooltipContent>
            <p>Select heading level (H1-H6) or Normal text</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'separator2',
      component: <div className="w-px bg-gray-300 mx-1" />,
    },
    {
      id: 'bulletList',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('bulletList') ? 'bg-gray-200' : ''
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
                editor?.isActive('orderedList') ? 'bg-gray-200' : ''
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
      id: 'separator3',
      component: <div className="w-px bg-gray-300 mx-1" />,
    },
    {
      id: 'codeBlock',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('codeBlock') ? 'bg-gray-200' : ''
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
      id: 'blockquote',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('blockquote') ? 'bg-gray-200' : ''
              }`}
            >
              <Quote className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Blockquote</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'separator4',
      component: <div className="w-px bg-gray-300 mx-1" />,
    },
    {
      id: 'link',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                editor?.chain().focus().setLink({ href: 'https://example.com' }).run();
              }}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('link') ? 'bg-gray-200' : ''
              }`}
            >
              <LinkIcon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Link (placeholder)</p>
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
              onClick={() => {
                editor?.chain().focus().setImage({ src: 'https://via.placeholder.com/300x200' }).run();
              }}
              className="p-2 rounded hover:bg-gray-100"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Image (placeholder)</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'separator5',
      component: <div className="w-px bg-gray-300 mx-1" />,
    },
    {
      id: 'table',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                editor?.chain().focus().insertTable({ 
                  rows: 3, 
                  cols: 3, 
                  withHeaderRow: true 
                }).run();
              }}
              className="p-2 rounded hover:bg-gray-100"
            >
              <TableIcon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Table (3x3)</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: 'tableActions',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Select onValueChange={handleTableCommand}>
              <SelectTrigger className="w-[160px] h-8">
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
            <p>Table operations (insert/delete rows/columns)</p>
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
                editor?.isActive('taskList') ? 'bg-gray-200' : ''
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
      id: 'separator6',
      component: <div className="w-px bg-gray-300 mx-1" />,
    },
    {
      id: 'superscript',
      component: (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor?.chain().focus().toggleSuperscript().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('superscript') ? 'bg-gray-200' : ''
              }`}
            >
              <SuperscriptIcon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Superscript</p>
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
                editor?.isActive('subscript') ? 'bg-gray-200' : ''
              }`}
            >
              <SubscriptIcon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Subscript</p>
          </TooltipContent>
        </Tooltip>
      ),
      width: 40,
      priority: 3
    }
  ];

  // Simple static toolbar (no responsive behavior for now)
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Update editor content when document changes
  React.useEffect(() => {
    if (editor && activeDocument) {
      const htmlContent = markdownToHtml(activeDocument.content);
      const currentHtml = editor.getHTML();
      // Only update if the content is significantly different (not just whitespace)
      if (currentHtml.trim() !== htmlContent.trim()) {
        editor.commands.setContent(htmlContent);
      }
    }
  }, [editor, activeDocument?.id]); // Only depend on document ID, not content

  // Add test content for scrolling when no document is open
  React.useEffect(() => {
    if (editor && !activeDocument) {
      const testContent = Array.from({ length: 50 }, (_, i) => 
        `<p>This is test paragraph ${i + 1} to ensure we have enough content to trigger scrolling. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`
      ).join('');
      editor.commands.setContent(testContent);
    }
  }, [editor, activeDocument]);

  if (!activeDocument) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div style={{ textAlign: 'center' }} className="space-y-4">
          <div style={{ fontSize: '3.75rem', color: 'hsl(var(--muted-foreground))' }}>📝</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'hsl(var(--muted-foreground))' }}>No document open</h2>
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>Create or open a document to start editing</p>
        </div>
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Simple Static Toolbar */}
      <TooltipProvider delayDuration={300} skipDelayDuration={100}>
        <div ref={toolbarRef} className="border-b p-2 flex gap-2 items-center flex-wrap">
          {/* All toolbar buttons */}
          {toolbarButtons.map((button) => (
            <div key={button.id}>
              {button.component}
            </div>
          ))}
        </div>
      </TooltipProvider>

      {/* Editor Content */}
      <div 
        className="flex-1 tiptap-scroll-container"
        style={{ 
          height: 'calc(100vh - 200px)', // Fixed height calculation
          overflow: 'auto',
          position: 'relative'
        }}
        onWheel={(e) => {
          // Prevent default to ensure our handler works
          e.preventDefault();
          const container = e.currentTarget;
          container.scrollTop += e.deltaY;
        }}
      >
        <div style={{ 
          minHeight: 'calc(100% + 100px)', // Ensure content exceeds container
          paddingBottom: '2rem'
        }}>
          <EditorContent
            editor={editor}
            style={{
              fontSize: `${settings?.editor?.fontSize ?? 14}px`,
              fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
              outline: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
