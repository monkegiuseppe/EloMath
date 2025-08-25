// components/formatting-guide-modal.tsx

"use client"

import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface FormattingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FormattingGuideModal: FC<FormattingGuideModalProps> = ({ isOpen, onClose }) => {
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
            // Apply the strong glass effect here instead of a solid background
            className="glass-strong rounded-xl w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-foreground">Answer Formatting Guide</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="text-muted-foreground space-y-4">
                <p>To ensure your answers are graded correctly, please follow these formatting guidelines.</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Numbers:</strong> Use a period for decimals (e.g., <code>3.14159</code>).
                  </li>
                  <li>
                    <strong>Fractions:</strong> Use a forward slash (e.g., <code>1/2</code> or <code>-3/4</code>).
                  </li>
                  <li>
                    <strong>Constants:</strong> Use <code>pi</code> for π and <code>e</code> for Euler's number.
                  </li>
                  <li>
                    <strong>Square Roots:</strong> Use the <code>sqrt()</code> function (e.g., <code>sqrt(2)</code>).
                  </li>
                   <li>
                    <strong>Exponents:</strong> Use the caret symbol <code>^</code> (e.g., <code>x^2</code>).
                  </li>
                  <li>
                    <strong>Text Answers:</strong> For non-numeric answers, type the word directly (e.g., <code>converge</code>). These are not case-sensitive.
                  </li>
                </ul>
                <p className="pt-2">The system automatically handles most standard mathematical expressions.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormattingGuideModal;