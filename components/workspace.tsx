// components/workspace.tsx

"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"; // To check if the user is logged in
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Plus, X, Notebook, TrendingUp, BrainCircuit, RefreshCw, SlidersHorizontal, CheckCircle, XCircle, SkipForward } from "lucide-react"
import dynamic from 'next/dynamic'
import { MathPracticeCore } from "./math-practice-core"
import { PhysicsPracticeCore } from "./physics-practice-core"
import { Checkbox } from "./ui/checkbox";

const FullscreenNotepad = dynamic(() => import('./fullscreen-notepad'), { ssr: false });
const FullscreenGraphingTool = dynamic(() => import('./fullscreen-graphing-tool'), { ssr: false });

type SessionType = 'math' | 'physics' | 'default';

interface Tab {
  id: number;
  type: 'notepad' | 'graphing' | 'math-practice' | 'physics-practice';
  title: string;
  content?: string;
}

interface WorkspaceProps {
  onBack: () => void;
  sessionType?: SessionType;
}

interface PracticeHandlers {
  onAnswerSubmit: (wasCorrect: boolean, newElo: number, problemDetails: { category: string; difficulty: number }) => void;
  onSkip: () => void;
  userElo: number;
  selectedCategories: string[];
}

const mathCategories = ["Calculus I", "Calculus II", "Linear Algebra", "Complex Analysis"];
const physicsCategories = [
    "Kinematic Equations", "Forces & Newton's Laws", "Work & Energy", "Momentum & Collisions",
    "Circular Motion & Gravitation", "Rotational Motion", "Simple Harmonic Motion", "Electric Fields & Potential",
    "Circuits & Capacitance", "Magnetic Fields & Forces", "Electromagnetic Induction", "Thermodynamics", "Quantum Mechanics"
];

