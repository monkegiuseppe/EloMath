// components/command-menu.tsx

"use client";

import { FC, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sigma, Divide, SquareRadical, Infinity, WholeWord, Atom, FlaskConical } from 'lucide-react';
import { StaticMathField } from 'react-mathquill';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (latex: string) => void;
}

interface CommandItem {
  name: string;
  latex: string;
  icon: ReactNode;
}

const categories: Record<string, CommandItem[]> = {
  'Functions': [
    { name: 'Solve', latex: 'solve( , )', icon: <WholeWord size={24} /> },
    { name: 'Simplify', latex: 'simplify( )', icon: <WholeWord size={24} /> },
    { name: 'Derivative', latex: '\\frac{d}{dx}()', icon: <StaticMathField>{`f'`}</StaticMathField> },
    { name: 'Integral', latex: '\\int_{a}^{b} f(x) dx', icon: <span className="font-serif text-2xl italic">∫</span> },
  ],
  'Operators': [
    { name: 'Summation', latex: '\\sum_{i=1}^{n}', icon: <Sigma size={24} /> },
    { name: 'Fraction', latex: '\\frac{}{}', icon: <Divide size={24} /> },
    { name: 'Square Root', latex: '\\sqrt{}', icon: <SquareRadical size={24} /> },
    { name: 'Infinity', latex: '\\infty', icon: <Infinity size={24} /> },
    { name: 'Pi', latex: '\\pi', icon: <StaticMathField>\pi</StaticMathField> },
    { name: 'Theta', latex: '\\theta', icon: <StaticMathField>\theta</StaticMathField> },
  ],
  'Physics Constants': [
    { name: 'Planck Constant', latex: '\\hbar', icon: <StaticMathField>\hbar</StaticMathField> },
    { name: 'Speed of Light', latex: 'c', icon: <span className="font-serif text-xl italic">c</span> },
    { name: 'Gravity', latex: 'G', icon: <span className="font-serif text-xl italic">G</span> },
    { name: 'Boltzmann', latex: 'k_B', icon: <StaticMathField>k_B</StaticMathField> },
  ],
};

const CommandMenu: FC<CommandMenuProps> = ({ isOpen, onClose, onInsert }) => {
  const [activeTab, setActiveTab] = useState<keyof typeof categories>('Functions');

  const handleInsert = (latex: string) => {
    // FIXED: Close the menu first, then wait a moment for focus to return
    // before inserting the command. This prevents race conditions.
    onClose();
    setTimeout(() => {
      onInsert(latex);
    }, 50); // 50ms is a safe delay
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-lg shadow-xl w-full max-w-2xl max-h-[60vh] flex flex-col"
          >
            <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FlaskConical size={20} /> Command Palette
              </h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1">
                <X size={24} />
              </button>
            </header>

            <div className="flex flex-grow overflow-hidden">
              <nav className="w-1/4 border-r border-border p-2">
                <ul className="space-y-1">
                  {(Object.keys(categories) as Array<keyof typeof categories>).map(cat => (
                    <li key={cat}>
                      <button
                        onClick={() => setActiveTab(cat)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === cat ? 'bg-primary/20 text-foreground' : 'text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="w-3/4 p-4 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories[activeTab].map(item => (
                    <button
                      key={item.name}
                      onClick={() => handleInsert(item.latex)}
                      className="glass p-4 rounded-lg text-center hover:bg-card/90 transition-all duration-200 hover:scale-105 group"
                    >
                      <div className="flex items-center justify-center h-10 text-primary mb-2 text-2xl">
                        {item.icon}
                      </div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandMenu;