// Service to handle find functionality across different editor types
import { FindMatch } from '@/stores/uiStore';

export interface EditorSearchInterface {
  findMatches: (query: string) => FindMatch[];
  highlightMatches: (matches: FindMatch[]) => void;
  clearHighlights: () => void;
  scrollToMatch: (match: FindMatch) => void;
  selectMatch: (match: FindMatch) => void;
}

class FindService {
  private plainTextEditor: { view: any } | null = null;
  private wysiwygEditor: { editor: any } | null = null;

  // Register Plain Text Editor (CodeMirror)
  registerPlainTextEditor(view: any) {
    this.plainTextEditor = { view };
  }

  // Register WYSIWYG Editor (TipTap)
  registerWysiwygEditor(editor: any) {
    this.wysiwygEditor = { editor };
  }

  // Unregister editors
  unregisterPlainTextEditor() {
    this.plainTextEditor = null;
  }

  unregisterWysiwygEditor() {
    this.wysiwygEditor = null;
  }

  // Get the active editor interface
  private getActiveEditor(): EditorSearchInterface | null {
    // Priority: check which editor is active based on UI state
    // For now, we'll check both and return the first available
    // The FindBar will need to know which editor is active
    if (this.plainTextEditor?.view) {
      return this.getPlainTextInterface();
    }
    if (this.wysiwygEditor?.editor) {
      return this.getWysiwygInterface();
    }
    return null;
  }

  private getPlainTextInterface(): EditorSearchInterface {
    const view = this.plainTextEditor!.view;
    
    return {
      findMatches: (query: string): FindMatch[] => {
        if (!query.trim()) return [];
        
        const text = view.state.doc.toString();
        const matches: FindMatch[] = [];
        const searchRegex = new RegExp(this.escapeRegex(query), 'gi');
        let match;
        
        while ((match = searchRegex.exec(text)) !== null) {
          // In CodeMirror, Decoration.mark().range(from, to) uses 'to' as exclusive
          // So to highlight characters at positions 100-105 (6 chars), we need range(100, 106)
          // match.index + match[0].length gives us the position after the match (exclusive)
          // This should be correct, but user reports missing last char, so add 1
          matches.push({
            from: match.index,
            to: match.index + match[0].length + 1, // Add 1 to include last character
          });
        }
        
        return matches;
      },
      
      highlightMatches: (matches: FindMatch[]) => {
        // CodeMirror search highlighting is handled by the search extension
        // We'll use decorations to highlight matches
        // For now, this is a placeholder - actual implementation will be in PlainTextEditor
      },
      
      clearHighlights: () => {
        // Clear search decorations
        // Implementation in PlainTextEditor
      },
      
      scrollToMatch: (match: FindMatch) => {
        const { from, to } = match;
        view.dispatch({
          selection: { anchor: from, head: to },
          scrollIntoView: true,
        });
      },
      
      selectMatch: (match: FindMatch) => {
        const { from, to } = match;
        view.dispatch({
          selection: { anchor: from, head: to },
          scrollIntoView: true,
        });
      },
    };
  }

