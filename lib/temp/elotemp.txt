// lib/elo.ts

export function calculateNewElo(
  playerElo: number,
  problemElo: number,
  wasCorrect: boolean,
  kFactor = 32
): number {
  const score = wasCorrect ? 1 : 0;
  const expectedScore = 1 / (1 + Math.pow(10, (problemElo - playerElo) / 400));
  const newElo = playerElo + kFactor * (score - expectedScore);
  return Math.round(newElo);
}

export function getPlayerElo(subject = "math"): number {
  if (typeof window === "undefined") return 1200; // Default for Server-Side Rendering
  const key = `playerElo_${subject}`;
  const stored = localStorage.getItem(key);
  return stored ? parseInt(stored, 10) : 1200;
}

export function setPlayerElo(newElo: number, subject = "math"): void {
  if (typeof window === "undefined") return;
  const key = `playerElo_${subject}`;
  localStorage.setItem(key, newElo.toString());
}

export function updatePlayerElo(
  problemElo: number,
  wasCorrect: boolean,
  subject = "math",
  kFactor = 32
): number {
  const currentElo = getPlayerElo(subject);
  const newElo = calculateNewElo(currentElo, problemElo, wasCorrect, kFactor);
  setPlayerElo(newElo, subject);
  return newElo;
}