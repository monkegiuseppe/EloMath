// components/fullscreen-notepad.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { addStyles, MathField } from 'react-mathquill';
import CasMathField from './cas-math-field';
import CommandMenu from './command-menu'; // Import the new menu
import { FlaskConical } from 'lucide-react';

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

  // ADDED: State for the command menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMathField, setActiveMathField] = useState<MathField | null>(null);

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

  // ADDED: Function to insert text from the menu into the active field
  const handleInsertCommand = (latex: string) => {
    if (activeMathField) {
      activeMathField.cmd(latex);
      activeMathField.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        insertEquation();
      }
      // ADDED: Keyboard shortcut to open the command menu
      if (e.key === '/') {
        if (document.activeElement?.closest('.mq-editable-field')) {
          e.preventDefault();
          setIsMenuOpen(true);
        }
      }
    };
    const contentEl = contentRef.current;
    contentEl?.addEventListener('keydown', handleKeyDown);
    return () => contentEl?.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* ADDED: Render the command menu */}
      <CommandMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onInsert={handleInsertCommand}
      />

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
            <kbd className="px-2 py-1 bg-muted border rounded text-xs">M</kbd> to insert equation. Press <kbd className="px-2 py-1 bg-muted border rounded text-xs">/</kbd> for commands.
          </div>
          {/* ADDED: Button to open the menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="glass px-3 py-1.5 rounded-md text-sm hover:bg-card/90 transition-colors flex items-center gap-2"
          >
            <FlaskConical size={16} />
            <span>Commands</span>
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
              onDelete={() => {
                container.remove();
                setEquations(prev => {
                  const next = { ...prev };
                  delete next[id];
                  return next;
                });
              }}
              // ADDED: Set the active field when this one is focused
              onFocus={(field) => setActiveMathField(field)}
            />,
            container
          );
        })}
      </div>
    </>
  );
}