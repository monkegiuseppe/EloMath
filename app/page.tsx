// app/page.tsx

"use client"

import { useState } from "react"
import type { FC } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Calculator, Atom, BarChart3, LogIn, LucideProps, BookOpen } from "lucide-react"
import Workspace from "../components/workspace"
import GraphingTool from "../components/graphing-tool" // Keep this for now

// Define the shape of a menu item for better type safety
interface MenuItem {
  id: 'practice-math' | 'practice-physics' | 'progress' | 'workspace';
  label: string;
  icon: FC<LucideProps>;
  description: string;
}

export default function Home() {
  const [currentView, setCurrentView] = useState("home")
  const [sessionType, setSessionType] = useState<'math' | 'physics' | 'default'>('default');
  
  // REMOVED: isNotepadOpen state is no longer needed
  // ADDED: State for the floating graphing tool, which we might still want
  const [isGraphingOpen, setIsGraphingOpen] = useState(false)

  const menuItems: MenuItem[] = [
    { id: "practice-math", label: "Math Practice", icon: Calculator, description: "Calculus, Linear Algebra, etc." },
    { id: "practice-physics", label: "Physics Practice", icon: Atom, description: "Quantum Mechanics, QFT, etc." },
    { id: "workspace", label: "Workspace", icon: BookOpen, description: "A blank canvas for your ideas." },
    { id: "progress", label: "Progress", icon: BarChart3, description: "Track your learning journey." },
  ]

  const handleMenuClick = (id: MenuItem['id']) => {
    if (id === "practice-math") {
      setSessionType('math');
      setCurrentView('workspace');
    } else if (id === "practice-physics") {
      setSessionType('physics');
      setCurrentView('workspace');
    } else if (id === "workspace") {
      setSessionType('default');
      setCurrentView('workspace');
    } else {
      setCurrentView(id);
    }
  }

  if (currentView === "workspace") {
    return <Workspace onBack={() => setCurrentView("home")} sessionType={sessionType} />
  }

  if (currentView === "progress") {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat dynamic-background" />
        <div className="relative z-10 glass rounded-2xl p-8 text-center">
          <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Progress Tracking</h2>
          <p className="text-muted-foreground mb-6">Coming soon! Track your ELO progress.</p>
          <button onClick={() => setCurrentView("home")} className="glass px-6 py-3 rounded-lg">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat dynamic-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute inset-0 backdrop-blur-[1px]" />

      {/* REMOVED: The floating notepad is gone. We can decide later if a floating grapher is still needed. */}
      <AnimatePresence>
        {isGraphingOpen && <GraphingTool key="graphing-tool" onClose={() => setIsGraphingOpen(false)} />}
      </AnimatePresence>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="glass rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Calculator className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">EloMath</h1>
                <Brain className="w-8 h-8 text-secondary" />
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Master advanced mathematics and physics through adaptive learning.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-center mb-8">
              <button className="glass px-6 py-3 rounded-xl flex items-center gap-2 text-foreground hover:bg-card/90">
                <LogIn size={20} />
                <span>Sign in with Google</span>
                <span className="text-xs text-muted-foreground ml-2">(Coming Soon)</span>
              </button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        </motion.div>
      </div>
    </div>
  )
}