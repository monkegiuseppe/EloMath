// components/fullscreen-notepad.tsx

"use client";

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import { addStyles, MathField } from 'react-mathquill';
import { Info } from 'lucide-react';
import CasMathField from './cas-math-field';
import NotepadGuideModal from './notepad-guide-modal';

addStyles();

interface EquationState {
  latex: string;
  mqInstance: MathField | null;
}

interface FullscreenNotepadProps {
  value: string;
  onChange: (newValue: string) => void;
  sessionType?: 'math' | 'physics' | 'default';
  isActive?: boolean;
}

export interface NotepadRef {
  focus: () => void;
}

const FullscreenNotepad = forwardRef<NotepadRef, FullscreenNotepadProps>(
  ({ value, onChange, sessionType = 'default', isActive = true }, ref) => {
    const [equations, setEquations] = useState<Record<string, EquationState>>({});
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const equationCounter = useRef(0);
    const lastFocusedEquationId = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        focusEditor();
      }
    }));

    const focusEditor = useCallback(() => {
      if (!contentRef.current) return;

      if (lastFocusedEquationId.current && equations[lastFocusedEquationId.current]?.mqInstance) {
        const eq = equations[lastFocusedEquationId.current];
        if (eq.mqInstance) {
          setTimeout(() => {
            eq.mqInstance?.focus();
          }, 10);
          return;
        }
      }

      contentRef.current.focus();

      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);
        range.collapse(false); // collapse to end
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }, [equations]);

    useEffect(() => {
      if (isActive) {
        const timer = setTimeout(() => {
          focusEditor();
        }, 50);
        return () => clearTimeout(timer);
      }
    }, [isActive, focusEditor]);

    useEffect(() => {
      if (contentRef.current && contentRef.current.innerHTML !== value) {
        contentRef.current.innerHTML = value;
      }
    }, [value]);

    const insertEquation = useCallback(() => {
      const selection = window.getSelection();
      if (!selection?.rangeCount || !contentRef.current?.contains(selection.anchorNode)) {
        if (contentRef.current) {
          contentRef.current.focus();
          const range = document.createRange();
          range.selectNodeContents(contentRef.current);
          range.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }

      const sel = window.getSelection();
      if (!sel?.rangeCount) return;

      const range = sel.getRangeAt(0);
      range.deleteContents();

      const equationId = `cas-eq-${equationCounter.current++}`;

      const wrapper = document.createElement('span');
      wrapper.className = 'inline-math-wrapper';
      wrapper.setAttribute('data-equation-id', equationId);
      wrapper.contentEditable = 'false';

      const cursorNode = document.createTextNode('\u200B');

      range.insertNode(wrapper);
      range.insertNode(cursorNode);

      setEquations(prev => ({ ...prev, [equationId]: { latex: '', mqInstance: null } }));
      lastFocusedEquationId.current = equationId;

      range.setStart(cursorNode, 1);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }, []);

    const handleEquationMount = useCallback((id: string, field: MathField) => {
      setEquations(prev => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: { ...prev[id], mqInstance: field },
        };
      });
      lastFocusedEquationId.current = id;
    }, []);

    const handleEquationFocus = useCallback((id: string) => {
      lastFocusedEquationId.current = id;
    }, []);

    const handleEquationDelete = useCallback((id: string) => {
      const container = contentRef.current?.querySelector(`[data-equation-id="${id}"]`);
      if (container) {
        container.remove();
      }
      setEquations(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (lastFocusedEquationId.current === id) {
        lastFocusedEquationId.current = null;
      }
      // Refocus editor after deletion
      setTimeout(() => {
        contentRef.current?.focus();
      }, 10);
    }, []);

    // Handle clicks on the editor to ensure proper focus
    const handleEditorClick = useCallback((e: React.MouseEvent) => {
      // Check if click was on an equation wrapper
      const target = e.target as HTMLElement;
      const equationWrapper = target.closest('.inline-math-wrapper');

      if (equationWrapper) {
        const equationId = equationWrapper.getAttribute('data-equation-id');
        if (equationId && equations[equationId]?.mqInstance) {
          e.preventDefault();
          equations[equationId].mqInstance?.focus();
          lastFocusedEquationId.current = equationId;
        }
      } else {
        // Clicked outside equations, clear the last focused equation
        lastFocusedEquationId.current = null;
      }
    }, [equations]);

    // Keyboard navigation
    useEffect(() => {
      const contentEl = contentRef.current;
      if (!contentEl) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
          e.preventDefault();
          insertEquation();
          return;
        }

        const selection = window.getSelection();
        if (!selection || !selection.isCollapsed || !selection.anchorNode) return;

        const { anchorNode, anchorOffset } = selection;
        let targetWrapper: Element | null = null;

        if (e.key === 'ArrowRight') {
          if (anchorNode.nodeType === Node.TEXT_NODE && anchorOffset === anchorNode.textContent?.length) {
            targetWrapper = anchorNode.nextSibling as Element;
          } else if (anchorNode.nodeType === Node.ELEMENT_NODE) {
            targetWrapper = anchorNode.childNodes[anchorOffset] as Element;
          }
        } else if (e.key === 'ArrowLeft') {
          if (anchorNode.nodeType === Node.TEXT_NODE && anchorOffset === 0) {
            targetWrapper = anchorNode.previousSibling as Element;
          } else if (anchorNode.nodeType === Node.ELEMENT_NODE) {
            targetWrapper = anchorNode.childNodes[anchorOffset - 1] as Element;
          }
        }

        if (targetWrapper && targetWrapper.classList?.contains('inline-math-wrapper')) {
          e.preventDefault();
          const equationId = targetWrapper.getAttribute('data-equation-id');
          if (equationId && equations[equationId]?.mqInstance) {
            const mqInstance = equations[equationId].mqInstance;
            mqInstance.focus();
            lastFocusedEquationId.current = equationId;
            if (e.key === 'ArrowRight') mqInstance.moveToLeftEnd();
            else mqInstance.moveToRightEnd();
          }
        }
      };

      contentEl.addEventListener('keydown', handleKeyDown);
      return () => contentEl.removeEventListener('keydown', handleKeyDown);
    }, [equations, insertEquation]);

    return (
      <>
        <NotepadGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        <div className="w-full h-full flex flex-col bg-card/50 rounded-b-lg overflow-hidden">
          <div
            ref={contentRef}
            className="w-full flex-grow text-base sm:text-lg p-4 sm:p-8 overflow-y-auto custom-scrollbar notepad-content outline-none"
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => onChange(e.currentTarget.innerHTML)}
            onClick={handleEditorClick}
            tabIndex={0}
          />

          <div className="px-4 sm:px-8 pb-4 pt-3 mt-auto border-t border-border/30 bg-card/50 flex-shrink-0 flex items-center justify-between">
            <div className="text-xs sm:text-sm text-muted-foreground">
              <span className="hidden sm:inline">Press </span>
              <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px] sm:text-xs">Ctrl</kbd> +
              <kbd className="px-1.5 py-0.5 bg-muted border rounded text-[10px] sm:text-xs">M</kbd>
              <span className="hidden sm:inline"> to insert equation.</span>
              <span className="sm:hidden"> for Math</span>
            </div>
            <button onClick={() => setIsGuideOpen(true)} className="ml-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50" title="Notepad Guide">
              <Info size={18} />
            </button>
          </div>

          {Object.entries(equations).map(([id, state]) => {
            const container = contentRef.current?.querySelector(`[data-equation-id="${id}"]`);
            if (!container) return null;

            return ReactDOM.createPortal(
              <CasMathField
                latex={state.latex}
                onChange={(newLatex) => {
                  setEquations(prev => ({ ...prev, [id]: { ...state, latex: newLatex } }));
                }}
                onDelete={() => handleEquationDelete(id)}
                onMount={(field) => handleEquationMount(id, field)}
                onFocus={() => handleEquationFocus(id)}
                sessionType={sessionType}
              />,
              container as Element
            );
          })}
        </div>
      </>
    );
  }
);

FullscreenNotepad.displayName = 'FullscreenNotepad';

export default FullscreenNotepad;