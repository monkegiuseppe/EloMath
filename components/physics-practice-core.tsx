// components/physics-practice-core.tsx

"use client"

import { useState, useEffect, useCallback } from "react"
import type { FC } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, SkipForward, Loader2 } from "lucide-react"
import { checkAnswer } from "../lib/answer-verification"
import ProblemRenderer from "./problem-renderer"
import FormattingGuideModal from "./formatting-guide-modal"
import dynamic from 'next/dynamic'

const MathAnswerInput = dynamic(() => import('./math-answer-input'), { ssr: false });

interface PhysicsPracticeCoreProps {
  userElo: number;
  onAnswerSubmit: (wasCorrect: boolean, newElo: number, problemDetails: { category: string; difficulty: number }) => void;
  onSkip: () => void;
  onProblemLoad: (problemDetails: { category: string; difficulty: number }) => void;
  selectedCategories: string[];
}

interface ProblemData {
  id: string;
  topic: string;
  category: string;
  difficulty: number;
  problem: string;
  answer: string;
  unit?: string;
}

interface Feedback {
  type: 'correct' | 'incorrect';
  message: string;
  correctAnswer: string | number;
}

export const PhysicsPracticeCore: FC<PhysicsPracticeCoreProps> = ({
  userElo,
  onAnswerSubmit,
  onSkip,
  onProblemLoad,
  selectedCategories
}) => {
  const [currentProblem, setCurrentProblem] = useState<ProblemData | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getNewProblem = useCallback(async () => {
    if (selectedCategories.length === 0) return;

    setIsLoading(true);
    setFeedback(null);
    setUserAnswer("");

    try {
      const params = new URLSearchParams({
        subject: 'physics',
        elo: userElo.toString(),
        categories: selectedCategories.join(',')
      });

      const res = await fetch(`/api/problems?${params.toString()}`);
      const data = await res.json();

      if (data.error) {
        console.warn(data.error);
        setCurrentProblem(null);
      } else {
        setCurrentProblem(data);
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
  }, [userElo, selectedCategories, onProblemLoad]);

  useEffect(() => {
    getNewProblem();
  }, [selectedCategories]);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim() || !currentProblem) return;

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

    setFeedback({
      type: wasCorrect ? "correct" : "incorrect",
      message: `${wasCorrect ? "Correct" : "Incorrect"}. ELO ${eloChange >= 0 ? "+" : ""}${eloChange}`,
      correctAnswer: currentProblem.answer + (currentProblem.unit ? ` ${currentProblem.unit}` : ""),
    });
  };

  const handleSkip = () => {
    onSkip();
    getNewProblem();
  };

  return (
    <>
      <FormattingGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <div className="w-full h-full min-h-[600px] p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center overflow-y-auto">
        <div className="w-full max-w-3xl">
          <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4 sm:p-8 min-h-[24rem] mb-6 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-card/50 rounded-2xl">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
              </div>
            )}

            <AnimatePresence mode="wait">
              {!isLoading && currentProblem ? (
                <motion.div
                  key={currentProblem.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-col h-full"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-foreground bg-foreground/10 px-3 py-1 rounded-full">
                      {currentProblem.topic}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      Difficulty: {currentProblem.difficulty}
                    </span>
                  </div>

                  <div className="flex-grow mb-6 text-foreground">
                    <ProblemRenderer text={currentProblem.problem} />
                  </div>

                  <form onSubmit={handleSubmit} className="mt-auto">
                    <MathAnswerInput
                      value={userAnswer}
                      onChange={setUserAnswer}
                      onSubmit={handleSubmit}
                      disabled={!!feedback}
                      placeholder={currentProblem.unit ? `Answer in ${currentProblem.unit}...` : "Your Answer..."}
                      onOpenGuide={() => setIsGuideOpen(true)}
                    />
                    {currentProblem.unit && (
                      <p className="text-xs text-muted-foreground mt-1 ml-1">
                        Expected unit: {currentProblem.unit}
                      </p>
                    )}
                    <div className="flex items-center justify-end gap-4 mt-4">
                      {!feedback && (
                        <button type="button" onClick={handleSkip} className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                          <SkipForward size={16} /> Skip
                        </button>
                      )}
                      <button type="submit" disabled={!!feedback || !userAnswer.trim()} className="px-8 py-3 bg-foreground text-background font-bold rounded-lg hover:bg-foreground/90 disabled:bg-muted/50 disabled:text-muted-foreground disabled:cursor-not-allowed">
                        {feedback ? "Answered" : "Submit"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : !isLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <p>Select categories to start practicing.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`bg-card/60 backdrop-blur-xl border border-border/30 rounded-lg p-4 flex items-center justify-between ${feedback.type === "correct" ? "border-green-500/30" : "border-red-500/30"}`}
              >
                <div className="flex items-center gap-3">
                  {feedback.type === "correct" ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                  <div>
                    <p className="font-bold text-foreground">{feedback.message}</p>
                    <p className="text-sm text-muted-foreground">The correct answer is: <span className="font-mono">{feedback.correctAnswer}</span></p>
                  </div>
                </div>
                <button onClick={getNewProblem} className="glass px-4 py-2 hover:bg-card/90 font-semibold rounded-lg text-foreground">
                  Next Question →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};