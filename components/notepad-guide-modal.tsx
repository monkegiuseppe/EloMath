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
            className="glass-strong rounded-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-card/95 backdrop-blur-sm pb-2 -mt-2">
                <h2 className="text-xl font-bold text-foreground">CAS Notepad Guide</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="text-muted-foreground space-y-5 text-sm">
                <p className="text-foreground font-medium">
                  The notepad includes a powerful Computer Algebra System (CAS) for symbolic and numerical calculations.
                </p>

                {/* Basic Usage */}
                <div>
                  <h3 className="text-foreground font-semibold mb-2 text-base">Basic Usage</h3>
                  <ul className="space-y-2">
                    <li>
                      <strong>Insert Equation Box:</strong> Press <kbd className="px-2 py-1 bg-muted border rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-muted border rounded text-xs">M</kbd> to insert a mathematical equation box.
                    </li>
                    <li>
                      <strong>Calculate Result:</strong> Press <kbd className="px-2 py-1 bg-muted border rounded text-xs">Enter</kbd> inside an equation box to evaluate the expression.
                    </li>
                    <li>
                      <strong>Navigate:</strong> Use arrow keys to move in/out of equation boxes.
                    </li>
                  </ul>
                </div>

                {/* Mathematical Symbols */}
                <div>
                  <h3 className="text-foreground font-semibold mb-2 text-base">Quick Symbol Input</h3>
                  <p className="mb-2">Type these words and they'll auto-convert to symbols:</p>
                  <div className="grid grid-cols-2 gap-2 p-2 bg-background/50 rounded text-xs">
                    <div><code>pi</code> → π</div>
                    <div><code>theta</code> → θ</div>
                    <div><code>alpha</code> → α</div>
                    <div><code>beta</code> → β</div>
                    <div><code>gamma</code> → γ</div>
                    <div><code>delta</code> → δ</div>
                    <div><code>lambda</code> → λ</div>
                    <div><code>mu</code> → μ</div>
                    <div><code>sigma</code> → σ</div>
                    <div><code>omega</code> → ω</div>
                    <div><code>sqrt</code> → √</div>
                    <div><code>int</code> → ∫</div>
                    <div><code>sum</code> → Σ</div>
                    <div><code>prod</code> → ∏</div>
                    <div><code>lim</code> → lim</div>
                    <div><code>inf</code> → ∞</div>
                  </div>
                </div>

                {/* Available Functions */}
                <div>
                  <h3 className="text-foreground font-semibold mb-2 text-base">Available Functions</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <strong className="text-cyan-400">Solving Equations</strong>
                      <div className="mt-1 p-2 bg-background/50 rounded">
                        <code>solve(equation, variable)</code><br />
                        <span className="text-xs opacity-75">Examples:</span><br />
                        <code className="text-xs">solve(x^2 - 4 = 0, x)</code><br />
                        <code className="text-xs">solve(2x + 5 = 13, x)</code>
                      </div>
                      <p className="text-xs mt-1 opacity-75">Supports linear and quadratic equations</p>
                    </div>

                    <div>
                      <strong className="text-purple-400">Derivatives</strong>
                      <div className="mt-1 p-2 bg-background/50 rounded">
                        <code>derivative(expression, variable)</code><br />
                        <code>d/dx(expression)</code><br />
                        <span className="text-xs opacity-75">Examples:</span><br />
                        <code className="text-xs">derivative(x^3 + 2x, x)</code><br />
                        <code className="text-xs">d/dx(sin(x) * cos(x))</code>
                      </div>
                    </div>

                    <div>
                      <strong className="text-green-400">Simplification & Manipulation</strong>
                      <div className="mt-1 p-2 bg-background/50 rounded space-y-1">
                        <div><code>simplify(expression)</code> - Simplify algebraic expressions</div>
                        <div><code>expand(expression)</code> - Expand products</div>
                        <div><code>factor(expression)</code> - Factor expressions</div>
                        <span className="text-xs opacity-75">Examples:</span><br />
                        <code className="text-xs">simplify((x^2 - 1)/(x - 1))</code><br />
                        <code className="text-xs">expand((x + 2)^2)</code>
                      </div>
                    </div>

                    <div>
                      <strong className="text-amber-400">Limits</strong>
                      <div className="mt-1 p-2 bg-background/50 rounded">
                        <code>limit(expression, x-&gt;value)</code><br />
                        <span className="text-xs opacity-75">Example:</span><br />
                        <code className="text-xs">limit(sin(x)/x, x-&gt;0)</code>
                      </div>
                    </div>

                    <div>
                      <strong className="text-blue-400">Trigonometric Functions</strong>
                      <div className="mt-1 p-2 bg-background/50 rounded">
                        <code>sin, cos, tan, sec, csc, cot</code><br />
                        <code>arcsin, arccos, arctan</code><br />
                        <code>sinh, cosh, tanh</code> (hyperbolic)
                      </div>
                    </div>

                    <div>
                      <strong className="text-pink-400">Other Functions</strong>
                      <div className="mt-1 p-2 bg-background/50 rounded">
                        <code>log(x)</code> - logarithm base 10<br />
                        <code>ln(x)</code> - natural logarithm<br />
                        <code>exp(x)</code> - e^x<br />
                        <code>abs(x)</code> - absolute value<br />
                        <code>sqrt(x)</code> - square root<br />
                        <code>cbrt(x)</code> - cube root
                      </div>
                    </div>
                  </div>
                </div>

                {/* Constants */}
                <div>
                  <h3 className="text-foreground font-semibold mb-2 text-base">Physical Constants</h3>
                  <div className="p-2 bg-background/50 rounded grid grid-cols-2 gap-2 text-xs">
                    <div><code>pi</code> - π (3.14159...)</div>
                    <div><code>e</code> - Euler's number</div>
                    <div><code>hbar</code> - Reduced Planck</div>
                    <div><code>c</code> - Speed of light</div>
                    <div><code>G</code> - Gravitational constant</div>
                    <div><code>k_B</code> - Boltzmann constant</div>
                    <div><code>e_charge</code> - Elementary charge</div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                  <h3 className="text-blue-400 font-semibold mb-2">💡 Pro Tips</h3>
                  <ul className="space-y-1 text-xs">
                    <li>• Use parentheses liberally for clarity: <code>(x+1)/(x-1)</code></li>
                    <li>• Multiplication must be explicit: <code>2*x</code> not <code>2x</code></li>
                    <li>• For exponents use ^: <code>x^2</code> not <code>x²</code></li>
                    <li>• Chain operations: <code>simplify(derivative(x^3, x))</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotepadGuideModal;