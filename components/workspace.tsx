// components/workspace.tsx

"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"; // To check if the user is logged in
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Plus, X, Notebook, TrendingUp, BrainCircuit, RefreshCw, SlidersHorizontal } from "lucide-react"
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
  
  // Track current problem details for progress tracking
  const [currentProblemDetails, setCurrentProblemDetails] = useState<{
    category: string;
    difficulty: number;
  } | null>(null);

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

  // Handler to optimistically update the UI, then send changes to the server
  const handleEloUpdate = (newElo: number, problemDetails?: { category: string; difficulty: number }) => {
    const oldElo = userElo;
    setUserElo(newElo);
    
    // Store problem details for the next stats update
    if (problemDetails) {
      setCurrentProblemDetails(problemDetails);
    }
  };

  // Handler to optimistically update stats and send changes to the server
  const handleStatsUpdate = (type: 'correct' | 'incorrect' | 'skipped') => {
    // Update the UI state immediately for a responsive feel
    setSessionStats(prev => ({ ...prev, [type]: prev[type] + 1 }));

    // Only send the update to the server if the user is logged in
    if (status === 'authenticated' && sessionType !== 'default') {
      // Calculate ELO change
      const eloChange = type === 'correct' || type === 'incorrect' 
        ? userElo - (sessionStats.correct + sessionStats.incorrect + sessionStats.skipped === 0 ? STARTING_ELO : userElo)
        : 0;

      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType,
          newElo: userElo,
          statUpdate: { type },
          questionDetails: currentProblemDetails ? {
            category: currentProblemDetails.category,
            difficulty: currentProblemDetails.difficulty,
            eloChange: eloChange
          } : null
        }),
      });
    }
    
    // Clear problem details after tracking
    setCurrentProblemDetails(null);
  };
  
  const handleCategoryToggle = (category: string) => {
    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    if (newSelection.length > 0) {
      setSelectedCategories(newSelection);
    }
  };
  
  const handleReset = () => {
    if (sessionType === 'default' || !confirm(`Are you sure you want to reset your ${sessionType} ELO and session stats for this session? This action is not yet saved to the database.`)) return;
    setUserElo(STARTING_ELO);
    setSessionStats({ correct: 0, incorrect: 0, skipped: 0 });
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
            <div className="relative flex items-center gap-4 glass px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground"><BrainCircuit size={24} /><span>{sessionType === 'math' ? 'Math' : 'Physics'} ELO: {userElo}</span></div>
              <div className="text-sm text-muted-foreground flex items-center gap-4">
                <span><span className="text-green-500">✓ {sessionStats.correct}</span> | <span className="text-red-500">✗ {sessionStats.incorrect}</span> | <span className="text-yellow-500">» {sessionStats.skipped}</span></span>
                <button onClick={handleReset} title="Reset ELO & Stats" className="text-muted-foreground hover:text-destructive"><RefreshCw size={16} /></button>
              </div>
              <div>
                <button onClick={() => setIsCategorySelectorOpen(p => !p)} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md hover:bg-muted/50 transition-colors"><SlidersHorizontal size={16} />Categories</button>
                <AnimatePresence>
                  {isCategorySelectorOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-72 glass-strong rounded-lg p-4 z-30">
                      <h3 className="text-sm font-semibold text-foreground mb-3">Filter Categories</h3>
                      <div className="max-h-60 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                        {currentCategoryList.map((cat) => (<label htmlFor={cat} key={cat} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer"><Checkbox checked={selectedCategories.includes(cat)} onCheckedChange={() => handleCategoryToggle(cat)} id={cat} /><span className="text-sm text-foreground select-none">{cat}</span></label>))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-strong rounded-lg flex flex-col flex-grow relative z-10">
          <div className="flex items-center border-b border-border/50 p-2 flex-shrink-0">
            {tabs.map(tab => (
              <div key={tab.id} onClick={() => setActiveTabId(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer text-sm font-medium ${activeTabId === tab.id ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}>
                {tab.type === 'notepad' && <Notebook size={14} />}
                {tab.type === 'graphing' && <TrendingUp size={14} />}
                {tab.type.includes('practice') && <BrainCircuit size={14} />}
                <span>{tab.title}</span>
                {!tab.type.includes('practice') && (<button onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }} className="ml-2 p-0.5 rounded-full hover:bg-destructive/50"><X size={14} /></button>)}
              </div>
            ))}
            <div className="relative ml-2">
              <button onClick={() => setIsAddTabMenuOpen(p => !p)} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50" title="Add Tab"><Plus size={16} /></button>
              <AnimatePresence>
                {isAddTabMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 mt-2 w-48 glass-strong rounded-lg p-2 z-30">
                    <button onClick={() => addTab('notepad')} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-white/10 text-sm text-left"><Notebook size={16} />Notepad</button>
                    <button onClick={() => addTab('graphing')} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-white/10 text-sm text-left"><TrendingUp size={16} />Graphing Tool</button>
                  </motion.div>
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
                    onEloUpdate={handleEloUpdate} 
                    onStatsUpdate={handleStatsUpdate} 
                    selectedCategories={selectedCategories} 
                  />
                )}
                {tab.type === 'physics-practice' && (
                  <PhysicsPracticeCore 
                    userElo={userElo} 
                    onEloUpdate={handleEloUpdate} 
                    onStatsUpdate={handleStatsUpdate} 
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