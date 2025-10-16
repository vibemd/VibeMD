import React from 'react';
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
  Trash2
} from 'lucide-react';

export function TipTapEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);

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
        // Add table support
        tableCellPadding: true,
        tableCellSeparator: '|',
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
      // Debounce the update to prevent constant conversion
      setTimeout(() => {
        const html = editor.getHTML();
        if (activeDocument) {
          const markdownContent = htmlToMarkdown(html);
          if (markdownContent !== activeDocument.content) {
            updateDocument(activeDocument.id, { content: markdownContent });
            markAsModified(activeDocument.id);
          }
        }
      }, 500); // 500ms debounce
    },
  });

  // Update editor content when document changes
  React.useEffect(() => {
    if (editor && activeDocument) {
      const htmlContent = markdownToHtml(activeDocument.content);
      if (editor.getHTML() !== htmlContent) {
        editor.commands.setContent(htmlContent);
      }
    }
  }, [editor, activeDocument]);

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
      {/* Simple Toolbar */}
      <div className="border-b p-2 flex gap-2 flex-wrap">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('bold') ? 'bg-gray-200' : ''
          }`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('italic') ? 'bg-gray-200' : ''
          }`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('strike') ? 'bg-gray-200' : ''
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
          }`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
          }`}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('bulletList') ? 'bg-gray-200' : ''
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('orderedList') ? 'bg-gray-200' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('codeBlock') ? 'bg-gray-200' : ''
          }`}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('blockquote') ? 'bg-gray-200' : ''
          }`}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          onClick={() => {
            // For now, insert placeholder link since Electron doesn't support prompt()
            // TODO: Implement custom dialog for link URL input
            editor?.chain().focus().setLink({ href: 'https://example.com' }).run();
          }}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('link') ? 'bg-gray-200' : ''
          }`}
          title="Insert Link (placeholder)"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            // For now, insert placeholder image since Electron doesn't support prompt()
            // TODO: Implement custom dialog for image URL input
            editor?.chain().focus().setImage({ src: 'https://via.placeholder.com/300x200' }).run();
          }}
          className="p-2 rounded hover:bg-gray-100"
          title="Insert Image (placeholder)"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          onClick={() => {
            // For now, use default 3x3 table since Electron doesn't support prompt()
            // TODO: Implement custom dialog for table dimensions
            editor?.chain().focus().insertTable({ 
              rows: 3, 
              cols: 3, 
              withHeaderRow: true 
            }).run();
          }}
          className="p-2 rounded hover:bg-gray-100"
          title="Insert Table (3x3)"
        >
          <TableIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().addRowBefore().run()}
          className="p-2 rounded hover:bg-gray-100"
          title="Add Row Before"
        >
          <Plus className="h-3 w-3" />
        </button>
        <button
          onClick={() => editor?.chain().focus().addRowAfter().run()}
          className="p-2 rounded hover:bg-gray-100"
          title="Add Row After"
        >
          <Plus className="h-3 w-3" />
        </button>
        <button
          onClick={() => editor?.chain().focus().addColumnBefore().run()}
          className="p-2 rounded hover:bg-gray-100"
          title="Add Column Before"
        >
          <Plus className="h-3 w-3" />
        </button>
        <button
          onClick={() => editor?.chain().focus().addColumnAfter().run()}
          className="p-2 rounded hover:bg-gray-100"
          title="Add Column After"
        >
          <Plus className="h-3 w-3" />
        </button>
        <button
          onClick={() => editor?.chain().focus().deleteRow().run()}
          className="p-2 rounded hover:bg-gray-100"
          title="Delete Row"
        >
          <Minus className="h-3 w-3" />
        </button>
        <button
          onClick={() => editor?.chain().focus().deleteColumn().run()}
          className="p-2 rounded hover:bg-gray-100"
          title="Delete Column"
        >
          <Minus className="h-3 w-3" />
        </button>
        <button
          onClick={() => editor?.chain().focus().deleteTable().run()}
          className="p-2 rounded hover:bg-gray-100"
          title="Delete Table"
        >
          <Trash2 className="h-3 w-3" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('taskList') ? 'bg-gray-200' : ''
          }`}
          title="Task List"
        >
          <CheckSquare className="h-4 w-4" />
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          onClick={() => editor?.chain().focus().toggleSuperscript().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('superscript') ? 'bg-gray-200' : ''
          }`}
          title="Superscript"
        >
          <SuperscriptIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleSubscript().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor?.isActive('subscript') ? 'bg-gray-200' : ''
          }`}
          title="Subscript"
        >
          <SubscriptIcon className="h-4 w-4" />
        </button>
      </div>

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
