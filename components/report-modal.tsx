"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Flag } from "lucide-react";
import { toast } from "sonner";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    questionData: {
        id?: string;
        problem: string;
        category: string;
    } | null;
}

export default function ReportModal({ isOpen, onClose, questionData }: ReportModalProps) {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reason.trim() || !questionData) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    questionId: questionData.id,
                    problemText: questionData.problem,
                    category: questionData.category,
                    reason: reason
                })
            });

            if (response.ok) {
                toast.success("Report submitted. Thank you for your feedback!");
                setReason("");
                onClose();
            } else {
                toast.error("Failed to submit report. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Flag className="w-5 h-5 text-destructive" />
                        Report Issue
                    </DialogTitle>
                    <DialogDescription>
                        Found a wrong answer, typo, or rendering issue? Let us know so we can fix it.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reason">Describe the issue</Label>
                        <Textarea
                            id="reason"
                            placeholder="e.g., The answer seems incorrect because..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="h-32 resize-none bg-background/50"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!reason.trim() || isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}