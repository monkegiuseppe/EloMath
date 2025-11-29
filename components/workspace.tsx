// components/workspace.tsx

"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Plus, X, Notebook, TrendingUp, BrainCircuit, RefreshCw, SlidersHorizontal, CheckCircle, XCircle, SkipForward, Loader2 } from "lucide-react"
import dynamic from 'next/dynamic'
import { MathPracticeCore } from "./math-practice-core"
import { PhysicsPracticeCore } from "./physics-practice-core"
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DifficultySelector from "./difficulty-selector";
import MergeProgressModal from "./merge-progress-modal";
import {
  getAnonymousProgress,
  saveAnonymousProgress,
  clearAnonymousProgress,
  hasAnonymousProgress,
  type AnonymousProgress
} from "@/lib/anonymous-progress";

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

const mathCategories = ["Arithmetic", "Pre-Algebra", "Algebra I", "Geometry", "Algebra II", "Pre-Calculus", "Calculus I", "Calculus II", "Calculus III", "Differential Equations", "Linear Algebra"];
const physicsCategories = [
  "Kinematic Equations", "Forces & Newton's Laws", "Work & Energy", "Momentum & Collisions",
  "Circular Motion & Gravitation", "Rotational Motion", "Simple Harmonic Motion", "Electric Fields & Potential",
  "Circuits & Capacitance", "Magnetic Fields & Forces", "Electromagnetic Induction", "Thermodynamics", "Quantum Mechanics"
];

