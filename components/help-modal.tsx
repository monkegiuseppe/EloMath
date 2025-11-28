// components/help-modal.tsx

"use client"

import { useState } from "react";
import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Brain, Calculator, TrendingUp, HelpCircle, Zap } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type HelpCategory = 'overview' | 'practice' | 'cas' | 'formatting' | 'graphing';

const HelpModal: FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<HelpCategory>('overview');

  const categories = [
    { id: 'overview' as HelpCategory, label: 'Getting Started', icon: BookOpen },
    { id: 'practice' as HelpCategory, label: 'Practice Mode', icon: Brain },
    { id: 'cas' as HelpCategory, label: 'CAS Notepad', icon: Calculator },
    { id: 'formatting' as HelpCategory, label: 'Answer Formatting', icon: Zap },
    { id: 'graphing' as HelpCategory, label: 'Graphing Tool', icon: TrendingUp },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-[60] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="glass-strong rounded-xl w-full max-w-4xl h-[80vh] min-h-[600px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border/30 flex-shrink-0">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">EloMath Help</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-border/30 p-2 md:p-4 flex-shrink-0 overflow-x-auto md:overflow-y-auto custom-scrollbar">
                <nav className="flex md:block space-x-2 md:space-x-0 md:space-y-1 min-w-max">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap w-full text-left ${activeCategory === category.id
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                          }`}
                      >
                        <Icon size={18} />
                        <span>{category.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 p-4 sm:p-6 overflow-y-auto custom-scrollbar"
                  >
                    {activeCategory === 'overview' && <OverviewContent />}
                    {activeCategory === 'practice' && <PracticeContent />}
                    {activeCategory === 'cas' && <CASContent />}
                    {activeCategory === 'formatting' && <FormattingContent />}
                    {activeCategory === 'graphing' && <GraphingContent />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const OverviewContent = () => (
  <div className="space-y-6 text-muted-foreground">
    <div>
      <h3 className="text-2xl font-bold text-foreground mb-3">Welcome to EloMath!</h3>
      <p className="text-base leading-relaxed">
        EloMath is an adaptive learning platform that helps you master advanced mathematics and physics through intelligent practice.
      </p>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Key Features</h4>
      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-2">
          <Brain className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
          <div>
            <strong className="text-foreground">Adaptive ELO System:</strong> Problems adjust to your skill level, providing optimal challenge and growth.
          </div>
        </li>
        <li className="flex items-start gap-2">
          <Calculator className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <strong className="text-foreground">CAS Notepad:</strong> Built-in Computer Algebra System for symbolic calculations, derivatives, integrals, and more.
          </div>
        </li>
        <li className="flex items-start gap-2">
          <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <strong className="text-foreground">Graphing Tool:</strong> Visualize functions, find roots, extrema, and intersections interactively.
          </div>
        </li>
        <li className="flex items-start gap-2">
          <BookOpen className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <strong className="text-foreground">Progress Tracking:</strong> Monitor your learning with detailed statistics and activity calendars.
          </div>
        </li>
      </ul>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Getting Started</h4>
      <ol className="space-y-2 text-sm list-decimal list-inside">
        <li><strong className="text-foreground">Sign in</strong> to save your progress across sessions</li>
        <li><strong className="text-foreground">Choose Practice Mode</strong> (Math or Physics) to start learning</li>
        <li><strong className="text-foreground">Select Categories</strong> to focus on specific topics</li>
        <li><strong className="text-foreground">Use Workspace</strong> for scratch work with the CAS and graphing tools</li>
        <li><strong className="text-foreground">Track Progress</strong> to see your improvement over time</li>
      </ol>
    </div>
  </div>
);

const PracticeContent = () => (
  <div className="space-y-6 text-muted-foreground">
    <div>
      <h3 className="text-2xl font-bold text-foreground mb-3">Practice Mode</h3>
      <p className="text-base leading-relaxed">
        Practice mode uses an ELO rating system to match you with problems at the right difficulty level.
      </p>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">How ELO Works</h4>
      <ul className="space-y-2 text-sm">
        <li>• Start at <strong className="text-foreground">1200 ELO</strong></li>
        <li>• <strong className="text-foreground">Correct answers</strong> increase your rating</li>
        <li>• <strong className="text-foreground">Incorrect answers</strong> decrease your rating</li>
        <li>• Gain more points by solving harder problems</li>
        <li>• Problems are matched to your current skill level (±150 ELO)</li>
      </ul>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Category Filtering</h4>
      <p className="text-sm mb-2">
        Click the <strong className="text-foreground">"Categories"</strong> button in the header to:
      </p>
      <ul className="space-y-1 text-sm">
        <li>• Select specific topics to practice</li>
        <li>• Focus on areas you want to improve</li>
        <li>• Uncheck categories you want to skip</li>
      </ul>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Problem Types</h4>
      <p className="text-sm mb-2">
        EloMath offers practice in two main subjects:
      </p>
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div className="bg-background/30 p-3 rounded border border-border/50">
          <strong className="text-foreground block mb-1">Mathematics</strong>
          <ul className="list-disc list-inside space-y-1">
            <li>Calculus I, II, & III</li>
            <li>Linear Algebra</li>
            <li>Differential Equations</li>
            <li>Complex Analysis</li>
          </ul>
        </div>
        <div className="bg-background/30 p-3 rounded border border-border/50">
          <strong className="text-foreground block mb-1">Physics</strong>
          <ul className="list-disc list-inside space-y-1">
            <li>Kinematics & Forces</li>
            <li>Electromagnetism</li>
            <li>Quantum Mechanics</li>
            <li>Thermodynamics</li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Statistics Tracking</h4>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-green-500/10 border border-green-500/30 rounded p-2 text-center">
          <div className="text-green-400 font-semibold text-sm">Correct</div>
          <div className="text-xs mt-1">Right answers</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-center">
          <div className="text-red-400 font-semibold text-sm">Incorrect</div>
          <div className="text-xs mt-1">Wrong answers</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 text-center">
          <div className="text-yellow-400 font-semibold text-sm">Skipped</div>
          <div className="text-xs mt-1">Passed questions</div>
        </div>
      </div>
      <p className="text-sm">
        Your statistics are displayed in the header and saved to your profile (when signed in).
      </p>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Reset Progress</h4>
      <p className="text-sm">
        Use the <strong className="text-foreground">Reset</strong> button (🔄) to restart from 1200 ELO.
        <strong className="text-destructive"> This action cannot be undone!</strong>
      </p>
    </div>
  </div>
);

const CASContent = () => (
  <div className="space-y-6 text-muted-foreground text-sm">
    <div>
      <h3 className="text-2xl font-bold text-foreground mb-3">CAS Notepad Guide</h3>
      <p className="text-base leading-relaxed">
        The notepad includes a powerful Computer Algebra System (CAS) for symbolic and numerical calculations.
      </p>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Basic Usage</h4>
      <ul className="space-y-2">
        <li>
          <strong className="text-foreground">Insert Equation:</strong> Press <kbd className="px-2 py-1 bg-muted border rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-muted border rounded text-xs">M</kbd>
        </li>
        <li>
          <strong className="text-foreground">Calculate:</strong> Press <kbd className="px-2 py-1 bg-muted border rounded text-xs">Enter</kbd> inside equation box
        </li>
        <li>
          <strong className="text-foreground">Navigate:</strong> Use arrow keys to move in/out of boxes
        </li>
      </ul>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Quick Symbols</h4>
      <p className="mb-2">Type these words to auto-convert to Greek letters:</p>
      <div className="grid grid-cols-3 gap-2 p-2 bg-background/50 rounded">
        <div><code>pi</code> → π</div>
        <div><code>theta</code> → θ</div>
        <div><code>alpha</code> → α</div>
        <div><code>beta</code> → β</div>
        <div><code>gamma</code> → γ</div>
        <div><code>omega</code> → ω</div>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Available Functions</h4>

      <div className="space-y-3">
        <div>
          <strong className="text-cyan-400">Solving Equations</strong>
          <div className="mt-1 p-2 bg-background/50 rounded text-xs">
            <code>solve(x^2 - 4 = 0, x)</code> → <span className="text-green-400">2, -2</span>
          </div>
        </div>

        <div>
          <strong className="text-purple-400">Derivatives</strong>
          <div className="mt-1 p-2 bg-background/50 rounded text-xs">
            <code>derivative(x^3 + 2x, x)</code> → <span className="text-green-400">3x² + 2</span>
          </div>
        </div>

        <div>
          <strong className="text-amber-400">Integration</strong>
          <div className="mt-1 p-2 bg-background/50 rounded text-xs">
            <code>integrate(x^2)</code> → <span className="text-green-400">x³/3 + C</span><br />
            <code>integrate(x, x, 0, 2)</code> → <span className="text-green-400">2</span>
          </div>
        </div>

        <div>
          <strong className="text-green-400">Simplification</strong>
          <div className="mt-1 p-2 bg-background/50 rounded text-xs">
            <code>simplify((x^2-1)/(x-1))</code> → <span className="text-green-400">x + 1</span><br />
            <code>expand((x+2)^2)</code> → <span className="text-green-400">x² + 4x + 4</span>
          </div>
        </div>

        <div>
          <strong className="text-pink-400">Limits</strong>
          <div className="mt-1 p-2 bg-background/50 rounded text-xs">
            <code>{'limit(sin(x)/x, x->0)'}</code> → <span className="text-green-400">1</span>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
      <h4 className="text-blue-400 font-semibold mb-2">💡 Pro Tips</h4>
      <ul className="space-y-1">
        <li>• Use parentheses for clarity: <code>(x+1)/(x-1)</code></li>
        <li>• Multiplication must be explicit: <code>2*x</code> not <code>2x</code></li>
        <li>• For exponents use ^: <code>x^2</code></li>
        <li>• Chain operations: <code>simplify(derivative(x^3, x))</code></li>
      </ul>
    </div>
  </div>
);

const FormattingContent = () => (
  <div className="space-y-6 text-muted-foreground">
    <div>
      <h3 className="text-2xl font-bold text-foreground mb-3">Answer Formatting Guide</h3>
      <p className="text-base leading-relaxed">
        To ensure your answers are graded correctly, follow these formatting guidelines.
      </p>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Number Formats</h4>
      <ul className="list-disc list-inside space-y-2 text-sm">
        <li>
          <strong className="text-foreground">Decimals:</strong> Use a period (e.g., <code>3.14159</code>)
        </li>
        <li>
          <strong className="text-foreground">Fractions:</strong> Use forward slash (e.g., <code>1/2</code> or <code>-3/4</code>)
        </li>
        <li>
          <strong className="text-foreground">Negative numbers:</strong> Use minus sign (e.g., <code>-5</code>)
        </li>
      </ul>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Mathematical Notation</h4>
      <ul className="list-disc list-inside space-y-2 text-sm">
        <li>
          <strong className="text-foreground">Constants:</strong> <code>pi</code> for π, <code>e</code> for Euler's number
        </li>
        <li>
          <strong className="text-foreground">Square Roots:</strong> <code>sqrt(2)</code> or <code>√2</code>
        </li>
        <li>
          <strong className="text-foreground">Exponents:</strong> Use caret <code>^</code> (e.g., <code>x^2</code>)
        </li>
        <li>
          <strong className="text-foreground">Multiplication:</strong> Use <code>*</code> (e.g., <code>2*x</code>)
        </li>
        <li>
          <strong className="text-foreground">Division:</strong> Use <code>/</code> (e.g., <code>1/3</code>)
        </li>
      </ul>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Function Notation</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-background/50 p-2 rounded">
          <code>sin(x)</code>, <code>cos(x)</code>, <code>tan(x)</code>
        </div>
        <div className="bg-background/50 p-2 rounded">
          <code>ln(x)</code>, <code>log(x)</code>
        </div>
        <div className="bg-background/50 p-2 rounded">
          <code>abs(x)</code>
        </div>
        <div className="bg-background/50 p-2 rounded">
          <code>exp(x)</code> for e^x
        </div>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Text Answers</h4>
      <p className="text-sm mb-2">
        For non-numeric answers (like "converge" or "diverge"):
      </p>
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>Type the word directly</li>
        <li>Not case-sensitive</li>
        <li>Spelling must match exactly</li>
      </ul>
    </div>

    <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
      <h4 className="text-green-400 font-semibold mb-2">✓ Examples of Correct Formatting</h4>
      <div className="space-y-1 text-sm">
        <div><code>1/3</code> - Simple fraction</div>
        <div><code>sqrt(2)</code> - Square root</div>
        <div><code>2*pi</code> - Using constants</div>
        <div><code>x^2 + 2*x + 1</code> - Polynomial</div>
        <div><code>sin(pi/2)</code> - Trig with fractions</div>
      </div>
    </div>

    <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
      <h4 className="text-red-400 font-semibold mb-2">✗ Common Mistakes</h4>
      <div className="space-y-1 text-sm">
        <div><code>2x</code> - Missing multiplication (should be <code>2*x</code>)</div>
        <div><code>x2</code> - Wrong exponent format (should be <code>x^2</code>)</div>
        <div><code>1,5</code> - Wrong decimal separator (should be <code>1.5</code>)</div>
        <div><code>√(2)</code> - Wrong root symbol (should be <code>sqrt(2)</code>)</div>
      </div>
    </div>
  </div>
);

const GraphingContent = () => (
  <div className="space-y-6 text-muted-foreground">
    <div>
      <h3 className="text-2xl font-bold text-foreground mb-3">Graphing Tool</h3>
      <p className="text-base leading-relaxed">
        Visualize functions and analyze their properties with the interactive graphing tool.
      </p>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Basic Controls</h4>
      <ul className="space-y-2 text-sm">
        <li>
          <strong className="text-foreground">Pan:</strong> Click and drag to move the view
        </li>
        <li>
          <strong className="text-foreground">Zoom:</strong> Scroll up/down to zoom in/out
        </li>
        <li>
          <strong className="text-foreground">Add Graphs:</strong> Use the + button to add multiple functions
        </li>
        <li>
          <strong className="text-foreground">Switch Functions:</strong> Click the settings icon to manage all graphs
        </li>
      </ul>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Function Input</h4>
      <p className="text-sm mb-2">Enter functions in the format <code>f(x) = ...</code></p>
      <div className="space-y-2 text-sm">
        <div className="bg-background/50 p-2 rounded">
          <div className="text-foreground font-medium mb-1">Examples:</div>
          <div><code>x^2</code> - Parabola</div>
          <div><code>sin(x)</code> - Sine wave</div>
          <div><code>1/x</code> - Hyperbola</div>
          <div><code>x^3 - 2*x</code> - Cubic function</div>
        </div>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Analysis Features</h4>
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <div className="w-3 h-3 bg-cyan-500 rounded-full mt-1 flex-shrink-0" />
          <div>
            <strong className="text-foreground">Roots:</strong> Find where functions cross the x-axis (y=0)
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full mt-1 flex-shrink-0" />
          <div>
            <strong className="text-foreground">Extrema:</strong> Find maximum and minimum points
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0" />
          <div>
            <strong className="text-foreground">Intersections:</strong> Find where two functions meet
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full mt-1 flex-shrink-0" />
          <div>
            <strong className="text-foreground">Track:</strong> Follow your cursor to see exact coordinates
          </div>
        </div>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-foreground mb-2">Multiple Graphs</h4>
      <p className="text-sm">
        You can graph up to 5 functions simultaneously, each with a different color.
        Perfect for comparing functions or analyzing intersections.
      </p>
    </div>

    <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3">
      <h4 className="text-purple-400 font-semibold mb-2">💡 Tips</h4>
      <ul className="space-y-1 text-sm">
        <li>• Hover over analysis points to see exact coordinates</li>
        <li>• Use the track feature to explore function values</li>
        <li>• Different colors help distinguish multiple graphs</li>
        <li>• Zoom in for more precise analysis</li>
      </ul>
    </div>
  </div>
);

export default HelpModal;