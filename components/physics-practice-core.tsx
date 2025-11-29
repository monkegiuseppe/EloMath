// components/physics-practice-core.tsx

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { FC } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, SkipForward, Loader2, Flag, ArrowRight, RefreshCcw } from "lucide-react"
import { checkAnswer } from "../lib/answer-verification"
import ProblemRenderer from "./problem-renderer"
import FormattingGuideModal from "./formatting-guide-modal"
import ReportModal from "./report-modal"
import dynamic from 'next/dynamic'
import { Button } from "./ui/button"

const MathAnswerInput = dynamic(() => import('./math-answer-input'), { ssr: false });

interface PhysicsPracticeCoreProps {
  userElo: number;
  onAnswerSubmit: (wasCorrect: boolean, newElo: number, problemDetails: { category: string; difficulty: number }) => void;
  onSkip: () => void;
  onProblemLoad: (problemDetails: { category: string; difficulty: number }) => void;
  selectedCategories: string[];
  seenQuestionIds: string[];
  onQuestionSeen: (id: string) => void;
  onCycleReset: () => void;
}

interface ProblemData {
  id: string;
  customId?: string;
  topic: string;
  category: string;
  difficulty: number;
  problem: string;
  answer: string;
  unit?: string;
  _cycleReset?: boolean;
}

interface Feedback {
  type: 'correct' | 'incorrect';
  message: string;
  correctAnswer: string | number;
  eloChange: number;
}

