// components/merge-progress-modal.tsx

"use client"

import { useState } from "react";
import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Trash2, Combine, Trophy, CheckCircle, XCircle, SkipForward } from "lucide-react";
import { Button } from "./ui/button";
import type { AnonymousProgress } from "@/lib/anonymous-progress";

interface MergeProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    anonymousProgress: AnonymousProgress;
    existingProgress: {
        mathElo: number;
        physicsElo: number;
        mathCorrect: number;
        mathIncorrect: number;
        mathSkipped: number;
        physicsCorrect: number;
        physicsIncorrect: number;
        physicsSkipped: number;
    } | null;
    onMerge: (strategy: 'replace' | 'combine' | 'keep_best' | 'discard') => void;
}

const MergeProgressModal: FC<MergeProgressModalProps> = ({
    isOpen,
    onClose,
    anonymousProgress,
    existingProgress,
    onMerge,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const anonMathTotal = anonymousProgress.mathCorrect + anonymousProgress.mathIncorrect;
    const anonPhysicsTotal = anonymousProgress.physicsCorrect + anonymousProgress.physicsIncorrect;
    const anonTotal = anonMathTotal + anonPhysicsTotal;

    const existingMathTotal = existingProgress
        ? existingProgress.mathCorrect + existingProgress.mathIncorrect
        : 0;
    const existingPhysicsTotal = existingProgress
        ? existingProgress.physicsCorrect + existingProgress.physicsIncorrect
        : 0;
    const existingTotal = existingMathTotal + existingPhysicsTotal;

    const hasExistingProgress = existingTotal > 0 ||
        (existingProgress && (existingProgress.mathElo !== 1200 || existingProgress.physicsElo !== 1200));

    const handleMerge = async (strategy: 'replace' | 'combine' | 'keep_best' | 'discard') => {
        setIsLoading(true);
        await onMerge(strategy);
        setIsLoading(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[70] p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="glass-strong rounded-xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-cyan-400" />
                                    Transfer Progress?
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full text-muted-foreground hover:bg-muted/50"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-muted-foreground mb-6">
                                We found progress from your anonymous session. Would you like to transfer it to your account?
                            </p>

                            <div className={`grid gap-4 mb-6 ${hasExistingProgress ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-cyan-400 mb-3">Anonymous Session</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Math ELO</span>
                                            <span className="font-medium">{anonymousProgress.mathElo}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Physics ELO</span>
                                            <span className="font-medium">{anonymousProgress.physicsElo}</span>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                                            <CheckCircle size={12} className="text-green-500" />
                                            <span className="text-green-500">{anonymousProgress.mathCorrect + anonymousProgress.physicsCorrect}</span>
                                            <XCircle size={12} className="text-red-500 ml-2" />
                                            <span className="text-red-500">{anonymousProgress.mathIncorrect + anonymousProgress.physicsIncorrect}</span>
                                            <SkipForward size={12} className="text-yellow-500 ml-2" />
                                            <span className="text-yellow-500">{anonymousProgress.mathSkipped + anonymousProgress.physicsSkipped}</span>
                                        </div>
                                    </div>
                                </div>

                                {hasExistingProgress && existingProgress && (
                                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                                        <h3 className="text-sm font-semibold text-purple-400 mb-3">Your Account</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Math ELO</span>
                                                <span className="font-medium">{existingProgress.mathElo}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Physics ELO</span>
                                                <span className="font-medium">{existingProgress.physicsElo}</span>
                                            </div>
                                            <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                                                <CheckCircle size={12} className="text-green-500" />
                                                <span className="text-green-500">{existingProgress.mathCorrect + existingProgress.physicsCorrect}</span>
                                                <XCircle size={12} className="text-red-500 ml-2" />
                                                <span className="text-red-500">{existingProgress.mathIncorrect + existingProgress.physicsIncorrect}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                {!hasExistingProgress ? (
                                    <Button
                                        onClick={() => handleMerge('replace')}
                                        disabled={isLoading}
                                        className="w-full bg-cyan-600 hover:bg-cyan-500"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {isLoading ? 'Transferring...' : 'Transfer Progress to Account'}
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            onClick={() => handleMerge('combine')}
                                            disabled={isLoading}
                                            className="w-full bg-purple-600 hover:bg-purple-500"
                                        >
                                            <Combine className="w-4 h-4 mr-2" />
                                            {isLoading ? 'Merging...' : 'Combine Both (Weighted Average ELO)'}
                                        </Button>
                                        <Button
                                            onClick={() => handleMerge('keep_best')}
                                            disabled={isLoading}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Trophy className="w-4 h-4 mr-2" />
                                            Keep Best ELO + Add Stats
                                        </Button>
                                        <Button
                                            onClick={() => handleMerge('replace')}
                                            disabled={isLoading}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Replace with Anonymous Progress
                                        </Button>
                                    </>
                                )}
                                <Button
                                    onClick={() => handleMerge('discard')}
                                    disabled={isLoading}
                                    variant="ghost"
                                    className="w-full text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Discard Anonymous Progress
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MergeProgressModal;