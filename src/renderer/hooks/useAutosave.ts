import { useEffect, useRef } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { useDocumentStore } from '@/stores/documentStore';
import { editorService } from '@/services/editorService';
import { fileService } from '@/services/fileService';
import { Document } from '@shared/types';

const MINUTES_TO_MS = 60_000;

export function useAutosave() {
  const autosaveEnabled = useSettingsStore((state) => state.settings.general.autosave);
  const autosaveIntervalMinutes = useSettingsStore((state) => state.settings.general.autosaveInterval);
  const defaultSavePath = useSettingsStore((state) => state.settings.files.defaultSavePath);
  const templatesLocation = useSettingsStore((state) => state.settings.files.templatesLocation);
  const markAsSaved = useDocumentStore((state) => state.markAsSaved);
  const updateDocument = useDocumentStore((state) => state.updateDocument);

  const markAsSavedRef = useRef(markAsSaved);
  const updateDocumentRef = useRef(updateDocument);
  const intervalIdRef = useRef<number | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    markAsSavedRef.current = markAsSaved;
  }, [markAsSaved]);

  useEffect(() => {
    updateDocumentRef.current = updateDocument;
  }, [updateDocument]);

  const resolveAutosavePath = (doc: Document) => {
    const basePath = doc.isTemplate ? templatesLocation : defaultSavePath;
    if (!basePath) {
      return null;
    }

    const usesBackslash = basePath.includes('\\') && !basePath.includes('/');
    const separator = usesBackslash ? '\\' : '/';
    const normalizedBase = basePath.endsWith(separator) ? basePath : `${basePath}${separator}`;
    const sanitizedFilename = doc.filename.replace(/[\\/]+/g, '_');

    return `${normalizedBase}${sanitizedFilename}`;
  };

  useEffect(() => {
    const clearExistingInterval = () => {
      if (intervalIdRef.current !== null) {
        window.clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };

    if (!autosaveEnabled) {
      clearExistingInterval();
      return;
    }

    const normalizedInterval = Number.isFinite(autosaveIntervalMinutes)
      ? Math.max(1, autosaveIntervalMinutes ?? 5)
      : 5;
    const intervalMs = normalizedInterval * MINUTES_TO_MS;

    const performAutosave = async () => {
      if (savingRef.current) {
        return;
      }

      const state = useDocumentStore.getState();
      const documents = Array.from(state.documents.values());
      const modifiedDocs = documents.filter(
        (doc) => doc.isModified
      );

      if (modifiedDocs.length === 0) {
        return;
      }

      savingRef.current = true;

      try {
        editorService.saveCurrentContent();

        // Capture the latest state after pushing editor content
        const latestState = useDocumentStore.getState();
        const latestDocuments = Array.from(latestState.documents.values());
        const docsToPersist = latestDocuments.filter(
          (doc) => doc.isModified
        );

        for (const doc of docsToPersist) {
          let targetFilepath = doc.filepath;

          if (!targetFilepath) {
            targetFilepath = resolveAutosavePath(doc);
            if (!targetFilepath) {
              console.warn('[Autosave] Skipping document - no autosave path configured:', doc.filename);
              continue;
            }
          }

          try {
            const success = await fileService.saveFile(targetFilepath, doc.content);
            if (success) {
              if (!doc.filepath) {
                updateDocumentRef.current(doc.id, { filepath: targetFilepath });
              }
              markAsSavedRef.current(doc.id);
              console.info('[Autosave] Saved document:', doc.filename);
            }
          } catch (error) {
            console.error('[Autosave] Failed to save document:', doc.filename, error);
          }
        }
      } finally {
        savingRef.current = false;
      }
    };

    clearExistingInterval();

    intervalIdRef.current = window.setInterval(performAutosave, intervalMs);
    // Run once immediately to catch recent edits without waiting for the interval
    void performAutosave();

    return () => {
      clearExistingInterval();
    };
  }, [autosaveEnabled, autosaveIntervalMinutes, defaultSavePath, templatesLocation]);
}
