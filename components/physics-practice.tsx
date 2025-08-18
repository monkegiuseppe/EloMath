"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  SkipForward,
  BrainCircuit,
  RefreshCw,
  Notebook,
  Info,
  SlidersHorizontal,
  Check,
  TrendingUp,
  X,
} from "lucide-react"
import { allProblems } from "../lib/problems"
import { updatePlayerElo, getPlayerElo } from "../lib/elo"
import ProblemRenderer from "./problem-renderer"
import Notepad from "./notepad"
import GraphingTool from "./graphing-tool"
import { isAnswerCorrect } from "../lib/utils" // Import isAnswerCorrect

const physicsCategories = [
  "Quantum Mechanics",
  "Quantum Field Theory",
  "Statistical Mechanics",
  "Thermodynamics",
  "Electromagnetism",
]
const physicsProblems = allProblems.filter((problem) => physicsCategories.includes(problem.category))

const InfoPopup = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
          >
            <header className="flex items-center justify-between p-4 border-b border-border sticky top-0 glass-strong rounded-t-lg">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <X size={24} />
              </button>
            </header>
            <div className="p-6 overflow-y-auto text-foreground space-y-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const AnswerFormatGuide = () => (
  <>
    <div className="space-y-2">
      <h3 className="text-md font-semibold text-primary">1. Numbers & Decimals</h3>
      <p>For most problems, the answer is a single number.</p>
      <ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">
        <li>
          Integers: <code className="bg-muted px-1 rounded">34</code>,{" "}
          <code className="bg-muted px-1 rounded">-16</code>
        </li>
        <li>
          Decimals: <code className="bg-muted px-1 rounded">0.5</code>,{" "}
          <code className="bg-muted px-1 rounded">-1.2</code>
        </li>
        <li>
          Fractions: <code className="bg-muted px-1 rounded">1/6</code>,{" "}
          <code className="bg-muted px-1 rounded">3/7</code>
        </li>
      </ul>
    </div>
    <div className="space-y-2">
      <h3 className="text-md font-semibold text-primary">2. Physics Constants</h3>
      <ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">
        <li>
          Planck constant: <code className="bg-muted px-1 rounded">ℏ</code> or{" "}
          <code className="bg-muted px-1 rounded">hbar</code>
        </li>
        <li>
          Speed of light: <code className="bg-muted px-1 rounded">c</code>
        </li>
        <li>
          Boltzmann constant: <code className="bg-muted px-1 rounded">k_B</code>
        </li>
      </ul>
    </div>
    <div className="space-y-2">
      <h3 className="text-md font-semibold text-primary">3. Physics Notation</h3>
      <ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">
        <li>
          Square roots: <code className="bg-muted px-1 rounded">sqrt(3)</code>
        </li>
        <li>
          Exponentials: <code className="bg-muted px-1 rounded">exp(-x)</code>
        </li>
        <li>
          Functions: <code className="bg-muted px-1 rounded">sin(x)</code>,{" "}
          <code className="bg-muted px-1 rounded">cos(x)</code>
        </li>
      </ul>
    </div>
  </>
)

