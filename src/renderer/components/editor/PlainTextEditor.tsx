import * as React from 'react';
import { EditorState, Compartment, Extension } from '@codemirror/state';
import {
  EditorView,
  keymap,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { markdown } from '@codemirror/lang-markdown';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { editorService } from '@/services/editorService';

export function PlainTextEditor() {
  const editorContainerRef = React.useRef<HTMLDivElement | null>(null);
  const viewRef = React.useRef<EditorView | null>(null);
  const lastDocumentId = React.useRef<string | null>(null);
  const isUpdatingFromDocument = React.useRef(false);
  const configurationCompartment = React.useRef(new Compartment());

  const activeDocument = useDocumentStore((state) => {
    if (!state.activeDocumentId) return null;
    return state.documents.get(state.activeDocumentId) || null;
  });
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);

  const updateDocumentRef = React.useRef(updateDocument);
  const markAsModifiedRef = React.useRef(markAsModified);

  React.useEffect(() => {
    updateDocumentRef.current = updateDocument;
  }, [updateDocument]);

  React.useEffect(() => {
    markAsModifiedRef.current = markAsModified;
  }, [markAsModified]);

  const updateListenerExtensionRef = React.useRef<Extension>(
    EditorView.updateListener.of((update) => {
      if (!update.docChanged || !lastDocumentId.current || isUpdatingFromDocument.current) {
        return;
      }

      const markdownContent = update.state.doc.toString();
      updateDocumentRef.current(lastDocumentId.current, { content: markdownContent });
      markAsModifiedRef.current(lastDocumentId.current);
    })
  );

  const buildExtensions = React.useCallback((): Extension[] => {
    const extensions: Extension[] = [
      highlightActiveLineGutter(),
      lineNumbers(),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      keymap.of([
        indentWithTab,
        ...defaultKeymap,
        ...historyKeymap,
      ]),
      markdown(),
      EditorView.lineWrapping,
    ];

    extensions.push(
      EditorView.theme({
        '&': {
          height: '100%',
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          fontSize: `${settings.editor.fontSize}px`,
          backgroundColor: 'transparent',
          color: 'hsl(var(--foreground))',
        },
        '.cm-content': {
          fontFamily: '"Courier New", Courier, monospace',
          fontWeight: 'normal',
          textDecoration: 'none',
        },
        '.cm-line': {
          fontFamily: '"Courier New", Courier, monospace',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
        },
        '.cm-gutters': {
          fontFamily: '"Courier New", Courier, monospace',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'hsl(var(--muted-foreground))',
        },
        '.cm-scroller': {
          overflow: 'auto',
          maxHeight: '100%',
          flexGrow: 1,
        },
        '.cm-line span': {
          fontWeight: 'inherit',
          fontStyle: 'inherit',
          textDecoration: 'none',
        },
        '.cm-line span.cm-link, .cm-line span.cm-url, .cm-line span.cm-formatting-link': {
          color: 'inherit',
          textDecoration: 'none',
        },
        '.cm-line span.cm-strong': {
          fontWeight: 'inherit',
        },
        '.cm-line span.cm-em': {
          fontStyle: 'normal',
        },
        '.cm-line a': {
          color: 'inherit',
          textDecoration: 'none',
          pointerEvents: 'none',
          cursor: 'default',
        },
      })
    );

    return extensions;
  }, [settings.editor.fontSize]);

  const saveCurrentContent = React.useCallback(() => {
    const view = viewRef.current;
    const documentId = lastDocumentId.current;
    if (!view || !documentId) return;

    const markdownContent = view.state.doc.toString();
    updateDocumentRef.current(documentId, { content: markdownContent });
  }, []);

  React.useEffect(() => {
    editorService.setSaveCurrentContentCallback(saveCurrentContent);
    return () => {
      editorService.clearSaveCallback();
    };
  }, [saveCurrentContent]);

  React.useEffect(() => {
    if (!editorContainerRef.current || viewRef.current) {
      return undefined;
    }

    const initialState = EditorState.create({
      doc: activeDocument?.content ?? '',
      extensions: [
        configurationCompartment.current.of(buildExtensions()),
        updateListenerExtensionRef.current,
      ],
    });

    const view = new EditorView({
      state: initialState,
      parent: editorContainerRef.current,
    });

    viewRef.current = view;
    lastDocumentId.current = activeDocument?.id ?? null;

    return () => {
      if (viewRef.current && lastDocumentId.current) {
        saveCurrentContent();
      }
      view.destroy();
      viewRef.current = null;
      lastDocumentId.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (!viewRef.current) return;
    const newExtensions = buildExtensions();
    viewRef.current.dispatch({
      effects: configurationCompartment.current.reconfigure(newExtensions),
    });
  }, [buildExtensions]);

  React.useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    if (!activeDocument) {
      isUpdatingFromDocument.current = true;
      const length = view.state.doc.length;
      view.dispatch({
        changes: { from: 0, to: length, insert: '' },
      });
      isUpdatingFromDocument.current = false;
      lastDocumentId.current = null;
      return;
    }

    const previousDocumentId = lastDocumentId.current;
    if (previousDocumentId && previousDocumentId !== activeDocument.id) {
      saveCurrentContent();
    }

    const currentContent = view.state.doc.toString();
    if (currentContent !== activeDocument.content) {
      isUpdatingFromDocument.current = true;
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: activeDocument.content,
        },
      });
      isUpdatingFromDocument.current = false;
    }

    lastDocumentId.current = activeDocument.id;
  }, [activeDocument?.id, activeDocument?.content, saveCurrentContent]);

  React.useEffect(() => {
    return () => {
      if (viewRef.current && lastDocumentId.current) {
        saveCurrentContent();
      }
    };
  }, [saveCurrentContent]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div
        ref={editorContainerRef}
        className="flex-1 min-h-0 rounded-md border border-border bg-background"
      />
    </div>
  );
}
