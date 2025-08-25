// components/fullscreen-notepad.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { addStyles, MathField } from 'react-mathquill';
import CasMathField from './cas-math-field';

addStyles();

interface EquationState {
  latex: string;
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
    
    const wrapper = document.createElement('div');
    wrapper.className = 'inline-math-wrapper';
    wrapper.setAttribute('data-equation-id', equationId);
    wrapper.contentEditable = 'false';

    const pBefore = document.createElement('p');
    const pAfter = document.createElement('p');
    pAfter.innerHTML = '&#8203;';

    range.insertNode(pAfter);
    range.insertNode(wrapper);
    range.insertNode(pBefore);

    setEquations(prev => ({ ...prev, [equationId]: { latex: '' } }));

    range.setStart(pAfter, 0);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        insertEquation();
      }
    };
    const contentEl = contentRef.current;
    contentEl?.addEventListener('keydown', handleKeyDown);
    return () => contentEl?.removeEventListener('keydown', handleKeyDown);
  }, []);

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
            />,
            container
          );
        })}
      </div>
    </>
  );
}