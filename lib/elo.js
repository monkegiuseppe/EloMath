/**
 * Calculates the new ELO rating for a player.
 * @param {number} playerElo - The current ELO of the player.
 * @param {number} problemElo - The ELO (difficulty) of the problem.
 * @param {boolean} wasCorrect - True if the player answered correctly, false otherwise.
 * @param {number} kFactor - The K-factor, determines how much the ELO changes.
 * @returns {number} The new ELO rating, rounded to the nearest integer.
 */
export function calculateNewElo(playerElo, problemElo, wasCorrect, kFactor = 32) {
  const score = wasCorrect ? 1 : 0
  const expectedScore = 1 / (1 + Math.pow(10, (problemElo - playerElo) / 400))
  const newElo = playerElo + kFactor * (score - expectedScore)
  return Math.round(newElo)
}

export function getPlayerElo(subject = "math") {
  if (typeof window === "undefined") return 1200 // Default for SSR
  const key = `playerElo_${subject}`
  const stored = localStorage.getItem(key)
  return stored ? Number.parseInt(stored) : 1200
}

export function setPlayerElo(newElo, subject = "math") {
  if (typeof window === "undefined") return
  const key = `playerElo_${subject}`
  localStorage.setItem(key, newElo.toString())
}

export function updatePlayerElo(problemElo, wasCorrect, subject = "math", kFactor = 32) {
  const currentElo = getPlayerElo(subject)
  const newElo = calculateNewElo(currentElo, problemElo, wasCorrect, kFactor)
  setPlayerElo(newElo, subject)
  return newElo
}
