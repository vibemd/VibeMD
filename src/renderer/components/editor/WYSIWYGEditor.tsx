import { useEffect, useState, useRef } from 'react';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function WYSIWYGEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);
  const [htmlContent, setHtmlContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Convert markdown to HTML for display
  useEffect(() => {
    if (activeDocument?.content && !isEditing) {
      remark()
        .use(remarkHtml)
        .process(activeDocument.content)
        .then((result) => {
          setHtmlContent(String(result));
        })
        .catch((error) => {
          console.error('Error converting markdown to HTML:', error);
          setHtmlContent(activeDocument.content);
        });
    }
  }, [activeDocument?.content, isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (activeDocument && editorRef.current) {
      const newContent = editorRef.current.textContent || '';
      if (newContent !== activeDocument.content) {
        updateDocument(activeDocument.id, { content: newContent });
        markAsModified(activeDocument.id);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br>');
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertMarkdown = (markdown: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(markdown));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    icon: Icon, 
    title, 
    disabled = false 
  }: { 
    onClick: () => void; 
    icon: any; 
    title: string; 
    disabled?: boolean;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="h-8 w-8 p-0"
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

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

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="border-b bg-background px-4 py-2">
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => insertMarkdown('# ')}
            icon={Heading1}
            title="Heading 1"
            disabled={!isEditing}
          />
          <ToolbarButton
            onClick={() => insertMarkdown('## ')}
            icon={Heading2}
            title="Heading 2"
            disabled={!isEditing}
          />
          <ToolbarButton
            onClick={() => insertMarkdown('### ')}
            icon={Heading3}
            title="Heading 3"
            disabled={!isEditing}
          />
          
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          <ToolbarButton
            onClick={() => execCommand('bold')}
            icon={Bold}
            title="Bold"
            disabled={!isEditing}
          />
          <ToolbarButton
            onClick={() => execCommand('italic')}
            icon={Italic}
            title="Italic"
            disabled={!isEditing}
          />
          <ToolbarButton
            onClick={() => execCommand('underline')}
            icon={Underline}
            title="Underline"
            disabled={!isEditing}
          />
          
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          <ToolbarButton
            onClick={() => insertMarkdown('- ')}
            icon={List}
            title="Bullet List"
            disabled={!isEditing}
          />
          <ToolbarButton
            onClick={() => insertMarkdown('1. ')}
            icon={ListOrdered}
            title="Numbered List"
            disabled={!isEditing}
          />
          <ToolbarButton
            onClick={() => insertMarkdown('> ')}
            icon={Quote}
            title="Quote"
            disabled={!isEditing}
          />
          
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          <ToolbarButton
            onClick={() => insertMarkdown('`')}
            icon={Code}
            title="Inline Code"
            disabled={!isEditing}
          />
          <ToolbarButton
            onClick={() => insertMarkdown('[Link](url)')}
            icon={Link}
            title="Link"
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1" style={{ padding: '1rem' }}>
        {isEditing ? (
          <div
            ref={editorRef}
            contentEditable
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="prose prose-sm max-w-none outline-none min-h-full focus:outline-none"
            style={{
              fontSize: `${settings?.editor?.fontSize ?? 14}px`,
              fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
              minHeight: '100%',
            }}
            suppressContentEditableWarning={true}
          >
            {activeDocument.content}
          </div>
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            className="prose prose-sm max-w-none cursor-text hover:bg-muted/20 transition-colors rounded p-2"
            style={{
              fontSize: `${settings?.editor?.fontSize ?? 14}px`,
              fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
              minHeight: '100%',
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
        {!isEditing && (
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Double-click to edit • Use toolbar for formatting
          </div>
        )}
      </div>
    </div>
  );
}