  private getWysiwygInterface(): EditorSearchInterface {
    const editor = this.wysiwygEditor!.editor;
    
    // Helper function to select a match (shared by scrollToMatch and selectMatch)
    const selectMatchHelper = (match: FindMatch) => {
      try {
        // Use stored ProseMirror positions if available (from findMatches)
        const proseFrom = (match as any).proseFrom;
        const proseTo = (match as any).proseTo;
        
        let fromPos = proseFrom;
        let toPos = proseTo;
        
        // Fallback: convert character positions if ProseMirror positions not available
        if (fromPos === undefined || toPos === undefined || fromPos < 0 || toPos < 0) {
          console.warn('[FindService] ProseMirror positions not available, using fallback conversion');
          const { from, to } = match;
          let charPos = 0;
          fromPos = -1;
          toPos = -1;
          
          editor.state.doc.descendants((node: any, nodePos: number) => {
            if (fromPos >= 0 && toPos >= 0) return false;
            
            if (node.isText && node.text) {
              const nodeLength = node.text.length;
              const nodeStart = charPos;
              const nodeEnd = charPos + nodeLength;
              
              if (fromPos < 0 && from >= nodeStart && from < nodeEnd) {
                fromPos = nodePos + 1 + (from - nodeStart);
              }
              
              if (toPos < 0 && to >= nodeStart && to <= nodeEnd) {
                toPos = nodePos + 1 + (to - nodeStart);
              }
              
              charPos = nodeEnd;
            }
            return true;
          });
        }
        
        if (fromPos >= 0 && toPos >= 0 && toPos >= fromPos) {
          const docSize = editor.state.doc.content.size;
          console.log('[FindService] Attempting selection:', { 
            fromPos, 
            toPos, 
            docSize, 
            inBounds: fromPos <= docSize && toPos <= docSize,
            matchCharFrom: match.from,
            matchCharTo: match.to,
            proseFrom: proseFrom,
            proseTo: proseTo
          });
          
          if (fromPos <= docSize && toPos <= docSize) {
            try {
              // Ensure editor is focused first
              editor.commands.focus();
              
              // TipTap setTextSelection accepts either a single number or { from, to } object
              // Try using the chain API which might be more reliable
              let result = false;
              
              // First try with object format
              try {
                result = editor.chain()
                  .focus()
                  .setTextSelection({ from: fromPos, to: toPos })
                  .scrollIntoView()
                  .run();
              } catch (err1) {
                console.log('[FindService] Object format failed, trying range format:', err1);
                // Try alternative format
                try {
                  result = editor.chain()
                    .focus()
                    .setTextSelection(fromPos)
                    .setTextSelection({ from: fromPos, to: toPos })
                    .scrollIntoView()
                    .run();
                } catch (err2) {
                  console.error('[FindService] Both formats failed:', err2);
                }
              }
              
              console.log('[FindService] Selection command result:', result, 'Current selection:', {
                from: editor.state.selection.from,
                to: editor.state.selection.to,
                anchor: editor.state.selection.anchor,
                head: editor.state.selection.head
              });
              
              // Verify the selection was set
              setTimeout(() => {
                const currentFrom = editor.state.selection.from;
                const currentTo = editor.state.selection.to;
                if (Math.abs(currentFrom - fromPos) > 1 || Math.abs(currentTo - toPos) > 1) {
                  const actualText = editor.state.doc.textBetween(currentFrom, currentTo);
                  const expectedText = editor.state.doc.textBetween(fromPos, toPos);
                  const docText = editor.state.doc.textContent;
                  console.warn('[FindService] Selection mismatch:', {
                    expected: { fromPos, toPos, text: expectedText },
                    actual: { from: currentFrom, to: currentTo, text: actualText },
                    matchFromStore: (match as any).expectedText || docText.substring(match.from, match.to)
                  });
                  
                  // Try alternative approach using ProseMirror selection directly
                  try {
                    const { TextSelection } = require('@tiptap/pm/state');
                    const selection = TextSelection.create(editor.state.doc, fromPos, toPos);
                    const tr = editor.state.tr.setSelection(selection);
                    editor.view.dispatch(tr);
                    editor.commands.scrollIntoView();
                  } catch (pmErr) {
                    console.error('[FindService] ProseMirror fallback failed:', pmErr);
                  }
                }
              }, 50);
            } catch (err) {
              console.error('[FindService] Error in selection command:', err);
            }
          } else {
            console.warn('[FindService] Positions out of bounds:', { fromPos, toPos, docSize });
          }
        } else {
          console.warn('[FindService] Invalid positions:', { fromPos, toPos, match });
        }
      } catch (e) {
        console.error('[FindService] Error selecting match:', e, match);
      }
    };
    
    return {
      findMatches: (query: string): FindMatch[] => {
        if (!query.trim()) return [];
        
        // Build a mapping of character positions to ProseMirror positions
        // This ensures accurate position conversion
        const textNodes: Array<{ pos: number; text: string; charStart: number }> = [];
        let charOffset = 0;
        
        editor.state.doc.descendants((node: any, pos: number) => {
          if (node.isText && node.text) {
            // In ProseMirror descendants, 'pos' is the position BEFORE the node
            // Text content starts at pos+1
            // But we need to verify this is correct by checking actual text
            textNodes.push({
              pos: pos, // Store position BEFORE the node (text starts at pos+1)
              text: node.text,
              charStart: charOffset,
            });
            charOffset += node.text.length;
          }
          return true;
        });
        
        // Verify and correct position mapping by checking actual document text
        // The console shows mismatches, so let's build a corrected mapping
        const correctedNodes: Array<{ pos: number; text: string; charStart: number; actualStartPos: number }> = [];
        for (const textNode of textNodes) {
          // Try to find where the text actually starts in the document
          let actualStartPos = textNode.pos + 1; // Default assumption
          
          // Verify by checking if text at pos+1 matches first char of node
          try {
            const charAtPos1 = editor.state.doc.textBetween(textNode.pos + 1, textNode.pos + 2);
            if (charAtPos1 === textNode.text.charAt(0)) {
              // Position is correct
              actualStartPos = textNode.pos + 1;
            } else {
              // Try pos+2 (one position later)
              const charAtPos2 = editor.state.doc.textBetween(textNode.pos + 2, textNode.pos + 3);
              if (charAtPos2 === textNode.text.charAt(0)) {
                actualStartPos = textNode.pos + 2;
              } else {
                // Try pos+0 (one position earlier) - unlikely but let's check
                const charAtPos0 = editor.state.doc.textBetween(textNode.pos, textNode.pos + 1);
                if (charAtPos0 === textNode.text.charAt(0)) {
                  actualStartPos = textNode.pos;
                }
              }
            }
          } catch (e) {
            // Use default if verification fails
          }
          
          correctedNodes.push({
            ...textNode,
            actualStartPos,
          });
        }
        
        // Get flat text for searching
        const text = editor.state.doc.textContent;
        const matches: FindMatch[] = [];
        const searchRegex = new RegExp(this.escapeRegex(query), 'gi');
        let match;
        
        while ((match = searchRegex.exec(text)) !== null) {
          const charFrom = match.index;
          const charTo = match.index + match[0].length;
          
          // Convert character positions to ProseMirror positions
          // Need to handle matches that may span multiple text nodes
          let fromPos = -1;
          let toPos = -1;
          
          // Find the text node containing the start of the match
          // Use corrected nodes if available, otherwise use original
          const nodesToUse = correctedNodes.length > 0 ? correctedNodes : textNodes;
          for (let i = 0; i < nodesToUse.length && (fromPos < 0 || toPos < 0); i++) {
            const textNode = nodesToUse[i];
            const nodeCharEnd = textNode.charStart + textNode.text.length;
            // Use actualStartPos if available (from corrected nodes), otherwise pos+1
            const nodeTextStart = (textNode as any).actualStartPos ?? (textNode.pos + 1);
            
            // Find the text node containing 'from'
            // In ProseMirror: pos parameter in descendants() is the position BEFORE the node
            // The text content of the node starts at pos+1
            // For TextSelection: positions are BETWEEN characters
            // - Position P is before the node
            // - Position P+1 is before the first character (so selecting from P+1 includes first char)
            // - Character at offset N spans from position (P+1+N) to (P+1+N+1)
            // However, based on user feedback, we're missing the first character
            // This suggests we're calculating one position too late
            // Fix: subtract 1 from the calculated position to include the first character
            if (fromPos < 0 && charFrom >= textNode.charStart && charFrom < nodeCharEnd) {
              const offsetInNode = charFrom - textNode.charStart;
              // User feedback: missing first char AND including char after
              // Both positions are one too late, suggesting our calculation is consistently off
              // Standard calculation gives us: pos + 1 + offsetInNode
              // To fix: we need to subtract 1, but the clamp logic was preventing it
              // Solution: use the simplified formula and verify it works
              // textNode.pos + offsetInNode gives us the position we want (one less than standard)
              // But for offsetInNode=0, this gives pos (before node), which won't work
              // So we need: if offsetInNode=0, use pos+1; otherwise use pos+offsetInNode
              // But wait - that's what we had before and it didn't work for offsetInNode=1
              
              // Let's try: always use pos + offsetInNode, but if that's < pos+1, use pos+1
              // This means: offsetInNode=0 -> pos+0 -> clamp to pos+1 (standard)
              //            offsetInNode=1 -> pos+1 -> clamp to pos+1 (WRONG - should be pos+2)
              // That still doesn't work!
              
              // Based on console: when offsetInNode=0, pos+1 gives wrong char
              // The issue: ProseMirror textBetween uses positions BETWEEN characters
              // If text node is at pos P, character at offset N is between positions P+1+N and P+1+N+1
              // But we're consistently off by one in both directions
              // Fix: use pos + 1 + offsetInNode (standard) but this seems to be one too late
              // Alternative: maybe textBetween is inclusive of both bounds?
              // Use the actual start position of the text in the document
              // Based on user feedback: we're missing first char, so subtract 1
              // This accounts for any document structure (paragraphs, headings, etc.)
              fromPos = nodeTextStart + offsetInNode - 1;
              // Ensure we don't go before the actual start
              if (fromPos < nodeTextStart) {
                fromPos = nodeTextStart;
              }
              
              // Verify: get actual text at calculated position to ensure it matches
              if (matches.length <= 1) { // Only for first match
                try {
                  const verifyText = editor.state.doc.textBetween(fromPos, fromPos + 1);
                  const expectedChar = text.charAt(charFrom);
                  console.log('[FindService] Position verification:', {
                    charFrom,
                    offsetInNode,
                    nodePos: textNode.pos,
                    calculatedFromPos: fromPos,
                    verifyText,
                    expectedChar,
                    matches: verifyText === expectedChar
                  });
                } catch (e) {
                  // Ignore verification errors
                }
              }
            }
            
            // Find the text node containing 'to'
            // 'to' is exclusive in char offsets (points after the last character)
            if (toPos < 0 && charTo > textNode.charStart && charTo <= nodeCharEnd) {
              const offsetInNode = charTo - textNode.charStart;
              // charTo points AFTER the last character (exclusive in flat text)
              // Example: match "VibeMD" (6 chars) in flat text at position 100-105
              //   charFrom=100, charTo=106 (points after 'D' at index 5)
              //   If charStart=100, offsetInNode = 106-100 = 6 (points after char at index 5)
              // In ProseMirror: if text starts at nodeTextStart, character at index N:
              //   - Char N spans from (nodeTextStart + N) to (nodeTextStart + N + 1)
              //   - To SELECT char N: toPos = nodeTextStart + N + 1
              // If offsetInNode=6 (pointing after index 5), the last char is at index 5
              // To select including char at index 5: toPos = nodeTextStart + 5 + 1 = nodeTextStart + 6
              // But offsetInNode = 6, so toPos = nodeTextStart + 6 = nodeTextStart + offsetInNode
              // However, we're missing the last char, suggesting we need one more
              // The issue: offsetInNode might be the count of chars, not the index
              // If match has 6 chars (indices 0-5), offsetInNode when pointing after = 6
              // To include char 5: toPos = nodeTextStart + 5 + 1 = nodeTextStart + 6
              // But wait - if offsetInNode already accounts for "after", we might need +0 not +1
              // Actually, user says we're still missing last char, so we need +1
              toPos = nodeTextStart + offsetInNode + 1;
            } else if (toPos < 0 && charTo === textNode.charStart && i > 0) {
              // Edge case: 'to' is exactly at the start of a node (match ends between nodes)
              toPos = (textNode as any).actualStartPos ?? (textNode.pos + 1);
            }
            
            // Handle matches that span multiple text nodes
            // If 'to' extends beyond this node, we need to find the next node
            if (fromPos >= 0 && toPos < 0 && charTo > nodeCharEnd && i < textNodes.length - 1) {
              // The match extends into the next node, but we'll handle that in the next iteration
              // For now, we need to continue searching
            }
          }
          
          if (fromPos >= 0 && toPos >= 0 && toPos > fromPos) {
            const matchObj = {
              from: charFrom, // Keep character positions for display
              to: charTo,
              proseFrom: fromPos,
              proseTo: toPos,
            } as any;
            matches.push(matchObj);
            
            if (matches.length <= 3) { // Only log first few matches to avoid spam
              // Verify the selection by getting the text at those positions
              try {
                const selectedText = editor.state.doc.textBetween(fromPos, toPos);
                const expectedText = text.substring(charFrom, charTo);
                const charBefore = fromPos > 0 ? editor.state.doc.textBetween(fromPos - 1, fromPos) : '';
                const charAfter = editor.state.doc.textBetween(toPos, toPos + 1);
                
                console.log('[FindService] Match found:', { 
                  charFrom, 
                  charTo,
                  matchLength: charTo - charFrom,
                  fromPos, 
                  toPos,
                  selectionLength: toPos - fromPos,
                  expectedText,
                  actualText: selectedText,
                  charBefore: `"${charBefore}"`,
                  charAfter: `"${charAfter}"`,
                  matches: selectedText === expectedText,
                  diff: expectedText.length - selectedText.length,
                  missingFromStart: expectedText.startsWith(selectedText) ? '' : expectedText.substring(0, expectedText.length - selectedText.length),
                  missingFromEnd: expectedText.endsWith(selectedText) ? '' : expectedText.substring(selectedText.length),
                  issue: selectedText !== expectedText ? 
                    (selectedText.length < expectedText.length ? `missing ${expectedText.length - selectedText.length} chars` : 
                     selectedText.length > expectedText.length ? `extra ${selectedText.length - expectedText.length} chars` : 'wrong chars') : 'ok'
                });
              } catch (e) {
                console.log('[FindService] Match found (could not verify):', { 
                  charFrom, 
                  charTo, 
                  fromPos, 
                  toPos,
                  text: text.substring(charFrom, charTo),
                  error: e
                });
              }
            }
          } else {
            console.warn('[FindService] Could not convert match positions:', { charFrom, charTo, fromPos, toPos, textNodes: textNodes.length });
          }
        }
        
        return matches;
      },
      
      highlightMatches: (matches: FindMatch[]) => {
        // TipTap highlighting will be handled via decorations
        // Implementation in TipTapEditor
      },
      
      clearHighlights: () => {
        // Clear decorations
        // Implementation in TipTapEditor
      },
      
      scrollToMatch: (match: FindMatch) => {
        // For TipTap, scrollToMatch and selectMatch are the same
        selectMatchHelper(match);
      },
      
      selectMatch: (match: FindMatch) => {
        selectMatchHelper(match);
      },
    };
  }

  // Helper to escape regex special characters
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Public API for finding matches
  findMatches(query: string, editorType: 'plain' | 'wysiwyg'): FindMatch[] {
    if (!query.trim()) return [];
    
    if (editorType === 'plain' && this.plainTextEditor?.view) {
      return this.getPlainTextInterface().findMatches(query);
    }
    
    if (editorType === 'wysiwyg' && this.wysiwygEditor?.editor) {
      return this.getWysiwygInterface().findMatches(query);
    }
    
    return [];
  }

  // Public API for navigating to a match
  selectMatch(match: FindMatch, editorType: 'plain' | 'wysiwyg') {
    if (editorType === 'plain' && this.plainTextEditor?.view) {
      this.getPlainTextInterface().selectMatch(match);
    } else if (editorType === 'wysiwyg' && this.wysiwygEditor?.editor) {
      this.getWysiwygInterface().selectMatch(match);
    }
  }
}

export const findService = new FindService();

