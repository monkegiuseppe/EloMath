// components/workspace.tsx

"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Plus, X, Notebook, TrendingUp, BrainCircuit, RefreshCw, SlidersHorizontal, Check } from "lucide-react"
import dynamic from 'next/dynamic'
import { getPlayerElo, setPlayerElo } from "../lib/elo"
import { MathPracticeCore } from "./math-practice-core"
import { PhysicsPracticeCore } from "./physics-practice-core"

const FullscreenNotepad = dynamic(() => import('./fullscreen-notepad'), { ssr: false });

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
const physicsCategories = ["Quantum Mechanics", "Quantum Field Theory", "Statistical Mechanics", "Thermodynamics", "Electromagnetism"];

export default function Workspace({ onBack, sessionType = 'default' }: WorkspaceProps) {
  const STARTING_ELO = 1200;

  const getInitialTabs = (): Tab[] => {
    if (sessionType === 'math') return [{ id: 1, type: 'math-practice', title: 'Math Practice' }];
    if (sessionType === 'physics') return [{ id: 1, type: 'physics-practice', title: 'Physics Practice' }];
    return [{ id: 1, type: 'notepad', title: 'CAS Notepad 1', content: '' }];
  };

  const [tabs, setTabs] = useState<Tab[]>(getInitialTabs());
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const nextTabId = useRef(2);

  const [userElo, setUserElo] = useState(STARTING_ELO);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, skipped: 0 });
  
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (sessionType !== 'default') {
      const initialElo = getPlayerElo(sessionType);
      setUserElo(initialElo);
      setSelectedCategories(sessionType === 'math' ? mathCategories : physicsCategories);
    }
  }, [sessionType]);

  const handleEloUpdate = (newElo: number) => {
    if (sessionType !== 'default') {
      setUserElo(newElo);
      setPlayerElo(newElo, sessionType);
    }
  };

  const handleStatsUpdate = (type: 'correct' | 'incorrect' | 'skipped') => {
    setSessionStats(prev => ({ ...prev, [type]: prev[type] + 1 }));
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
    if (sessionType === 'default') return;
    // A simple confirmation before resetting
    if (confirm(`Are you sure you want to reset your ${sessionType} ELO and session stats?`)) {
      setPlayerElo(STARTING_ELO, sessionType);
      setUserElo(STARTING_ELO);
      setSessionStats({ correct: 0, incorrect: 0, skipped: 0 });
    }
  };

  const addTab = (type: 'notepad' | 'graphing') => {
    const newId = nextTabId.current++;
    const newTab: Tab = {
      id: newId, type,
      title: `${type === 'notepad' ? 'Notepad' : 'Graph'} ${tabs.filter(t => t.type === type).length + 1}`,
      content: '',
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: number) => {
    const isPracticeTab = tabs.find(t => t.id === tabId)?.type.includes('practice');
    if (isPracticeTab || tabs.length <= 1) return;

    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);

    if (activeTabId === tabId) {
      const newActiveTab = newTabs[tabIndex] || newTabs[tabIndex - 1] || newTabs[0];
      if (newActiveTab) setActiveTabId(newActiveTab.id);
    }
    setTabs(newTabs);
  };
  
  const handleContentChange = (newContent: string) => {
    setTabs(tabs.map(tab => tab.id === activeTabId ? { ...tab, content: newContent } : tab));
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const currentCategoryList = sessionType === 'math' ? mathCategories : physicsCategories;

  return (
    <div className="min-h-screen relative flex flex-col">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat dynamic-background" />
      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 flex flex-col flex-grow">
        <motion.header 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex items-center justify-between mb-4 flex-shrink-0 relative z-20"
        >
          <button onClick={onBack} className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors glass px-3 py-2 rounded-lg">
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> Back to Home
          </button>
          
          {sessionType !== 'default' && (
            <div className="flex items-center gap-4 glass px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <BrainCircuit size={24} />
                <span>{sessionType === 'math' ? 'Math' : 'Physics'} ELO: {userElo}</span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-4">
                <span>
                  <span className="text-green-500">✓ {sessionStats.correct}</span> | <span className="text-red-500">✗ {sessionStats.incorrect}</span> | <span className="text-yellow-500">» {sessionStats.skipped}</span>
                </span>
                <button onClick={handleReset} title="Reset ELO & Stats" className="text-muted-foreground hover:text-destructive">
                  <RefreshCw size={16} />
                </button>
              </div>
              <div className="relative">
                <button onClick={() => setIsCategorySelectorOpen(p => !p)} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
                  <SlidersHorizontal size={16} />
                  Categories
                </button>
                <AnimatePresence>
                  {isCategorySelectorOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      // UPDATED: Used the .glass-strong utility class for a more intense blur and consistent styling
                      className="absolute top-full right-0 mt-2 w-72 glass-strong rounded-lg p-4 z-30"
                    >
                      <h3 className="text-sm font-semibold text-foreground mb-3">Filter Categories</h3>
                      <div className="max-h-60 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                        {currentCategoryList.map((cat) => (
                          <label key={cat} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(cat)}
                              onChange={() => handleCategoryToggle(cat)}
                              className="h-4 w-4 rounded bg-transparent border-muted-foreground text-primary focus:ring-primary focus:ring-offset-0"
                            />
                            <span className="text-sm text-foreground select-none">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }} 
          className="glass-strong rounded-lg flex flex-col flex-grow relative z-10"
        >
          <div className="flex items-center border-b border-border/50 p-2 flex-shrink-0">
            {tabs.map(tab => (
              <div key={tab.id} onClick={() => setActiveTabId(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer text-sm font-medium ${activeTabId === tab.id ? 'bg-primary/20 text-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}>
                {tab.type.includes('notepad') && <Notebook size={14} />}
                {tab.type.includes('practice') && <BrainCircuit size={14} />}
                <span>{tab.title}</span>
                {!tab.type.includes('practice') && (
                  <button onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }} className="ml-2 p-0.5 rounded-full hover:bg-destructive/50">
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => addTab('notepad')} className="ml-2 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50" title="Add Notepad Tab">
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-grow relative">
            {activeTab?.type === 'notepad' && <FullscreenNotepad value={activeTab.content || ''} onChange={handleContentChange} />}
            {activeTab?.type === 'math-practice' && <MathPracticeCore userElo={userElo} onEloUpdate={handleEloUpdate} onStatsUpdate={handleStatsUpdate} selectedCategories={selectedCategories} />}
            {activeTab?.type === 'physics-practice' && <PhysicsPracticeCore userElo={userElo} onEloUpdate={handleEloUpdate} onStatsUpdate={handleStatsUpdate} selectedCategories={selectedCategories} />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
