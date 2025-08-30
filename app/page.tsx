// app/page.tsx

"use client"

import { useState } from "react"
import type { FC } from "react"
import { motion } from "framer-motion"
import { Brain, Calculator, Atom, BarChart3, LogIn, LogOut, LucideProps, BookOpen } from "lucide-react"
import Workspace from "../components/workspace"
import { useSession, signIn, signOut } from "next-auth/react" 
import Image from "next/image" 

interface MenuItem {
  id: 'practice-math' | 'practice-physics' | 'progress' | 'workspace';
  label: string;
  icon: FC<LucideProps>;
  description: string;
}

export default function Home() {
  const [currentView, setCurrentView] = useState("home")
  const [sessionType, setSessionType] = useState<'math' | 'physics' | 'default'>('default');
  const { data: session, status } = useSession(); 

  const menuItems: MenuItem[] = [
    { id: "practice-math", label: "Math Practice", icon: Calculator, description: "Calculus, Linear Algebra, etc." },
    { id: "practice-physics", label: "Physics Practice", icon: Atom, description: "Quantum Mechanics, magnetic fields, etc." },
    { id: "workspace", label: "Workspace", icon: BookOpen, description: "A notepad with CAS/graphing capabilities" },
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
          <BarChart3 className="w-16 h-16 text-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Progress Tracking</h2>
          <p className="text-foreground mb-6">Coming soon! Track your ELO progress.</p>
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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl"
        >
          <div className="text-center mb-12">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="glass rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Calculator className="w-8 h-8 text-foreground" />
                <h1 className="text-4xl font-bold text-foreground">EloMath</h1>
                <Brain className="w-8 h-8 text-foreground" />
              </div>
              <p className="text-lg text-foreground max-w-2xl mx-auto">
                Master advanced mathematics and physics through adaptive learning.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-center mb-8">
              {/* --- DYNAMIC AUTHENTICATION SECTION --- */}
              {status === 'authenticated' ? (
                // If the user is logged in, show their info and a sign-out button
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl">
                      {session.user?.image && <Image src={session.user.image} alt="User avatar" width={24} height={24} className="rounded-full" />}
                      <span className="text-sm font-medium text-foreground">{session.user?.name}</span>
                    </div>
                    <button onClick={() => signOut()} className="glass px-4 py-3 rounded-xl flex items-center gap-2 text-foreground hover:bg-card/90" title="Sign Out">
                      <LogOut size={20} />
                    </button>
                </div>
              ) : (
                // If the user is not logged in, show the sign-in button
                <button onClick={() => signIn('google')} disabled={status === 'loading'} className="glass px-6 py-3 rounded-xl flex items-center gap-2 text-foreground hover:bg-card/90">
                  <LogIn size={20} />
                  <span>{status === 'loading' ? 'Authenticating...' : 'Sign in with Google'}</span>
                </button>
              )}
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
                className="glass p-6 rounded-xl text-left hover:bg-card/90 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-foreground/10 group-hover:bg-foreground/20 transition-colors">
                    <item.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{item.label}</h3>
                    <p className="text-sm text-foreground/80">{item.description}</p>
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