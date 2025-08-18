"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Calculator, Atom, BarChart3, LogIn } from "lucide-react"
import MathPractice from "../components/math-practice"
import PhysicsPractice from "../components/physics-practice"
import Notepad from "../components/notepad"
import GraphingTool from "../components/graphing-tool"

export default function Home() {
  const [currentView, setCurrentView] = useState("home")
  const [isNotepadOpen, setIsNotepadOpen] = useState(false)
  const [isGraphingOpen, setIsGraphingOpen] = useState(false)

  const menuItems = [
    {
      id: "practice-math",
      label: "Math Practice",
      icon: Calculator,
      description: "Calculus, Linear Algebra, Complex Analysis",
    },
    {
      id: "practice-physics",
      label: "Physics Practice",
      icon: Atom,
      description: "Quantum Mechanics, QFT, Statistical Mechanics",
    },
    { id: "progress", label: "Progress", icon: BarChart3, description: "Track your learning journey" },
  ]

  const handleMenuClick = (id) => {
    if (id === "notepad") {
      setIsNotepadOpen(true)
    } else if (id === "graphing") {
      setIsGraphingOpen(true)
    } else {
      setCurrentView(id)
    }
  }

  if (currentView === "practice-math") {
    return <MathPractice onBack={() => setCurrentView("home")} />
  }

  if (currentView === "practice-physics") {
    return <PhysicsPractice onBack={() => setCurrentView("home")} />
  }

  if (currentView === "progress") {
    return (
      <div className="min-h-screen relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/gradient-background.jpg)",
          }}
        />
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="glass rounded-2xl p-8 text-center">
            <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Progress Tracking</h2>
            <p className="text-muted-foreground mb-6">Coming soon! Track your ELO progress across math and physics.</p>
            <button
              onClick={() => setCurrentView("home")}
              className="glass px-6 py-3 rounded-lg hover:bg-card/90 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/images/gradient-background.jpg)",
        }}
      />

      {/* Glassmorphic overlay for better depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute inset-0 backdrop-blur-[1px]" />

      {/* Floating Tools */}
      <AnimatePresence>
        {isNotepadOpen && <Notepad onClose={() => setIsNotepadOpen(false)} />}
        {isGraphingOpen && <GraphingTool onClose={() => setIsGraphingOpen(false)} />}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Calculator className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  EloMath
                </h1>
                <Brain className="w-8 h-8 text-secondary" />
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Master advanced mathematics and physics through adaptive learning. From calculus to quantum field
                theory, challenge yourself with problems that evolve with your skill level.
              </p>
            </motion.div>

            {/* Auth Placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center mb-8"
            >
              <button className="glass px-6 py-3 rounded-xl flex items-center gap-2 text-foreground hover:bg-card/90 transition-all duration-200 hover:scale-105">
                <LogIn size={20} />
                <span>Sign in with Google</span>
                <span className="text-xs text-muted-foreground ml-2">(Coming Soon)</span>
              </button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                onClick={() => handleMenuClick(item.id)}
                className="glass p-6 rounded-xl text-left hover:bg-card/90 transition-all duration-200 hover:scale-105 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8 text-sm text-muted-foreground"
          >
            <p>Adaptive difficulty • ELO rating system • Mathematical notation support</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
