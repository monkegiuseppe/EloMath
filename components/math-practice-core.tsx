// components/math-practice-core.tsx

"use client"

import { useState, useEffect } from "react"
import type { FC } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, SkipForward, Info } from "lucide-react"
import { mathProblems, type Problem } from "../lib/problems"
import { isAnswerCorrect } from "../lib/utils"
import ProblemRenderer from "./problem-renderer"
import FormattingGuideModal from "./formatting-guide-modal"

interface MathPracticeCoreProps {
  userElo: number;
  onEloUpdate: (newElo: number) => void;
  onStatsUpdate: (type: 'correct' | 'incorrect' | 'skipped') => void;
  selectedCategories: string[];
}

interface Feedback {
  type: 'correct' | 'incorrect';
  message: string;
  correctAnswer: string | number;
}

export const MathPracticeCore: FC<MathPracticeCoreProps> = ({ userElo, onEloUpdate, onStatsUpdate, selectedCategories }) => {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  /**
   * Fetches a new problem based on the user's ELO and selected categories.
   */
  const getNewProblem = () => {
    setFeedback(null);
    setUserAnswer("");

    const availableProblems = mathProblems.filter((p) => selectedCategories.includes(p.category));

    if (availableProblems.length === 0) {
      setCurrentProblem({
        id: "no-problems", topic: "System", category: "System", difficulty: 0,
        problem: "No math problems available for the selected categories. Please select categories from the header.",
        answer: "",
      });
      return;
    }

    const eloRange = 150;
    let eligibleProblems = availableProblems.filter(p => Math.abs(p.difficulty - userElo) <= eloRange && p.id !== currentProblem?.id);
    if (eligibleProblems.length === 0) {
      eligibleProblems = availableProblems.filter(p => p.id !== currentProblem?.id);
    }
    if (eligibleProblems.length === 0) {
      setCurrentProblem({
        id: "no-problems-left", topic: "System", category: "System", difficulty: 0,
        problem: "You have seen all available problems. Please select more categories or reset.",
        answer: "",
      });
      return;
    }

    const randomIndex = Math.floor(Math.random() * eligibleProblems.length);
    setCurrentProblem(eligibleProblems[randomIndex]);
  };

  // A new problem will be fetched only when categories change.
  useEffect(() => {
    getNewProblem();
  }, [selectedCategories]);

  /**
   * Handles the submission of the user's answer, calculates ELO change, and provides feedback.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userAnswer.trim() || !currentProblem || currentProblem.id.startsWith("no-problems")) return;

    const wasCorrect = isAnswerCorrect(userAnswer, currentProblem.answer);
    const score = wasCorrect ? 1 : 0;
    const expectedScore = 1 / (1 + Math.pow(10, (currentProblem.difficulty - userElo) / 400));
    const kFactor = 32;
    const newElo = Math.round(userElo + kFactor * (score - expectedScore));
    const eloChange = newElo - userElo;

    onEloUpdate(newElo);
    onStatsUpdate(wasCorrect ? 'correct' : 'incorrect');

    setFeedback({
      type: wasCorrect ? "correct" : "incorrect",
      message: `${wasCorrect ? "Correct" : "Incorrect"}. ELO ${eloChange >= 0 ? "+" : ""}${eloChange}`,
      correctAnswer: currentProblem.answer,
    });
  };

  /**
   * Skips the current problem and fetches a new one.
   */
  const handleSkip = () => {
    onStatsUpdate('skipped');
    getNewProblem();
  };
  
  return (
    <>
      <FormattingGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <div className="w-full h-full p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-3xl">
          <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-8 min-h-[24rem] mb-6">
            <AnimatePresence mode="wait">
              {currentProblem && (
                <motion.div
                  key={currentProblem.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-col h-full"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {currentProblem.topic}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      Difficulty: {currentProblem.difficulty}
                    </span>
                  </div>

                  <div className="flex-grow mb-6">
                    <ProblemRenderer text={currentProblem.problem} />
                  </div>

                  <form onSubmit={handleSubmit} className="mt-auto">
                    <div className="relative">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder={currentProblem.id.startsWith("no-problems") ? "Please select categories..." : "Your Answer..."}
                        disabled={!!feedback || currentProblem.id.startsWith("no-problems")}
                        className="w-full bg-background/80 border-2 border-border rounded-lg py-3 pr-12 pl-4 text-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all disabled:opacity-50"
                      />
                      <button type="button" onClick={() => setIsGuideOpen(true)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary p-1" title="Formatting Guide">
                        <Info size={20} />
                      </button>
                    </div>
                    <div className="flex items-center justify-end gap-4 mt-4">
                      {!feedback && !currentProblem.id.startsWith("no-problems") && (
                        <motion.button type="button" onClick={handleSkip} className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-500 hover:text-yellow-400">
                          <SkipForward size={16} /> Skip
                        </motion.button>
                      )}
                      <motion.button type="submit" disabled={!!feedback || !userAnswer.trim() || currentProblem.id.startsWith("no-problems")} className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 disabled:bg-muted/50 disabled:cursor-not-allowed">
                        {feedback ? "Answered" : "Submit"}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
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
                <motion.button onClick={getNewProblem} className="glass px-4 py-2 hover:bg-card/90 font-semibold rounded-lg">
                  Next Question →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};