export const PhysicsPracticeCore: FC<PhysicsPracticeCoreProps> = ({
  userElo,
  onAnswerSubmit,
  onSkip,
  onProblemLoad,
  selectedCategories,
  seenQuestionIds,
  onQuestionSeen,
  onCycleReset
}) => {
  const [currentProblem, setCurrentProblem] = useState<ProblemData | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [problemKey, setProblemKey] = useState(0);
  const [cycleComplete, setCycleComplete] = useState(false);

  const feedbackTimestampRef = useRef<number>(0);

  const getNewProblem = useCallback(async () => {
    if (selectedCategories.length === 0) return;

    setIsLoading(true);
    setFeedback(null);
    setUserAnswer("");
    setCycleComplete(false);

    try {
      const params = new URLSearchParams({
        subject: 'physics',
        elo: userElo.toString(),
        categories: selectedCategories.join(','),
        excludeIds: seenQuestionIds.join(',')
      });

      const res = await fetch(`/api/problems?${params.toString()}`);
      const data = await res.json();

      if (data.error) {
        console.warn(data.error);
        setCurrentProblem(null);
      } else {
        if (data._cycleReset) {
          setCycleComplete(true);
        }

        setCurrentProblem(data);
        setProblemKey(prev => prev + 1);

        const questionId = data.customId || data.id;
        if (questionId) {
          onQuestionSeen(questionId);
        }

        onProblemLoad({
          category: data.category,
          difficulty: data.difficulty
        });
      }
    } catch (error) {
      console.error("Failed to load problem", error);
    } finally {
      setIsLoading(false);
    }
  }, [userElo, selectedCategories, seenQuestionIds, onProblemLoad, onQuestionSeen]);

  useEffect(() => {
    getNewProblem();
  }, [selectedCategories]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (feedback && e.key === 'Enter') {
        const timeSinceFeedback = Date.now() - feedbackTimestampRef.current;
        if (timeSinceFeedback < 300) {
          return;
        }

        e.preventDefault();
        getNewProblem();
      }
    };

    if (feedback) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [feedback, getNewProblem]);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim() || !currentProblem || feedback) return;

    const wasCorrect = checkAnswer(userAnswer, currentProblem.answer);

    const score = wasCorrect ? 1 : 0;
    const expectedScore = 1 / (1 + Math.pow(10, (currentProblem.difficulty - userElo) / 400));
    const kFactor = 32;
    const newElo = Math.round(userElo + kFactor * (score - expectedScore));
    const eloChange = newElo - userElo;

    onAnswerSubmit(wasCorrect, newElo, {
      category: currentProblem.category,
      difficulty: currentProblem.difficulty
    });

    feedbackTimestampRef.current = Date.now();

    setFeedback({
      type: wasCorrect ? "correct" : "incorrect",
      message: wasCorrect ? "Correct Answer!" : "Incorrect Answer",
      correctAnswer: currentProblem.answer + (currentProblem.unit ? ` ${currentProblem.unit}` : ""),
      eloChange: eloChange
    });
  };

  const handleSkip = () => {
    onSkip();
    getNewProblem();
  };

  const handleStartNewCycle = () => {
    onCycleReset();
    setCycleComplete(false);
    setTimeout(() => getNewProblem(), 100);
  };

  return (
    <>
      <FormattingGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        questionData={currentProblem ? {
          id: currentProblem.id,
          problem: currentProblem.problem,
          category: currentProblem.category
        } : null}
      />

      <div className="w-full h-full min-h-[600px] p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center overflow-y-auto">
        <div className="w-full max-w-3xl">
          <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4 sm:p-8 min-h-[24rem] mb-6 relative overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-card/80 backdrop-blur-sm rounded-2xl">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
              </div>
            )}

            <AnimatePresence mode="wait">
              {cycleComplete && !feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 right-4 z-10"
                >
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-amber-400">
                      You've seen all available questions! Starting a new cycle.
                    </span>
                    <button
                      onClick={handleStartNewCycle}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-sm"
                    >
                      <RefreshCcw size={14} />
                      Reset
                    </button>
                  </div>
                </motion.div>
              )}

              {!isLoading && currentProblem ? (
                <motion.div
                  key={`${currentProblem.id}-${problemKey}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                      {currentProblem.topic}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">
                        Difficulty: <span className="text-foreground font-bold">{currentProblem.difficulty}</span>
                      </span>
                      <button
                        onClick={() => setIsReportOpen(true)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10"
                        title="Report an issue with this question"
                      >
                        <Flag size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-grow mb-8">
                    <div className="text-xl md:text-2xl leading-relaxed font-medium text-foreground">
                      <ProblemRenderer text={currentProblem.problem} />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-auto space-y-6">
                    {!feedback && (
                      <div>
                        <MathAnswerInput
                          value={userAnswer}
                          onChange={setUserAnswer}
                          onSubmit={handleSubmit}
                          disabled={!!feedback}
                          placeholder={currentProblem.unit ? `Answer in ${currentProblem.unit}...` : "Your Answer..."}
                          onOpenGuide={() => setIsGuideOpen(true)}
                        />
                        {currentProblem.unit && (
                          <p className="text-xs text-muted-foreground mt-2 ml-1 flex items-center gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full" /> Expected unit: <span className="font-medium text-foreground">{currentProblem.unit}</span>
                          </p>
                        )}
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      {feedback && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className={`rounded-xl border-2 p-6 ${feedback.type === "correct"
                            ? "bg-green-500/10 border-green-500/30"
                            : "bg-red-500/10 border-red-500/30"
                            }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${feedback.type === 'correct' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                              {feedback.type === "correct" ? <CheckCircle size={28} /> : <XCircle size={28} />}
                            </div>

                            <div className="flex-1 space-y-1">
                              <h3 className={`text-xl font-bold ${feedback.type === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                                {feedback.message}
                              </h3>
                              <div className="flex items-center gap-2 text-lg">
                                <span className="text-muted-foreground">ELO Change:</span>
                                <span className={`font-bold ${feedback.eloChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {feedback.eloChange >= 0 ? '+' : ''}{feedback.eloChange}
                                </span>
                              </div>
                              {feedback.type === "incorrect" && (
                                <div className="mt-3 pt-3 border-t border-border/10">
                                  <p className="text-sm text-muted-foreground mb-1">Correct Answer:</p>
                                  <p className="font-mono text-lg text-foreground">{feedback.correctAnswer}</p>
                                </div>
                              )}
                            </div>

                            <Button
                              type="button"
                              size="lg"
                              onClick={getNewProblem}
                              className={feedback.type === 'correct' ? "bg-green-600 hover:bg-green-500" : ""}
                            >
                              Next Problem <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-4 text-center">Press Enter to continue</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!feedback && (
                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={handleSkip}
                          className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <SkipForward size={16} /> Skip Question
                        </button>

                        <Button
                          type="submit"
                          size="lg"
                          disabled={!userAnswer.trim()}
                          className="min-w-[140px] font-semibold text-base"
                        >
                          Submit Answer
                        </Button>
                      </div>
                    )}
                  </form>
                </motion.div>
              ) : !isLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <p className="text-lg">Select categories to start practicing.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};