export default function PhysicsPractice({ onBack }) {
  const STARTING_ELO = 1200

  const [userElo, setUserElo] = useState(STARTING_ELO)
  const [currentProblem, setCurrentProblem] = useState(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, skipped: 0 })
  const [isNotepadOpen, setIsNotepadOpen] = useState(false)
  const [isGraphingOpen, setIsGraphingOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState(physicsCategories)
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false)
  const [categoryError, setCategoryError] = useState("")
  const categorySelectorRef = useRef(null)
  const categoryButtonRef = useRef(null)

  const getNewProblem = (currentElo) => {
    setFeedback(null)
    setUserAnswer("")

    const availableProblems = physicsProblems.filter((p) => selectedCategories.includes(p.category))

    if (availableProblems.length === 0) {
      setCurrentProblem({
        id: "no-problems",
        topic: "System",
        difficulty: 0,
        problem: "No physics problems available for the selected categories. Please select a category to begin.",
        answer: "",
      })
      return
    }

    const eloRange = 150
    const effectiveElo = currentElo || userElo

    let eligibleProblems = availableProblems.filter(
      (p) => Math.abs(p.difficulty - effectiveElo) <= eloRange && p.id !== currentProblem?.id,
    )

    if (eligibleProblems.length === 0) {
      eligibleProblems = availableProblems.filter((p) => p.id !== currentProblem?.id)
    }

    if (eligibleProblems.length === 0) {
      setCurrentProblem({
        id: "no-problems-left",
        topic: "System",
        difficulty: 0,
        problem:
          "You have seen all available physics problems for this filter. Please select more categories or reset.",
        answer: "",
      })
      return
    }

    const randomIndex = Math.floor(Math.random() * eligibleProblems.length)
    setCurrentProblem(eligibleProblems[randomIndex])
  }

  useEffect(() => {
    const initialElo = getPlayerElo("physics")
    setUserElo(initialElo)

    const savedCategories = localStorage.getItem("selectedPhysicsCategories")
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories)
        const validSaved = parsed.filter((c) => physicsCategories.includes(c))
        if (validSaved.length > 0) {
          setSelectedCategories(validSaved)
        }
      } catch (e) {
        console.error("Failed to parse saved physics categories:", e)
        localStorage.removeItem("selectedPhysicsCategories")
      }
    }

    getNewProblem(initialElo)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!userAnswer.trim() || !currentProblem || currentProblem.id.startsWith("no-problems")) return

    const correct = isAnswerCorrect(userAnswer, currentProblem.answer)
    const newElo = updatePlayerElo(currentProblem.difficulty, correct, "physics")
    const eloChange = newElo - userElo

    setUserElo(newElo)

    if (correct) {
      setSessionStats((prev) => ({ ...prev, correct: prev.correct + 1 }))
      setFeedback({
        type: "correct",
        message: `Correct! Physics ELO ${eloChange >= 0 ? "+" : ""}${eloChange}`,
        correctAnswer: currentProblem.answer,
      })
    } else {
      setSessionStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }))
      setFeedback({
        type: "incorrect",
        message: `Incorrect. Physics ELO ${eloChange}`,
        correctAnswer: currentProblem.answer,
      })
    }
  }

  const handleResetElo = () => {
    if (window.confirm("Are you sure you want to reset your Physics ELO, session stats, and category filters?")) {
      setUserElo(STARTING_ELO)
      localStorage.removeItem("playerElo_physics")
      setSessionStats({ correct: 0, incorrect: 0, skipped: 0 })
      setSelectedCategories(physicsCategories)
      localStorage.removeItem("selectedPhysicsCategories")
      getNewProblem(STARTING_ELO)
    }
  }

  const handleCategoryToggle = (category) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]

    if (newSelectedCategories.length === 0) {
      setCategoryError("At least one category must be selected.")
      setTimeout(() => setCategoryError(""), 3000)
      return
    }

    setCategoryError("")
    setSelectedCategories(newSelectedCategories)
    localStorage.setItem("selectedPhysicsCategories", JSON.stringify(newSelectedCategories))
    getNewProblem(userElo)
  }

  const handleSkip = () => {
    setSessionStats((prev) => ({ ...prev, skipped: prev.skipped + 1 }))
    getNewProblem(userElo)
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/images/gradient-background.jpg)",
        }}
      />

      {/* Floating Tools */}
      <AnimatePresence>
        {isNotepadOpen && <Notepad onClose={() => setIsNotepadOpen(false)} />}
        {isGraphingOpen && <GraphingTool onClose={() => setIsGraphingOpen(false)} />}
      </AnimatePresence>

      <InfoPopup isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} title="Answer Formatting Guide">
        <AnswerFormatGuide />
      </InfoPopup>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8">
        <motion.div
          className="w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft
                  size={20}
                  className="transition-transform duration-200 ease-out group-hover:-translate-x-1"
                />
                Back to Home
              </button>
              <div className="relative">
                <button
                  ref={categoryButtonRef}
                  onClick={() => setIsCategorySelectorOpen((p) => !p)}
                  className="glass px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-card/90"
                  title="Filter physics categories"
                >
                  <SlidersHorizontal size={16} className="inline mr-2" />
                  Physics Categories ({selectedCategories.length}/{physicsCategories.length})
                </button>

                {/* Category Selector */}
                <AnimatePresence>
                  {isCategorySelectorOpen && (
                    <motion.div
                      ref={categorySelectorRef}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-2 w-80 glass-strong rounded-lg shadow-xl z-30 p-4"
                    >
                      <h3 className="text-sm font-semibold text-foreground mb-3">Physics Categories</h3>
                      <div className="max-h-48 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                        {physicsCategories.map((category) => (
                          <label
                            key={category}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                          >
                            <div className="relative flex items-center justify-center w-5 h-5">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryToggle(category)}
                                className="appearance-none w-5 h-5 rounded-md bg-background border-2 border-muted-foreground checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              />
                              <AnimatePresence>
                                {selectedCategories.includes(category) && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: 0.1 }}
                                  >
                                    <Check
                                      size={14}
                                      className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <span className="text-sm text-foreground select-none">{category}</span>
                          </label>
                        ))}
                      </div>

                      <AnimatePresence>
                        {categoryError && (
                          <motion.p
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: "12px" }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="text-xs text-destructive text-center"
                          >
                            {categoryError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <BrainCircuit size={24} />
                <span>Physics ELO: {userElo}</span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-4">
                <span>
                  <span className="text-green-500">✓ {sessionStats.correct}</span> |{" "}
                  <span className="text-red-500">✗ {sessionStats.incorrect}</span> |{" "}
                  <span className="text-yellow-500">» {sessionStats.skipped}</span>
                </span>
                <button
                  onClick={handleResetElo}
                  title="Reset Physics ELO, Stats, and Filters"
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </header>

          {/* Problem Card */}
          <div className="glass rounded-2xl p-8 min-h-[24rem] mb-6">
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
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={() => setIsNotepadOpen(true)}
                        className="glass px-3 py-1.5 rounded-md text-sm hover:bg-card/90 transition-colors flex items-center gap-2"
                        title="Open Scratchpad"
                        whileTap={{ scale: 0.95 }}
                      >
                        <Notebook size={16} />
                        Scratchpad
                      </motion.button>
                      <motion.button
                        onClick={() => setIsGraphingOpen(true)}
                        className="glass px-3 py-1.5 rounded-md text-sm hover:bg-card/90 transition-colors flex items-center gap-2"
                        title="Open Graphing Tool"
                        whileTap={{ scale: 0.95 }}
                      >
                        <TrendingUp size={16} />
                        Graph
                      </motion.button>
                      <span className="text-sm font-medium text-muted-foreground">
                        Difficulty: {currentProblem.difficulty}
                      </span>
                    </div>
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
                        placeholder={
                          currentProblem.id.startsWith("no-problems") ? "Please select categories..." : "Your Answer..."
                        }
                        disabled={!!feedback || !currentProblem || currentProblem.id.startsWith("no-problems")}
                        className="w-full bg-background/80 border-2 border-border rounded-lg py-3 pr-12 pl-4 text-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all disabled:opacity-50 backdrop-blur-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setIsInfoOpen(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary p-1 rounded-full transition-all duration-200 ease-out hover:scale-110"
                        title="Answer Formatting Guide"
                      >
                        <Info size={20} />
                      </button>
                    </div>

                    <div className="flex items-center justify-end gap-4 mt-4">
                      {!feedback && !currentProblem.id.startsWith("no-problems") && (
                        <motion.button
                          type="button"
                          onClick={handleSkip}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
                          whileTap={{ scale: 0.95 }}
                        >
                          <SkipForward size={16} />
                          Skip
                        </motion.button>
                      )}
                      <motion.button
                        type="submit"
                        disabled={!!feedback || !currentProblem || currentProblem.id.startsWith("no-problems")}
                        className="px-8 py-3 bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-primary transition-all duration-200 ease-out hover:-translate-y-0.5 disabled:bg-muted/50 disabled:text-muted-foreground disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg backdrop-blur-sm"
                        whileTap={{ scale: 0.95 }}
                      >
                        {feedback ? "Answered" : "Submit"}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className={`glass rounded-lg p-4 flex items-center justify-between ${
                  feedback.type === "correct"
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-red-500/30 bg-red-500/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  {feedback.type === "correct" ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <XCircle className="text-red-500" />
                  )}
                  <div>
                    <p className="font-bold text-foreground">{feedback.message}</p>
                    <p className="text-sm text-muted-foreground">
                      The correct answer is: <span className="font-mono">{feedback.correctAnswer}</span>
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => getNewProblem()}
                  className="glass px-4 py-2 hover:bg-card/90 font-semibold rounded-lg transition-all duration-200 ease-out flex items-center gap-2"
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Next Question →</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
