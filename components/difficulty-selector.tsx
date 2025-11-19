"use client"

import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, BookOpen, Calculator } from "lucide-react"
import { Card } from "@/components/ui/card"

interface DifficultySelectorProps {
    isOpen: boolean;
    onSelect: (elo: number) => void;
}

export default function DifficultySelector({ isOpen, onSelect }: DifficultySelectorProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl space-y-8"
            >
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-white">Select Your Starting Point</h2>
                    <p className="text-slate-400">Choose the difficulty level that best fits your current knowledge.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Beginner */}
                    <Card
                        className="group relative overflow-hidden p-6 cursor-pointer hover:ring-2 hover:ring-green-500/50 transition-all bg-slate-900/90 border-slate-800"
                        onClick={() => onSelect(300)}
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                        <div className="mb-4 p-3 bg-green-500/10 w-fit rounded-lg group-hover:bg-green-500/20 transition-colors">
                            <Calculator className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-green-400 mb-2">Student</h3>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-300">
                                Perfect for building a strong foundation.
                            </p>
                            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                                <li>Multiplication & Division</li>
                                <li>Basic Algebra</li>
                                <li>Linear Equations</li>
                            </ul>
                            <div className="text-xs font-mono text-slate-500 pt-2">Starting ELO: 300</div>
                        </div>
                    </Card>

                    {/* Intermediate */}
                    <Card
                        className="group relative overflow-hidden p-6 cursor-pointer hover:ring-2 hover:ring-yellow-500/50 transition-all bg-slate-900/90 border-slate-800"
                        onClick={() => onSelect(800)}
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                        <div className="mb-4 p-3 bg-yellow-500/10 w-fit rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                            <BookOpen className="w-8 h-8 text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-yellow-400 mb-2">Scholar</h3>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-300">
                                For those comfortable with algebra basics.
                            </p>
                            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                                <li>Advanced Algebra</li>
                                <li>Exponents & Logs</li>
                                <li>Pre-Calculus concepts</li>
                            </ul>
                            <div className="text-xs font-mono text-slate-500 pt-2">Starting ELO: 800</div>
                        </div>
                    </Card>

                    {/* Advanced */}
                    <Card
                        className="group relative overflow-hidden p-6 cursor-pointer hover:ring-2 hover:ring-red-500/50 transition-all bg-slate-900/90 border-slate-800"
                        onClick={() => onSelect(1200)}
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                        <div className="mb-4 p-3 bg-red-500/10 w-fit rounded-lg group-hover:bg-red-500/20 transition-colors">
                            <GraduationCap className="w-8 h-8 text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-red-400 mb-2">Researcher</h3>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-300">
                                University level mathematics and physics.
                            </p>
                            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                                <li>Calculus I, II, III</li>
                                <li>Differential Equations</li>
                                <li>Complex Analysis</li>
                            </ul>
                            <div className="text-xs font-mono text-slate-500 pt-2">Starting ELO: 1200</div>
                        </div>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}