export default function Workspace({ onBack, sessionType = 'default' }: WorkspaceProps) {
  const { status } = useSession();
  const STARTING_ELO = 1200;

  const getInitialTabs = (): Tab[] => {
    if (sessionType === 'math') return [{ id: 1, type: 'math-practice', title: 'Math Practice' }];
    if (sessionType === 'physics') return [{ id: 1, type: 'physics-practice', title: 'Physics Practice' }];
    return [{ id: 1, type: 'notepad', title: 'CAS Notepad 1', content: '' }];
  };

  const [tabs, setTabs] = useState<Tab[]>(getInitialTabs());
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const nextTabId = useRef(2);

  const [isEloLoaded, setIsEloLoaded] = useState(false);
  const [userElo, setUserElo] = useState<number | null>(null);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [practiceKey, setPracticeKey] = useState(0);

  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, skipped: 0 });
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [seenQuestionIds, setSeenQuestionIds] = useState<string[]>([]);

  const currentProblemRef = useRef<{ category: string; difficulty: number } | null>(null);

  const addTabButtonRef = useRef<HTMLDivElement>(null);
  const [addTabButtonLeft, setAddTabButtonLeft] = useState<number>(0);
  const [isAddTabMenuOpen, setIsAddTabMenuOpen] = useState(false);

  const prevActiveTabIdRef = useRef<number>(activeTabId);

  const [showMergeModal, setShowMergeModal] = useState(false);
  const [anonymousProgressData, setAnonymousProgressData] = useState<AnonymousProgress | null>(null);
  const [existingAccountProgress, setExistingAccountProgress] = useState<any>(null);
  const mergeCheckDone = useRef(false);
  const mergeCompleted = useRef(false);

  const handleQuestionSeen = useCallback((questionId: string) => {
    setSeenQuestionIds(prev => {
      if (prev.includes(questionId)) return prev;
      return [...prev, questionId];
    });
  }, []);

  const handleCycleReset = useCallback(() => {
    setSeenQuestionIds([]);
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && sessionType !== 'default' && !mergeCheckDone.current) {
      mergeCheckDone.current = true;

      const anonProgress = getAnonymousProgress();
      if (anonProgress && hasAnonymousProgress()) {
        setAnonymousProgressData(anonProgress);

        fetch('/api/progress')
          .then(res => res.json())
          .then(data => {
            if (data && !data.error) {
              setExistingAccountProgress(data);
            }
            setShowMergeModal(true);
          })
          .catch(() => {
            setShowMergeModal(true);
          });
      }
    }
  }, [status, sessionType]);

  useEffect(() => {
    if (showMergeModal) return;
    if (mergeCompleted.current) return;

    if (status === 'authenticated' && sessionType !== 'default') {
      setIsEloLoaded(false);
      fetch('/api/progress')
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            const currentElo = sessionType === 'math' ? data.mathElo : data.physicsElo;
            const totalAttempts = sessionType === 'math'
              ? (data.mathCorrect + data.mathIncorrect + data.mathSkipped)
              : (data.physicsCorrect + data.physicsIncorrect + data.physicsSkipped);

            setUserElo(currentElo);
            setSessionStats({
              correct: sessionType === 'math' ? data.mathCorrect : data.physicsCorrect,
              incorrect: sessionType === 'math' ? data.mathIncorrect : data.physicsIncorrect,
              skipped: sessionType === 'math' ? data.mathSkipped : data.physicsSkipped,
            });

            if (totalAttempts === 0 && currentElo === 1200) {
              setShowDifficultySelector(true);
            }
          } else {
            setUserElo(STARTING_ELO);
            setShowDifficultySelector(true);
          }
        })
        .catch(err => {
          console.error(err);
          setUserElo(STARTING_ELO);
        })
        .finally(() => {
          setIsEloLoaded(true);
        });
    } else if (status === 'unauthenticated' && sessionType !== 'default') {
      const anonProgress = getAnonymousProgress();

      if (anonProgress) {
        const hasProgress = sessionType === 'math'
          ? (anonProgress.mathCorrect + anonProgress.mathIncorrect + anonProgress.mathSkipped) > 0 || anonProgress.mathElo !== 1200
          : (anonProgress.physicsCorrect + anonProgress.physicsIncorrect + anonProgress.physicsSkipped) > 0 || anonProgress.physicsElo !== 1200;

        if (hasProgress) {
          if (sessionType === 'math') {
            setUserElo(anonProgress.mathElo);
            setSessionStats({
              correct: anonProgress.mathCorrect,
              incorrect: anonProgress.mathIncorrect,
              skipped: anonProgress.mathSkipped,
            });
          } else {
            setUserElo(anonProgress.physicsElo);
            setSessionStats({
              correct: anonProgress.physicsCorrect,
              incorrect: anonProgress.physicsIncorrect,
              skipped: anonProgress.physicsSkipped,
            });
          }
          setIsEloLoaded(true);
          return;
        }
      }

      setShowDifficultySelector(true);
      setUserElo(STARTING_ELO);
      setIsEloLoaded(true);
    } else {
      setIsEloLoaded(true);
    }
  }, [status, sessionType, showMergeModal]);

  useEffect(() => {
    if (sessionType !== 'default') {
      setSelectedCategories(sessionType === 'math' ? mathCategories : physicsCategories);
    }
  }, [sessionType]);

  useEffect(() => {
    if (isAddTabMenuOpen && addTabButtonRef.current) {
      const rect = addTabButtonRef.current.getBoundingClientRect();
      const parentRect = addTabButtonRef.current.closest('.relative.overflow-x-auto')?.getBoundingClientRect();
      if (parentRect) {
        setAddTabButtonLeft(rect.left - parentRect.left);
      }
    }
  }, [isAddTabMenuOpen]);

  useEffect(() => {
    prevActiveTabIdRef.current = activeTabId;
  }, [activeTabId]);

  const handleMergeProgress = async (strategy: 'replace' | 'combine' | 'keep_best' | 'discard') => {
    if (strategy === 'discard') {
      clearAnonymousProgress();
      setShowMergeModal(false);
      setAnonymousProgressData(null);
      return;
    }

    try {
      const response = await fetch('/api/progress/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymousProgress: anonymousProgressData,
          mergeStrategy: strategy,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        mergeCompleted.current = true;

        if (sessionType === 'math') {
          setUserElo(data.progress.mathElo);
          setSessionStats({
            correct: data.progress.mathCorrect,
            incorrect: data.progress.mathIncorrect,
            skipped: data.progress.mathSkipped,
          });
        } else if (sessionType === 'physics') {
          setUserElo(data.progress.physicsElo);
          setSessionStats({
            correct: data.progress.physicsCorrect,
            incorrect: data.progress.physicsIncorrect,
            skipped: data.progress.physicsSkipped,
          });
        }

        clearAnonymousProgress();
        setIsEloLoaded(true);
        setShowDifficultySelector(false);
      }
    } catch (error) {
      console.error('Failed to merge progress:', error);
    }

    setShowMergeModal(false);
    setAnonymousProgressData(null);
  };

  const handleDifficultySelect = (selectedElo: number) => {
    setUserElo(selectedElo);
    setShowDifficultySelector(false);
    setPracticeKey(prev => prev + 1);
    setSeenQuestionIds([]);

    if (status === 'authenticated' && sessionType !== 'default') {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType,
          newElo: selectedElo,
        }),
      }).catch(err => console.error('Failed to save starting ELO:', err));
    } else if (status === 'unauthenticated' && sessionType !== 'default') {
      if (sessionType === 'math') {
        saveAnonymousProgress({
          mathElo: selectedElo,
          mathCorrect: 0,
          mathIncorrect: 0,
          mathSkipped: 0,
        });
      } else {
        saveAnonymousProgress({
          physicsElo: selectedElo,
          physicsCorrect: 0,
          physicsIncorrect: 0,
          physicsSkipped: 0,
        });
      }
    }
  };

  const handleAnswerSubmit = (
    wasCorrect: boolean,
    newElo: number,
    problemDetails: { category: string; difficulty: number }
  ) => {
    if (userElo === null) return;

    const type = wasCorrect ? 'correct' : 'incorrect';
    const eloChange = newElo - userElo;

    setUserElo(newElo);
    setSessionStats(prev => ({ ...prev, [type]: prev[type] + 1 }));

    if (status === 'authenticated' && sessionType !== 'default') {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType,
          newElo: newElo,
          statUpdate: { type },
          questionDetails: {
            category: problemDetails.category,
            difficulty: problemDetails.difficulty,
            eloChange: eloChange
          }
        }),
      }).catch(err => console.error('Failed to save progress:', err));
    } else if (status === 'unauthenticated' && sessionType !== 'default') {
      const newStats = { ...sessionStats, [type]: sessionStats[type] + 1 };

      if (sessionType === 'math') {
        saveAnonymousProgress({
          mathElo: newElo,
          mathCorrect: newStats.correct,
          mathIncorrect: newStats.incorrect,
          mathSkipped: newStats.skipped,
        });
      } else {
        saveAnonymousProgress({
          physicsElo: newElo,
          physicsCorrect: newStats.correct,
          physicsIncorrect: newStats.incorrect,
          physicsSkipped: newStats.skipped,
        });
      }
    }
  };

  const handleSkip = () => {
    setSessionStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));

    if (status === 'authenticated' && sessionType !== 'default' && currentProblemRef.current && userElo !== null) {
      const difficulty = currentProblemRef.current.difficulty;

      const expectedScore = 1 / (1 + Math.pow(10, (difficulty - userElo) / 400));
      const SKIP_K_FACTOR = 5;
      const eloDrop = Math.round(SKIP_K_FACTOR * expectedScore);
      const newElo = userElo - eloDrop;

      setUserElo(newElo);

      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType,
          newElo: newElo,
          statUpdate: { type: 'skipped' },
          questionDetails: {
            category: currentProblemRef.current.category,
            difficulty: currentProblemRef.current.difficulty,
            eloChange: -eloDrop
          }
        }),
      }).catch(err => console.error('Failed to save progress:', err));
    } else if (status === 'unauthenticated' && sessionType !== 'default' && userElo !== null) {
      let newElo = userElo;

      if (currentProblemRef.current) {
        const difficulty = currentProblemRef.current.difficulty;
        const expectedScore = 1 / (1 + Math.pow(10, (difficulty - userElo) / 400));
        const SKIP_K_FACTOR = 5;
        const eloDrop = Math.round(SKIP_K_FACTOR * expectedScore);
        newElo = userElo - eloDrop;
        setUserElo(newElo);
      }

      const newStats = { ...sessionStats, skipped: sessionStats.skipped + 1 };

      if (sessionType === 'math') {
        saveAnonymousProgress({
          mathElo: newElo,
          mathCorrect: newStats.correct,
          mathIncorrect: newStats.incorrect,
          mathSkipped: newStats.skipped,
        });
      } else {
        saveAnonymousProgress({
          physicsElo: newElo,
          physicsCorrect: newStats.correct,
          physicsIncorrect: newStats.incorrect,
          physicsSkipped: newStats.skipped,
        });
      }
    }

    currentProblemRef.current = null;
  };

  const handleProblemLoad = (problemDetails: { category: string; difficulty: number }) => {
    currentProblemRef.current = problemDetails;
  };

  const handleCategoryToggle = (category: string) => {
    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    if (newSelection.length > 0) {
      setSelectedCategories(newSelection);
      setSeenQuestionIds([]);
    }
  };

  const handleReset = async () => {
    if (sessionType === 'default') return;

    const confirmMessage = status === 'authenticated'
      ? `Are you sure you want to PERMANENTLY reset your ${sessionType} ELO and ALL stats? This will delete all your ${sessionType} history and cannot be undone.`
      : `Are you sure you want to reset your ${sessionType} ELO and session stats?`;

    if (!confirm(confirmMessage)) return;

    setShowDifficultySelector(true);
    setUserElo(1200);
    setSessionStats({ correct: 0, incorrect: 0, skipped: 0 });
    setPracticeKey(prev => prev + 1);
    setSeenQuestionIds([]);
    mergeCompleted.current = false;

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
    } else {
      if (sessionType === 'math') {
        saveAnonymousProgress({
          mathElo: 1200,
          mathCorrect: 0,
          mathIncorrect: 0,
          mathSkipped: 0,
        });
      } else {
        saveAnonymousProgress({
          physicsElo: 1200,
          physicsCorrect: 0,
          physicsIncorrect: 0,
          physicsSkipped: 0,
        });
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

  return (
    <div className="min-h-screen relative flex flex-col">
      {anonymousProgressData && (
        <MergeProgressModal
          isOpen={showMergeModal}
          onClose={() => {
            setShowMergeModal(false);
            clearAnonymousProgress();
            setAnonymousProgressData(null);
          }}
          anonymousProgress={anonymousProgressData}
          existingProgress={existingAccountProgress}
          onMerge={handleMergeProgress}
        />
      )}

      <DifficultySelector
        isOpen={showDifficultySelector && !showMergeModal}
        onSelect={handleDifficultySelect}
      />

      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat dynamic-background" />
      <div className="relative z-10 w-full max-w-7xl mx-auto p-2 sm:p-4 flex flex-col flex-grow overflow-y-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between lg:mb-8 flex-shrink-0 relative z-20 pr-0 lg:pr-64">
          <button onClick={onBack} className="self-start group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors glass px-3 py-2 rounded-lg whitespace-nowrap">
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> Back to Home
          </button>

          {sessionType !== 'default' && (
            <div className="relative w-full lg:w-auto">
              <div className="flex flex-row items-center gap-4 glass px-4 py-3 rounded-lg text-sm lg:text-base w-full lg:w-auto flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground whitespace-nowrap">
                    <BrainCircuit size={24} />
                    <span>
                      {sessionType === 'math' ? 'Math' : 'Physics'} ELO:
                      {!isEloLoaded || userElo === null ? (
                        <span className="ml-2 animate-pulse bg-muted/50 rounded h-6 w-12 inline-block align-middle" />
                      ) : (
                        ` ${userElo}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-3 sm:gap-4">
                    <span className="flex items-center gap-1 sm:gap-3">
                      <span className="text-green-500 flex items-center gap-1">
                        <CheckCircle size={14} /> {sessionStats.correct}
                      </span>
                      <span className="opacity-30">|</span>
                      <span className="text-red-500 flex items-center gap-1">
                        <XCircle size={14} /> {sessionStats.incorrect}
                      </span>
                      <span className="opacity-30">|</span>
                      <span className="text-yellow-500 flex items-center gap-1">
                        <SkipForward size={14} /> {sessionStats.skipped}
                      </span>
                    </span>
                    <button onClick={handleReset} title="Reset ELO & Stats" className="text-muted-foreground hover:text-destructive ml-2">
                      <RefreshCw size={16} />
                    </button>
                  </div>

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
                      className="absolute top-full right-0 mt-2 w-full sm:w-72 bg-card/[0.98] backdrop-blur-xl border border-border/40 rounded-lg p-4 z-50 shadow-2xl"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg flex flex-col flex-grow relative z-10 border-0 overflow-hidden"
        >
          <div className="flex items-center p-2 flex-shrink-0 relative overflow-x-auto no-scrollbar">
            {!isAddTabMenuOpen ? (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50 w-full" />
            ) : (
              <>
                <div
                  className="absolute bottom-0 left-0 h-px bg-border/50"
                  style={{ width: `${addTabButtonLeft}px` }}
                />
                <div
                  className="absolute bottom-0 right-0 h-px bg-border/50"
                  style={{ left: `${addTabButtonLeft + 192}px` }}
                />
              </>
            )}
            {tabs.map(tab => (
              <div key={tab.id} onClick={() => setActiveTabId(tab.id)} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer text-sm font-medium whitespace-nowrap ${activeTabId === tab.id ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}>
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
            <div ref={addTabButtonRef} className="relative ml-2 flex-shrink-0">
              <DropdownMenu open={isAddTabMenuOpen} onOpenChange={setIsAddTabMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 outline-none" title="Add Tab">
                    <Plus size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={8} className="w-48 bg-card/[0.98] backdrop-blur-xl border-border/40 z-50">
                  <DropdownMenuItem onClick={() => addTab('notepad')} className="gap-2 cursor-pointer">
                    <Notebook size={16} />
                    Notepad
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addTab('graphing')} className="gap-2 cursor-pointer">
                    <TrendingUp size={16} />
                    Graphing Tool
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex-grow relative min-h-[450px]">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`absolute inset-0 w-full h-full overflow-y-auto transition-opacity duration-150 ease-in-out ${activeTabId === tab.id
                  ? 'opacity-100 z-10 pointer-events-auto'
                  : 'opacity-0 z-0 pointer-events-none'
                  }`}
              >
                {tab.type === 'notepad' && (
                  <FullscreenNotepad
                    value={tab.content || ''}
                    onChange={(newContent) => handleContentChange(tab.id, newContent)}
                    sessionType={sessionType}
                    isActive={activeTabId === tab.id}
                  />
                )}
                {tab.type === 'graphing' && <FullscreenGraphingTool />}

                {tab.type === 'math-practice' && (
                  isEloLoaded && userElo !== null && !showMergeModal ? (
                    <MathPracticeCore
                      key={practiceKey}
                      userElo={userElo}
                      onAnswerSubmit={handleAnswerSubmit}
                      onSkip={handleSkip}
                      onProblemLoad={handleProblemLoad}
                      selectedCategories={selectedCategories}
                      seenQuestionIds={seenQuestionIds}
                      onQuestionSeen={handleQuestionSeen}
                      onCycleReset={handleCycleReset}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  )
                )}
                {tab.type === 'physics-practice' && (
                  isEloLoaded && userElo !== null && !showMergeModal ? (
                    <PhysicsPracticeCore
                      key={practiceKey}
                      userElo={userElo}
                      onAnswerSubmit={handleAnswerSubmit}
                      onSkip={handleSkip}
                      onProblemLoad={handleProblemLoad}
                      selectedCategories={selectedCategories}
                      seenQuestionIds={seenQuestionIds}
                      onQuestionSeen={handleQuestionSeen}
                      onCycleReset={handleCycleReset}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}