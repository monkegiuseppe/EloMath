// lib/anonymous-progress.ts

export interface AnonymousProgress {
    mathElo: number;
    mathCorrect: number;
    mathIncorrect: number;
    mathSkipped: number;
    physicsElo: number;
    physicsCorrect: number;
    physicsIncorrect: number;
    physicsSkipped: number;
    lastUpdated: string;
}

const STORAGE_KEY = 'elomath-anonymous-progress';

export function getAnonymousProgress(): AnonymousProgress | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const progress = JSON.parse(stored) as AnonymousProgress;

        const lastUpdated = new Date(progress.lastUpdated);
        const daysSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate > 30) {
            clearAnonymousProgress();
            return null;
        }

        return progress;
    } catch {
        return null;
    }
}

export function saveAnonymousProgress(progress: Partial<AnonymousProgress>): void {
    if (typeof window === 'undefined') return;

    try {
        const existing = getAnonymousProgress();
        const updated: AnonymousProgress = {
            mathElo: progress.mathElo ?? existing?.mathElo ?? 1200,
            mathCorrect: progress.mathCorrect ?? existing?.mathCorrect ?? 0,
            mathIncorrect: progress.mathIncorrect ?? existing?.mathIncorrect ?? 0,
            mathSkipped: progress.mathSkipped ?? existing?.mathSkipped ?? 0,
            physicsElo: progress.physicsElo ?? existing?.physicsElo ?? 1200,
            physicsCorrect: progress.physicsCorrect ?? existing?.physicsCorrect ?? 0,
            physicsIncorrect: progress.physicsIncorrect ?? existing?.physicsIncorrect ?? 0,
            physicsSkipped: progress.physicsSkipped ?? existing?.physicsSkipped ?? 0,
            lastUpdated: new Date().toISOString(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to save anonymous progress:', e);
    }
}

export function clearAnonymousProgress(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

export function hasAnonymousProgress(): boolean {
    const progress = getAnonymousProgress();
    if (!progress) return false;

    const totalAttempts =
        progress.mathCorrect + progress.mathIncorrect + progress.mathSkipped +
        progress.physicsCorrect + progress.physicsIncorrect + progress.physicsSkipped;

    const hasNonDefaultElo = progress.mathElo !== 1200 || progress.physicsElo !== 1200;

    return totalAttempts > 0 || hasNonDefaultElo;
}