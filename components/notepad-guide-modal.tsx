// components/notepad-guide-modal.tsx

"use client"

import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface NotepadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotepadGuideModal: FC<NotepadGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="glass-strong rounded-xl w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-foreground">CAS Notepad Guide</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="text-muted-foreground space-y-4 text-sm">
                <p>The notepad includes a Computer Algebra System (CAS) for calculations.</p>
                <ul className="space-y-3">
                  <li>
                    <strong>Calculate Result:</strong> Press <kbd className="px-2 py-1 bg-muted border rounded text-xs">Enter</kbd> inside an equation box to evaluate the expression.
                  </li>
                  <li>
                    <strong>Solving Equations:</strong> Use the <code>solve()</code> function for linear and quadratic equations.
                    <div className="mt-1 p-2 bg-background/50 rounded">
                      Format: <code>solve(equation, variable)</code><br />
                      Example: <code>solve(x^2 - 4 = 0, x)</code>
                    </div>
                  </li>
                  <li>
                    <strong>Available Constants:</strong> You can use the following built-in constants in your equations.
                     <div className="mt-1 p-2 bg-background/50 rounded grid grid-cols-3 gap-x-4 gap-y-1">
                      <code>pi</code>
                      <code>e</code>
                      <code>hbar</code>
                      <code>c</code>
                      <code>G</code>
                      <code>k_B</code>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotepadGuideModal;