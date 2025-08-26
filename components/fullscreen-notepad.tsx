// components/fullscreen-notepad.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { addStyles, MathField } from 'react-mathquill';
import CasMathField from './cas-math-field';

addStyles();

// UPDATED: The state now includes the MathField instance
interface EquationState {
  latex: string;
  mqInstance: MathField | null;
}

interface FullscreenNotepadProps {
  value: string;
  onChange: (newValue: string) => void;
}

export default function FullscreenNotepad({ value, onChange }: FullscreenNotepadProps) {
  const [equations, setEquations] = useState<Record<string, EquationState>>({});
  const contentRef = useRef<HTMLDivElement>(null);
  const equationCounter = useRef(0);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== value) {
      contentRef.current.innerHTML = value;
    }
  }, [value]);

  const insertEquation = () => {
    const selection = window.getSelection();
    if (!selection?.rangeCount || !contentRef.current?.contains(selection.anchorNode)) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const equationId = `cas-eq-${equationCounter.current++}`;
    
    const wrapper = document.createElement('span');
    wrapper.className = 'inline-math-wrapper';
    wrapper.setAttribute('data-equation-id', equationId);
    wrapper.contentEditable = 'false';

    const cursorNode = document.createTextNode('\u200B');

    range.insertNode(wrapper);
    range.insertNode(cursorNode);
    
    // Initialize the state for the new equation
    setEquations(prev => ({ ...prev, [equationId]: { latex: '', mqInstance: null } }));

    range.setStart(cursorNode, 1);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };
  
  // This function is called by the child to store its instance
  const handleEquationMount = (id: string, field: MathField) => {
    setEquations(prev => {
      // Ensure the ID exists before trying to update
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], mqInstance: field },
      };
    });
  };

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

      // REWRITTEN: This logic now uses the stored instance from the state
      if (targetWrapper && targetWrapper.classList?.contains('inline-math-wrapper')) {
        e.preventDefault();
        const equationId = targetWrapper.getAttribute('data-equation-id');
        if (equationId && equations[equationId]?.mqInstance) {
          const mqInstance = equations[equationId].mqInstance;
          mqInstance.focus();
          if (e.key === 'ArrowRight') mqInstance.moveToLeftEnd();
          else mqInstance.moveToRightEnd();
        }
      }
    };

    contentEl.addEventListener('keydown', handleKeyDown);
    return () => contentEl.removeEventListener('keydown', handleKeyDown);
  }, [equations]); // Dependency array now correctly includes `equations`

  return (
    <>
      <div className="w-full h-full flex flex-col bg-card/50 rounded-b-lg overflow-hidden">
        <div
          ref={contentRef}
          className="w-full flex-grow text-lg p-8 overflow-y-auto custom-scrollbar notepad-content"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
        />
        
        <div className="px-8 pb-4 mt-auto border-t border-border/30 bg-card/50 flex-shrink-0 flex items-center justify-between">
          <div className="text-sm text-muted-foreground pt-3">
            <kbd className="px-2 py-1 bg-muted border rounded text-xs">Ctrl</kbd> + 
            <kbd className="px-2 py-1 bg-muted border rounded text-xs">M</kbd> to insert equation.
          </div>
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
              onDelete={() => {
                container.remove();
                setEquations(prev => {
                  const next = { ...prev };
                  delete next[id];
                  return next;
                });
              }}
              // Pass the mounting function to the child
              onMount={(field) => handleEquationMount(id, field)}
            />,
            container as Element
          );
        })}
      </div>
    </>
  );
}