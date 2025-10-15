import React, { useCallback, useMemo, useState } from 'react';
import { createEditor, Descendant, Editor, Transforms, Text, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { remark } from 'remark';
import remarkSlate from 'remark-slate-transformer';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

// Custom types for our editor
type CustomElement = {
  type: 'paragraph' | 'heading-one' | 'heading-two' | 'heading-three' | 'heading-four' | 'heading-five' | 'heading-six' | 'block-quote' | 'bulleted-list' | 'numbered-list' | 'list-item' | 'code-block';
  children: CustomText[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// Toolbar component
const Toolbar = ({ editor }: { editor: Editor }) => {
  const isMarkActive = (format: string) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isBlockActive = (format: string) => {
    const [match] = Editor.nodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  };

  const toggleBlock = (format: string) => {
    const isActive = isBlockActive(format);
    const isList = ['bulleted-list', 'numbered-list'].includes(format);

    Transforms.unwrapNodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && ['bulleted-list', 'numbered-list'].includes(n.type),
      split: true,
    });

    let newProperties: Partial<SlateElement>;
    if (isActive) {
      newProperties = { type: 'paragraph' };
    } else if (isList) {
      newProperties = { type: format };
    } else {
      newProperties = { type: format };
    }

    Transforms.setNodes<SlateElement>(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: 'list-item', children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  return (
    <div className="border-b border-gray-200 p-2 flex gap-2 flex-wrap">
      {/* Text formatting */}
      <button
        className={`px-2 py-1 rounded text-sm ${isMarkActive('bold') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark('bold');
        }}
      >
        <strong>B</strong>
      </button>
      <button
        className={`px-2 py-1 rounded text-sm ${isMarkActive('italic') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark('italic');
        }}
      >
        <em>I</em>
      </button>
      <button
        className={`px-2 py-1 rounded text-sm ${isMarkActive('underline') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark('underline');
        }}
      >
        <u>U</u>
      </button>
      <button
        className={`px-2 py-1 rounded text-sm ${isMarkActive('code') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark('code');
        }}
      >
        {'</>'}
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Block formatting */}
      <button
        className={`px-2 py-1 rounded text-sm ${isBlockActive('heading-one') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock('heading-one');
        }}
      >
        H1
      </button>
      <button
        className={`px-2 py-1 rounded text-sm ${isBlockActive('heading-two') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock('heading-two');
        }}
      >
        H2
      </button>
      <button
        className={`px-2 py-1 rounded text-sm ${isBlockActive('heading-three') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock('heading-three');
        }}
      >
        H3
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      <button
        className={`px-2 py-1 rounded text-sm ${isBlockActive('bulleted-list') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock('bulleted-list');
        }}
      >
        • List
      </button>
      <button
        className={`px-2 py-1 rounded text-sm ${isBlockActive('numbered-list') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock('numbered-list');
        }}
      >
        1. List
      </button>
      <button
        className={`px-2 py-1 rounded text-sm ${isBlockActive('block-quote') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock('block-quote');
        }}
      >
        " Quote
      </button>
      <button
        className={`px-2 py-1 rounded text-sm ${isBlockActive('code-block') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock('code-block');
        }}
      >
        {'</>'} Code
      </button>
    </div>
  );
};

// Element renderer
const Element = ({ attributes, children, element }: any) => {
  switch (element.type) {
    case 'heading-one':
      return <h1 {...attributes} className="text-3xl font-bold mb-4">{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes} className="text-2xl font-bold mb-3">{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes} className="text-xl font-bold mb-2">{children}</h3>;
    case 'heading-four':
      return <h4 {...attributes} className="text-lg font-bold mb-2">{children}</h4>;
    case 'heading-five':
      return <h5 {...attributes} className="text-base font-bold mb-1">{children}</h5>;
    case 'heading-six':
      return <h6 {...attributes} className="text-sm font-bold mb-1">{children}</h6>;
    case 'block-quote':
      return <blockquote {...attributes} className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes} className="list-disc list-inside my-4">{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes} className="list-decimal list-inside my-4">{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'code-block':
      return <pre {...attributes} className="bg-gray-100 p-4 rounded my-4 overflow-x-auto"><code>{children}</code></pre>;
    default:
      return <p {...attributes} className="mb-2">{children}</p>;
  }
};

// Leaf renderer
const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.code) {
    children = <code className="bg-gray-100 px-1 rounded text-sm">{children}</code>;
  }
  return <span {...attributes}>{children}</span>;
};

// Markdown conversion utilities
const markdownToSlate = (markdown: string): Descendant[] => {
  const processor = remark()
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkSlate);

  try {
    const result = processor.processSync(markdown);
    return result.result as Descendant[];
  } catch (error) {
    console.error('Error converting markdown to Slate:', error);
    // Fallback to simple paragraph
    return [
      {
        type: 'paragraph',
        children: [{ text: markdown }],
      },
    ];
  }
};

const slateToMarkdown = (nodes: Descendant[]): string => {
  // Simple conversion - in a real implementation, you'd want a more robust converter
  const convertNode = (node: any): string => {
    if (Text.isText(node)) {
      let text = node.text;
      if (node.bold) text = `**${text}**`;
      if (node.italic) text = `*${text}*`;
      if (node.underline) text = `<u>${text}</u>`;
      if (node.code) text = `\`${text}\``;
      return text;
    }

    const children = node.children.map(convertNode).join('');
    
    switch (node.type) {
      case 'heading-one':
        return `# ${children}\n\n`;
      case 'heading-two':
        return `## ${children}\n\n`;
      case 'heading-three':
        return `### ${children}\n\n`;
      case 'heading-four':
        return `#### ${children}\n\n`;
      case 'heading-five':
        return `##### ${children}\n\n`;
      case 'heading-six':
        return `###### ${children}\n\n`;
      case 'block-quote':
        return `> ${children}\n\n`;
      case 'bulleted-list':
        return `${children}\n`;
      case 'numbered-list':
        return `${children}\n`;
      case 'list-item':
        return `- ${children}\n`;
      case 'code-block':
        return `\`\`\`\n${children}\n\`\`\`\n\n`;
      default:
        return `${children}\n\n`;
    }
  };

  return nodes.map(convertNode).join('');
};

export function SlateWYSIWYGEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Convert markdown to Slate when document changes
  const [slateValue, setSlateValue] = useState<Descendant[]>(() => {
    if (activeDocument?.content) {
      return markdownToSlate(activeDocument.content);
    }
    return [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ];
  });

  // Update Slate value when document content changes externally
  React.useEffect(() => {
    if (activeDocument?.content) {
      const newSlateValue = markdownToSlate(activeDocument.content);
      setSlateValue(newSlateValue);
    }
  }, [activeDocument?.content]);

  const handleChange = useCallback((value: Descendant[]) => {
    setSlateValue(value);
    
    // Convert to markdown and update document
    if (activeDocument) {
      const markdown = slateToMarkdown(value);
      updateDocument(activeDocument.id, { content: markdown });
      markAsModified(activeDocument.id);
    }
  }, [activeDocument, updateDocument, markAsModified]);

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
      <Slate
        editor={editor}
        initialValue={slateValue}
        value={slateValue}
        onChange={handleChange}
      >
        <Toolbar editor={editor} />
        <div className="flex-1 overflow-auto">
          <Editable
            className="p-4 min-h-full"
            style={{
              fontSize: `${settings?.editor?.fontSize ?? 14}px`,
              fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
            }}
            renderElement={Element}
            renderLeaf={Leaf}
            placeholder="Start writing..."
            spellCheck
            autoFocus
          />
        </div>
      </Slate>
    </div>
  );
}