export default function Workspace({ onBack, sessionType = 'default' }: WorkspaceProps) {
  const { status } = useSession(); // Get user session status
  const STARTING_ELO = 1200;

  const getInitialTabs = (): Tab[] => {
    if (sessionType === 'math') return [{ id: 1, type: 'math-practice', title: 'Math Practice' }];
    if (sessionType === 'physics') return [{ id: 1, type: 'physics-practice', title: 'Physics Practice' }];
    return [{ id: 1, type: 'notepad', title: 'CAS Notepad 1', content: '' }];
  };

  const [tabs, setTabs] = useState<Tab[]>(getInitialTabs());
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const nextTabId = useRef(2);
  const [isAddTabMenuOpen, setIsAddTabMenuOpen] = useState(false);
  
  // State is initialized with default values
  const [userElo, setUserElo] = useState(STARTING_ELO);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, skipped: 0 });
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Track current problem details for skip tracking
  const currentProblemRef = useRef<{ category: string; difficulty: number } | null>(null);
  
  // Track add tab button position for border gap
  const addTabButtonRef = useRef<HTMLDivElement>(null);
  const [addTabButtonLeft, setAddTabButtonLeft] = useState<number>(0);

  // --- NEW AND IMPROVED DATA FETCHING ---
  // This hook runs in the background without blocking the UI
  useEffect(() => {
    // Only fetch if the user is logged in and it's a practice session
    if (status === 'authenticated' && sessionType !== 'default') {
      fetch('/api/progress')
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            // When data arrives, update the state. React will then
            // seamlessly update the ELO and stats in the header.
            setUserElo(sessionType === 'math' ? data.mathElo : data.physicsElo);
            setSessionStats({
              correct: sessionType === 'math' ? data.mathCorrect : data.physicsCorrect,
              incorrect: sessionType === 'math' ? data.mathIncorrect : data.physicsIncorrect,
              skipped: sessionType === 'math' ? data.mathSkipped : data.physicsSkipped,
            });
          }
        })
        .catch(console.error); // Log errors but don't crash the page
    }
  }, [status, sessionType]);

  useEffect(() => {
    if (sessionType !== 'default') {
      setSelectedCategories(sessionType === 'math' ? mathCategories : physicsCategories);
    }
  }, [sessionType]);

  // Measure add tab button position when popup opens
  useEffect(() => {
    if (isAddTabMenuOpen && addTabButtonRef.current) {
      const rect = addTabButtonRef.current.getBoundingClientRect();
      const parentRect = addTabButtonRef.current.closest('.flex.items-center.p-2')?.getBoundingClientRect();
      if (parentRect) {
        setAddTabButtonLeft(rect.left - parentRect.left);
      }
    }
  }, [isAddTabMenuOpen]);

  // Combined handler that updates both ELO and stats together
  const handleAnswerSubmit = (
    wasCorrect: boolean,
    newElo: number,
    problemDetails: { category: string; difficulty: number }
  ) => {
    const type = wasCorrect ? 'correct' : 'incorrect';
    const eloChange = newElo - userElo;
    
    // Update UI state immediately
    setUserElo(newElo);
    setSessionStats(prev => ({ ...prev, [type]: prev[type] + 1 }));

    // Send to server if authenticated
    if (status === 'authenticated' && sessionType !== 'default') {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType,
          newElo: newElo, // Use the NEW elo, not the stale state
          statUpdate: { type },
          questionDetails: {
            category: problemDetails.category,
            difficulty: problemDetails.difficulty,
            eloChange: eloChange
          }
        }),
      }).catch(err => console.error('Failed to save progress:', err));
    }
  };

  // Handler for when user skips a question
  const handleSkip = () => {
    setSessionStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));
    
    // We don't update ELO on skip, but we still track it
    if (status === 'authenticated' && sessionType !== 'default' && currentProblemRef.current) {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType,
          newElo: userElo, // ELO stays the same for skips
          statUpdate: { type: 'skipped' },
          questionDetails: {
            category: currentProblemRef.current.category,
            difficulty: currentProblemRef.current.difficulty,
            eloChange: 0
          }
        }),
      }).catch(err => console.error('Failed to save progress:', err));
    }
    
    currentProblemRef.current = null;
  };
  
  // Called when a new problem is loaded
  const handleProblemLoad = (problemDetails: { category: string; difficulty: number }) => {
    currentProblemRef.current = problemDetails;
  };
  
  const handleCategoryToggle = (category: string) => {
    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    if (newSelection.length > 0) {
      setSelectedCategories(newSelection);
    }
  };
  
  const handleReset = async () => {
    if (sessionType === 'default') return;
    
    const confirmMessage = status === 'authenticated' 
      ? `Are you sure you want to PERMANENTLY reset your ${sessionType} ELO and ALL stats? This will delete all your ${sessionType} history and cannot be undone.`
      : `Are you sure you want to reset your ${sessionType} ELO and session stats? (This session only - not saved to database)`;
    
    if (!confirm(confirmMessage)) return;
    
    // Reset local state immediately
    setUserElo(STARTING_ELO);
    setSessionStats({ correct: 0, incorrect: 0, skipped: 0 });
    
    // If authenticated, also reset in database
    if (status === 'authenticated') {
      try {
        await fetch('/api/progress/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionType })
        });
      } catch (error) {
        console.error('Failed to reset stats in database:', error);
        alert('Failed to reset stats. Please try again.');
      }
    }
  };

  const addTab = (type: 'notepad' | 'graphing') => {
    const newId = nextTabId.current++;
    const newTab: Tab = { id: newId, type, title: `${type === 'notepad' ? 'Notepad' : 'Graph'} ${tabs.filter(t => t.type === type).length + 1}` };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setIsAddTabMenuOpen(false);
  };

  const closeTab = (tabId: number) => {
    if (tabs.find(t => t.id === tabId)?.type.includes('practice') || tabs.length <= 1) return;
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    if (activeTabId === tabId) {
      const newActiveTab = newTabs[tabIndex] || newTabs[tabIndex - 1] || newTabs[0];
      if (newActiveTab) setActiveTabId(newActiveTab.id);
    }
    setTabs(newTabs);
  };
  
  const handleContentChange = (tabId: number, newContent: string) => {
    setTabs(tabs.map(tab => tab.id === tabId ? { ...tab, content: newContent } : tab));
  };

  const currentCategoryList = sessionType === 'math' ? mathCategories : physicsCategories;

  // --- The component now returns the full UI structure immediately ---
  return (
    <div className="min-h-screen relative flex flex-col">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat dynamic-background" />
      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 flex flex-col flex-grow">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-4 flex-shrink-0 relative z-20">
          <button onClick={onBack} className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors glass px-3 py-2 rounded-lg">
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> Back to Home
          </button>
          
          {sessionType !== 'default' && (
            <div className="relative">
              <div className="flex items-center gap-4 glass px-4 py-2 rounded-lg">
                {/* Border line with gap for popup */}
                {!isCategorySelectorOpen ? (
                  // Normal full border when closed
                  <div className="absolute -bottom-[17px] left-0 right-0 h-px bg-border/50" />
                ) : (
                  // Split border with gap when open (popup is 288px wide + positioned on right)
                  <div className="absolute -bottom-[17px] left-0 right-[296px] h-px bg-border/50" />
                )}
                
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <BrainCircuit size={24} />
                  <span>{sessionType === 'math' ? 'Math' : 'Physics'} ELO: {userElo}</span>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-4">
                  <span className="flex items-center gap-3">
                    <span className="text-green-500 flex items-center gap-1">
                      <CheckCircle size={14} /> {sessionStats.correct}
                    </span>
                    <span>|</span>
                    <span className="text-red-500 flex items-center gap-1">
                      <XCircle size={14} /> {sessionStats.incorrect}
                    </span>
                    <span>|</span>
                    <span className="text-yellow-500 flex items-center gap-1">
                      <SkipForward size={14} /> {sessionStats.skipped}
                    </span>
                  </span>
                  <button onClick={handleReset} title="Reset ELO & Stats" className="text-muted-foreground hover:text-destructive">
                    <RefreshCw size={16} />
                  </button>
                </div>
                <div>
                  <button onClick={() => setIsCategorySelectorOpen(p => !p)} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
                    <SlidersHorizontal size={16} />
                    Categories
                  </button>
                </div>
              </div>
              
              <AnimatePresence>
                {isCategorySelectorOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsCategorySelectorOpen(false)} 
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 10 }} 
                      className="absolute top-full right-0 mt-2 w-72 bg-card/[0.98] backdrop-blur-xl border border-border/40 rounded-lg p-4 z-50 shadow-2xl"
                    >
                      <h3 className="text-sm font-semibold text-foreground mb-3">Filter Categories</h3>
                      <div className="max-h-60 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                        {currentCategoryList.map((cat) => (
                          <label htmlFor={cat} key={cat} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer">
                            <Checkbox checked={selectedCategories.includes(cat)} onCheckedChange={() => handleCategoryToggle(cat)} id={cat} />
                            <span className="text-sm text-foreground select-none">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-strong rounded-lg flex flex-col flex-grow relative z-10">
          <div className="flex items-center p-2 flex-shrink-0 relative">
            {/* Border line with gap for add-tab popup */}
            {!isAddTabMenuOpen ? (
              // Normal full border when closed
              <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50" />
            ) : (
              // Two segments with gap where popup appears
              <>
                {/* Left segment: from start to button */}
                <div 
                  className="absolute bottom-0 left-0 h-px bg-border/50" 
                  style={{ width: `${addTabButtonLeft}px` }}
                />
                {/* Right segment: from end of popup (button + 192px) to end */}
                <div 
                  className="absolute bottom-0 right-0 h-px bg-border/50" 
                  style={{ left: `${addTabButtonLeft + 192}px` }}
                />
              </>
            )}
            {tabs.map(tab => (
              <div key={tab.id} onClick={() => setActiveTabId(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer text-sm font-medium ${activeTabId === tab.id ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}>
                {tab.type === 'notepad' && <Notebook size={14} />}
                {tab.type === 'graphing' && <TrendingUp size={14} />}
                {tab.type.includes('practice') && <BrainCircuit size={14} />}
                <span>{tab.title}</span>
                {!tab.type.includes('practice') && (
                  <button onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }} className="ml-2 p-0.5 rounded-full hover:bg-destructive/50">
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <div ref={addTabButtonRef} className="relative ml-2">
              <button onClick={() => setIsAddTabMenuOpen(p => !p)} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50" title="Add Tab">
                <Plus size={16} />
              </button>
              <AnimatePresence>
                {isAddTabMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsAddTabMenuOpen(false)} 
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }} 
                      className="absolute top-full left-0 mt-2 w-48 bg-card/[0.98] backdrop-blur-xl border border-border/40 rounded-lg p-2 z-50 shadow-2xl"
                    >
                      <button onClick={() => addTab('notepad')} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-white/10 text-sm text-left">
                        <Notebook size={16} />
                        Notepad
                      </button>
                      <button onClick={() => addTab('graphing')} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-white/10 text-sm text-left">
                        <TrendingUp size={16} />
                        Graphing Tool
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex-grow relative">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-150 ease-in-out ${
                  activeTabId === tab.id 
                    ? 'opacity-100 z-10 pointer-events-auto' 
                    : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {tab.type === 'notepad' && (
                  <FullscreenNotepad 
                    value={tab.content || ''} 
                    onChange={(newContent) => handleContentChange(tab.id, newContent)} 
                    sessionType={sessionType} 
                  />
                )}
                {tab.type === 'graphing' && <FullscreenGraphingTool />}
                {tab.type === 'math-practice' && (
                  <MathPracticeCore 
                    userElo={userElo} 
                    onAnswerSubmit={handleAnswerSubmit}
                    onSkip={handleSkip}
                    onProblemLoad={handleProblemLoad}
                    selectedCategories={selectedCategories} 
                  />
                )}
                {tab.type === 'physics-practice' && (
                  <PhysicsPracticeCore 
                    userElo={userElo} 
                    onAnswerSubmit={handleAnswerSubmit}
                    onSkip={handleSkip}
                    onProblemLoad={handleProblemLoad}
                    selectedCategories={selectedCategories} 
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}