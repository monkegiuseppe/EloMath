const evaluateExpression = (str) => {
  try {
    if (str.includes("/") && !str.match(/[a-zA-Z]/)) {
      const parts = str.split("/")
      if (parts.length === 2) {
        const num = Number.parseFloat(parts[0])
        const den = Number.parseFloat(parts[1])
        if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den
      }
    }
    const simpleFloat = Number.parseFloat(str)
    if (!isNaN(simpleFloat) && !str.match(/[a-zA-Z^√π]/)) {
      return simpleFloat
    }

    const expression = str
      .replace(/π/g, "Math.PI")
      .replace(/√/g, "Math.sqrt")
      .replace(/\^/g, "**")
      .replace(/e/g, "Math.E")
    return new Function("return " + expression)()
  } catch (e) {
    return Number.NaN
  }
}

export const isAnswerCorrect = (userAnswer, correctAnswer) => {
  const cleanUserAnswer = userAnswer.trim()
  const cleanCorrectAnswer = String(correctAnswer).trim()

  const userNum = evaluateExpression(cleanUserAnswer)
  const correctNum = evaluateExpression(cleanCorrectAnswer)

  if (!isNaN(userNum) && !isNaN(correctNum)) {
    return Math.abs(userNum - correctNum) < 0.001
  }

  return (
    cleanUserAnswer.replace(/[\s()<>]/g, "").toLowerCase() === cleanCorrectAnswer.replace(/[\s()<>]/g, "").toLowerCase()
  )
}
