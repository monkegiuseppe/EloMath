"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, TrendingUp, Plus, Trash2, Move, Settings, Target, TrendingDown } from "lucide-react"
import { create, all, type EvalFunction } from "mathjs" // Import EvalFunction type

// Initialize math.js
const math = create(all)

const GRAPH_COLORS = [
  "#06b6d4", // cyan
  "#a855f7", // purple
  "#22c55e", // green
  "#f43f5e", // rose
  "#f59e0b", // amber
]

// Define a type for our equation state for type safety
interface Equation {
  id: number
  expr: string
  compiled: EvalFunction | null // Allow compiled to be null for invalid expressions
  color: string
}

interface AnalysisPoint {
  x: number
  y: number
  type: "root" | "intersection" | "minimum" | "maximum"
  equationId?: number
  info: string
}

export default function GraphingTool({ onClose }: { onClose: () => void }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  // Explicitly type the state using our new Equation interface
  const [equations, setEquations] = useState<Equation[]>([
    { id: 1, expr: "sin(x)", compiled: math.compile("sin(x)"), color: GRAPH_COLORS[0] },
  ])
  const [view, setView] = useState({ zoom: 40, centerX: 0, centerY: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [isGraphSelectorOpen, setIsGraphSelectorOpen] = useState(false)
  const [selectedGraphId, setSelectedGraphId] = useState(1)
  const [hasAutoFitted, setHasAutoFitted] = useState(false)
  const [showRoots, setShowRoots] = useState(false)
  const [showExtrema, setShowExtrema] = useState(false)
  const [showIntersections, setShowIntersections] = useState(false)
  const [showMouseTracking, setShowMouseTracking] = useState(false)
  const [trackingPoint, setTrackingPoint] = useState<{ x: number; y: number } | null>(null)
  const [analysisPoints, setAnalysisPoints] = useState<AnalysisPoint[]>([])
  const [hoveredPoint, setHoveredPoint] = useState<AnalysisPoint | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const graphingRef = useRef<HTMLDivElement>(null)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastAnalysisViewRef = useRef<string>("")

  // --- Initial Centering and Drag Logic ---
  useEffect(() => {
    const node = graphingRef.current
    if (!node) return

    if (position.x === 0 && position.y === 0) {
      const { innerWidth, innerHeight } = window
      const { offsetWidth, offsetHeight } = node
      setPosition({
        x: (innerWidth - offsetWidth) / 2,
        y: (innerHeight - offsetHeight) / 3,
      })
    }

    const handleHeaderMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("input, button")) return
      e.preventDefault()

      const startPos = { x: e.clientX, y: e.clientY }
      const startNodePos = { ...position }

      const handleMouseMove = (moveE: MouseEvent) => {
        const dx = moveE.clientX - startPos.x
        const dy = moveE.clientY - startPos.y
        setPosition({
          x: Math.max(0, Math.min(startNodePos.x + dx, window.innerWidth - node.offsetWidth)),
          y: Math.max(0, Math.min(startNodePos.y + dy, window.innerHeight - node.offsetHeight)),
        })
      }
      const handleMouseUp = () => document.removeEventListener("mousemove", handleMouseMove)
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp, { once: true })
    }

    const header = node.querySelector("#graphing-header")
    // Cast the handler to EventListener to satisfy TypeScript
    header?.addEventListener("mousedown", handleHeaderMouseDown as EventListener)
    return () => header?.removeEventListener("mousedown", handleHeaderMouseDown as EventListener)
  }, [position])

  useEffect(() => {
    if (!hasAutoFitted || equations.length > 1) {
      setView({ zoom: 40, centerX: 0, centerY: 0 })
      setHasAutoFitted(true)
    }
  }, [equations.length, hasAutoFitted])

  const calculateAnalysisPoints = useCallback(() => {
    if (!showRoots && !showExtrema && !showIntersections) {
      setAnalysisPoints([])
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const points: AnalysisPoint[] = []
    const width = canvas.width
    const toWorldX = (screenX: number) => (screenX - width / 2) / view.zoom + view.centerX

    equations.forEach((eq) => {
      if (!eq.compiled) return

      const samples = 1000
      const xMin = toWorldX(0)
      const xMax = toWorldX(width)
      const step = (xMax - xMin) / samples

      const values: { x: number; y: number }[] = []

      // First pass: collect all valid points
      for (let i = 0; i <= samples; i++) {
        const x = xMin + i * step
        try {
          const y = eq.compiled.evaluate({ x })
          if (isNaN(y) || !isFinite(y)) continue
          values.push({ x, y })
        } catch (e) {
          continue
        }
      }

      // Second pass: find roots
      for (let i = 1; i < values.length; i++) {
        const curr = values[i]
        const prev = values[i - 1]

        if (showRoots) {
          // Zero crossing detection
          if (Math.sign(curr.y) !== Math.sign(prev.y)) {
            // Use bisection to find more precise root
            let x1 = prev.x,
              x2 = curr.x
            let y1 = prev.y,
              y2 = curr.y

            for (let j = 0; j < 8; j++) {
              const xMid = (x1 + x2) / 2
              const yMid = eq.compiled.evaluate({ x: xMid })
              if (Math.abs(yMid) < 1e-10) break

              if (Math.sign(yMid) === Math.sign(y1)) {
                x1 = xMid
                y1 = yMid
              } else {
                x2 = xMid
                y2 = yMid
              }
            }

            const rootX = (x1 + x2) / 2
            const displayX = Math.abs(rootX) < 1e-6 ? 0 : Math.round(rootX * 1000) / 1000

            points.push({
              x: rootX,
              y: 0,
              type: "root",
              equationId: eq.id,
              info: `(${displayX}, 0)`,
            })
          }
        }
      }

      if (showExtrema && values.length > 4) {
        const extremaCandidates: { x: number; y: number; type: "minimum" | "maximum"; score: number }[] = []

        // Find all potential extrema points
        for (let i = 2; i < values.length - 2; i++) {
          const prev2 = values[i - 2]
          const prev = values[i - 1]
          const curr = values[i]
          const next = values[i + 1]
          const next2 = values[i + 2]

          // Calculate derivatives using 5-point stencil for better accuracy
          const h = step
          const firstDerivative = (-next2.y + 8 * next.y - 8 * prev.y + prev2.y) / (12 * h)
          const secondDerivative = (-next2.y + 16 * next.y - 30 * curr.y + 16 * prev.y - prev2.y) / (12 * h * h)

          // Very strict first derivative check - must be very close to zero
          if (Math.abs(firstDerivative) < 0.01) {
            if (secondDerivative > 0.05) {
              // Strong positive second derivative = clear minimum
              extremaCandidates.push({
                x: curr.x,
                y: curr.y,
                type: "minimum",
                score: Math.abs(secondDerivative), // Higher score for clearer extrema
              })
            } else if (secondDerivative < -0.05) {
              // Strong negative second derivative = clear maximum
              extremaCandidates.push({
                x: curr.x,
                y: curr.y,
                type: "maximum",
                score: Math.abs(secondDerivative), // Higher score for clearer extrema
              })
            }
          }
        }

        // Consolidate nearby extrema - keep only the best one in each region
        const consolidatedExtrema: typeof extremaCandidates = []
        const minDistance = Math.abs(xMax - xMin) / 20 // Minimum distance between extrema

        extremaCandidates.forEach((candidate) => {
          const nearby = consolidatedExtrema.find(
            (existing) => Math.abs(existing.x - candidate.x) < minDistance && existing.type === candidate.type,
          )

          if (!nearby) {
            consolidatedExtrema.push(candidate)
          } else if (candidate.score > nearby.score) {
            // Replace with better candidate
            const index = consolidatedExtrema.indexOf(nearby)
            consolidatedExtrema[index] = candidate
          }
        })

        // Add consolidated extrema to points
        consolidatedExtrema.forEach((extrema) => {
          const displayX = Math.abs(extrema.x) < 1e-6 ? 0 : Math.round(extrema.x * 1000) / 1000
          const displayY = Math.abs(extrema.y) < 1e-6 ? 0 : Math.round(extrema.y * 1000) / 1000

          points.push({
            x: extrema.x,
            y: extrema.y,
            type: extrema.type,
            equationId: eq.id,
            info: `(${displayX}, ${displayY})`,
          })
        })
      }
    })

    if (showIntersections && equations.length > 1) {
      const samples = 1000
      const xMin = toWorldX(0)
      const xMax = toWorldX(width)
      const step = (xMax - xMin) / samples

      // Compare each pair of equations
      for (let i = 0; i < equations.length; i++) {
        for (let j = i + 1; j < equations.length; j++) {
          const eq1 = equations[i]
          const eq2 = equations[j]
          if (!eq1.compiled || !eq2.compiled) continue

          // Find intersections by looking for sign changes in the difference
          for (let k = 0; k < samples; k++) {
            const x1 = xMin + k * step
            const x2 = xMin + (k + 1) * step

            try {
              const y1_eq1 = eq1.compiled.evaluate({ x: x1 })
              const y1_eq2 = eq2.compiled.evaluate({ x: x1 })
              const y2_eq1 = eq1.compiled.evaluate({ x: x2 })
              const y2_eq2 = eq2.compiled.evaluate({ x: x2 })

              if (isNaN(y1_eq1) || isNaN(y1_eq2) || isNaN(y2_eq1) || isNaN(y2_eq2)) continue
              if (!isFinite(y1_eq1) || !isFinite(y1_eq2) || !isFinite(y2_eq1) || !isFinite(y2_eq2)) continue

              const diff1 = y1_eq1 - y1_eq2
              const diff2 = y2_eq1 - y2_eq2

              // Check for sign change (intersection)
              if (Math.sign(diff1) !== Math.sign(diff2) && Math.abs(diff1) > 1e-10 && Math.abs(diff2) > 1e-10) {
                // Use bisection to find more precise intersection
                let xa = x1,
                  xb = x2
                let diffA = diff1,
                  diffB = diff2

                for (let iter = 0; iter < 10; iter++) {
                  const xMid = (xa + xb) / 2
                  const yMid_eq1 = eq1.compiled.evaluate({ x: xMid })
                  const yMid_eq2 = eq2.compiled.evaluate({ x: xMid })
                  const diffMid = yMid_eq1 - yMid_eq2

                  if (Math.abs(diffMid) < 1e-10) break

                  if (Math.sign(diffMid) === Math.sign(diffA)) {
                    xa = xMid
                    diffA = diffMid
                  } else {
                    xb = xMid
                    diffB = diffMid
                  }
                }

                const intersectionX = (xa + xb) / 2
                const intersectionY = eq1.compiled.evaluate({ x: intersectionX })

                const displayX = Math.abs(intersectionX) < 1e-6 ? 0 : Math.round(intersectionX * 1000) / 1000
                const displayY = Math.abs(intersectionY) < 1e-6 ? 0 : Math.round(intersectionY * 1000) / 1000

                points.push({
                  x: intersectionX,
                  y: intersectionY,
                  type: "intersection",
                  info: `(${displayX}, ${displayY})`,
                })
              }
            } catch (e) {
              continue
            }
          }
        }
      }
    }

    setAnalysisPoints(points)
  }, [equations, view.zoom, view.centerX, view.centerY, showRoots, showExtrema, showIntersections])

  useEffect(() => {
    // Create a view signature to detect meaningful changes
    const viewSignature = `${view.zoom.toFixed(1)}-${view.centerX.toFixed(2)}-${view.centerY.toFixed(2)}-${equations.map((eq) => eq.expr).join(",")}-${showRoots}-${showExtrema}-${showIntersections}`

    // Only recalculate if the view has meaningfully changed
    if (viewSignature === lastAnalysisViewRef.current) return

    // Clear existing timeout
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current)
    }

    // Debounce the calculation to prevent flickering during interactions
    analysisTimeoutRef.current = setTimeout(
      () => {
        calculateAnalysisPoints()
        lastAnalysisViewRef.current = viewSignature
      },
      isPanning ? 100 : 50,
    ) // Longer delay during panning

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current)
      }
    }
  }, [calculateAnalysisPoints, isPanning])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseDown = (e: MouseEvent) => {
      setIsPanning(true)
      lastMousePos.current = { x: e.clientX, y: e.clientY }
      canvas.style.cursor = "grabbing"
    }

    const handleMouseUp = () => {
      setIsPanning(false)
      canvas.style.cursor = "grab"
    }

    const handleMouseLeave = () => {
      setIsPanning(false)
      setTrackingPoint(null)
      setHoveredPoint(null)
      canvas.style.cursor = "grab"
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      setMousePos({ x: e.clientX, y: e.clientY })

      if (!isPanning) {
        const canvasX = e.clientX - rect.left
        const canvasY = e.clientY - rect.top
        const width = canvas.width
        const height = canvas.height
        const toScreenX = (worldX: number) => (worldX - view.centerX) * view.zoom + width / 2
        const toScreenY = (worldY: number) => -(worldY - view.centerY) * view.zoom + height / 2
        const toWorldX = (screenX: number) => (screenX - width / 2) / view.zoom + view.centerX

        if (showMouseTracking) {
          const worldX = toWorldX(canvasX)
          const selectedEq = equations.find((eq) => eq.id === selectedGraphId)

          if (selectedEq && selectedEq.compiled) {
            try {
              const worldY = selectedEq.compiled.evaluate({ x: worldX })
              if (!isNaN(worldY) && isFinite(worldY)) {
                setTrackingPoint({ x: worldX, y: worldY })
              } else {
                setTrackingPoint(null)
              }
            } catch (e) {
              setTrackingPoint(null)
            }
          }
        } else {
          setTrackingPoint(null)
        }

        let foundPoint: AnalysisPoint | null = null
        for (const point of analysisPoints) {
          const screenX = toScreenX(point.x)
          const screenY = toScreenY(point.y)
          const distance = Math.sqrt((canvasX - screenX) ** 2 + (canvasY - screenY) ** 2)
          if (distance < 15) {
            foundPoint = point
            break
          }
        }
        setHoveredPoint(foundPoint)
        return
      }

      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y

      setView((prev) => ({
        ...prev,
        centerX: prev.centerX - dx / prev.zoom,
        centerY: prev.centerY + dy / prev.zoom,
      }))
      lastMousePos.current = { x: e.clientX, y: e.clientY }
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const zoomFactor = 1.1
      const newZoom = e.deltaY < 0 ? view.zoom * zoomFactor : view.zoom / zoomFactor
      setView((prev) => ({ ...prev, zoom: Math.max(5, Math.min(1000, newZoom)) }))
    }

    canvas.addEventListener("mousedown", handleMouseDown as EventListener)
    canvas.addEventListener("mouseup", handleMouseUp as EventListener)
    canvas.addEventListener("mouseleave", handleMouseLeave as EventListener)
    canvas.addEventListener("mousemove", handleMouseMove as EventListener)
    canvas.addEventListener("wheel", handleWheel as EventListener)

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown as EventListener)
      canvas.removeEventListener("mouseup", handleMouseUp as EventListener)
      canvas.removeEventListener("mouseleave", handleMouseLeave as EventListener)
      canvas.removeEventListener("mousemove", handleMouseMove as EventListener)
      canvas.removeEventListener("wheel", handleWheel as EventListener)
    }
  }, [isPanning, view.zoom, analysisPoints, view, showMouseTracking, equations, selectedGraphId])

  // --- Main Drawing Logic ---
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Coordinate transformation
    const toScreenX = (worldX: number) => (worldX - view.centerX) * view.zoom + width / 2
    const toScreenY = (worldY: number) => -(worldY - view.centerY) * view.zoom + height / 2
    const toWorldX = (screenX: number) => (screenX - width / 2) / view.zoom + view.centerX

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "rgba(30, 41, 59, 0.85)"
    ctx.fillRect(0, 0, width, height)

    const gridSize = Math.pow(10, Math.floor(Math.log10(150 / view.zoom)))
    ctx.strokeStyle = "rgba(51, 65, 85, 0.3)"
    ctx.lineWidth = 0.5
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "rgba(148, 163, 184, 0.6)"

    const xStart = Math.floor(toWorldX(0) / gridSize) * gridSize
    for (let x = xStart; x < toWorldX(width); x += gridSize) {
      const screenX = toScreenX(x)
      if (screenX < 0 || screenX > width) continue
      ctx.beginPath()
      ctx.moveTo(screenX, 0)
      ctx.lineTo(screenX, height)
      ctx.stroke()
      if (Math.abs(x) > 1e-9 && Math.abs(x / gridSize) % 2 === 0) {
        ctx.fillText(x.toPrecision(2), screenX + 2, toScreenY(0) - 2)
      }
    }

    const yStart = Math.floor(toWorldX(height) / gridSize) * gridSize
    for (let y = yStart; y > toWorldX(0) - gridSize; y -= gridSize) {
      const screenY = toScreenY(y)
      if (screenY < 0 || screenY > height) continue
      ctx.beginPath()
      ctx.moveTo(0, screenY)
      ctx.lineTo(width, screenY)
      ctx.stroke()
      if (Math.abs(y) > 1e-9 && Math.abs(y / gridSize) % 2 === 0) {
        ctx.fillText(y.toPrecision(2), toScreenX(0) + 2, screenY - 2)
      }
    }

    ctx.strokeStyle = "rgba(148, 163, 184, 0.8)"
    ctx.lineWidth = 1.5
    const originX = toScreenX(0),
      originY = toScreenY(0)
    ctx.beginPath()
    ctx.moveTo(0, originY)
    ctx.lineTo(width, originY)
    ctx.moveTo(originX, 0)
    ctx.lineTo(originX, height)
    ctx.stroke()

    ctx.lineWidth = 2.5
    ctx.lineCap = "round"

    equations.forEach((eq) => {
      if (!eq.compiled) return
      const gradient = ctx.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, eq.color)
      gradient.addColorStop(0.5, eq.color + "80")
      gradient.addColorStop(1, eq.color + "40")
      ctx.strokeStyle = gradient
      ctx.beginPath()
      let firstPoint = true
      for (let px = 0; px < width; px++) {
        const x = toWorldX(px)
        try {
          const y = eq.compiled.evaluate({ x: x })
          if (isNaN(y) || !isFinite(y)) {
            firstPoint = true
            continue
          }
          const py = toScreenY(y)
          if (firstPoint) {
            ctx.moveTo(px, py)
            firstPoint = false
          } else {
            ctx.lineTo(px, py)
          }
        } catch (e) {
          firstPoint = true
        }
      }
      ctx.stroke()
    })

    analysisPoints.forEach((point) => {
      const screenX = toScreenX(point.x)
      const screenY = toScreenY(point.y)
      if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) return
      const equation = equations.find((eq) => eq.id === point.equationId)
      const color = point.type === "intersection" ? "#ffffff" : equation?.color || "#ffffff"
      ctx.fillStyle = color
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 2
      ctx.beginPath()
      if (point.type === "root") {
        ctx.moveTo(screenX, screenY - 6)
        ctx.lineTo(screenX + 6, screenY)
        ctx.lineTo(screenX, screenY + 6)
        ctx.lineTo(screenX - 6, screenY)
        ctx.closePath()
      } else if (point.type === "intersection") {
        ctx.rect(screenX - 5, screenY - 5, 10, 10)
      } else {
        ctx.arc(screenX, screenY, 5, 0, 2 * Math.PI)
      }
      ctx.fill()
      ctx.stroke()
    })

    if (trackingPoint && showMouseTracking) {
      const screenX = toScreenX(trackingPoint.x)
      const screenY = toScreenY(trackingPoint.y)
      if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
        const selectedEq = equations.find((eq) => eq.id === selectedGraphId)
        const color = selectedEq?.color || "#ffffff"
        ctx.fillStyle = color
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])
        ctx.beginPath()
        ctx.moveTo(screenX, 0)
        ctx.lineTo(screenX, height)
        ctx.moveTo(0, screenY)
        ctx.lineTo(width, screenY)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
  }, [equations, view, analysisPoints, trackingPoint, showMouseTracking, selectedGraphId])

  const handleEquationChange = (id: number, newExpr: string) => {
    setEquations((prev) =>
      prev.map((eq) => {
        if (eq.id === id) {
          try {
            return { ...eq, expr: newExpr, compiled: math.compile(newExpr) }
          } catch (e) {
            return { ...eq, expr: newExpr, compiled: null }
          }
        }
        return eq
      }),
    )
  }

  const addEquation = () => {
    if (equations.length >= GRAPH_COLORS.length) return
    const newId = (equations[equations.length - 1]?.id || 0) + 1
    const newColor = GRAPH_COLORS[equations.length % GRAPH_COLORS.length]
    const newEquation = { id: newId, expr: "", compiled: null, color: newColor }
    setEquations((prev) => [...prev, newEquation])
    setSelectedGraphId(newId)
  }

  const removeEquation = (id: number) => {
    if (equations.length === 1) return
    setEquations((prev) => prev.filter((eq) => eq.id !== id))
    if (selectedGraphId === id) {
      const remaining = equations.filter((eq) => eq.id !== id)
      setSelectedGraphId(remaining[0]?.id || 1)
    }
  }

  const selectedEquation = equations.find((eq) => eq.id === selectedGraphId) || equations[0]

  return (
    <>
      <motion.div
        ref={graphingRef}
        className="fixed glass-strong rounded-2xl shadow-2xl z-50 flex flex-col"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "min(500px, 90vw)",
          height: "auto",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <div
          id="graphing-header"
          className="flex items-center justify-between p-3 border-b border-border cursor-move select-none group"
          title="Drag to move"
        >
          <div className="flex items-center gap-2 text-foreground font-medium">
            <TrendingUp size={16} className="group-hover:text-primary transition-colors" />
            <span>Graphing Tool</span>
          </div>
          <motion.button
            onClick={onClose}
            className="glass p-1.5 rounded-lg hover:bg-card/90 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={16} />
          </motion.button>
        </div>

        <div className="relative border-b border-border">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: selectedEquation.color }} />
              <label className="text-sm font-medium text-foreground">f(x) =</label>
              <input
                type="text"
                value={selectedEquation.expr}
                onChange={(e) => handleEquationChange(selectedEquation.id, e.target.value)}
                className={`flex-1 bg-background/80 border-2 border-border rounded-lg py-1 px-2 text-sm text-foreground placeholder-muted-foreground
                                       focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all
                                       ${selectedEquation.expr && !selectedEquation.compiled ? "border-red-400 focus:ring-red-400/50 focus:border-red-400" : "border-border"}`}
                placeholder="e.g., x^2, sin(x/2)"
              />
            </div>
            <button
              onClick={() => setIsGraphSelectorOpen(!isGraphSelectorOpen)}
              className="glass p-1.5 rounded-lg hover:bg-card/90 transition-all ml-2"
            >
              <Settings size={16} />
            </button>
          </div>

          <AnimatePresence>
            {isGraphSelectorOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                  onClick={() => setIsGraphSelectorOpen(false)}
                />
                <motion.div
                  className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-2xl border-t border-border/40 rounded-b-xl shadow-2xl z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">All Graphs ({equations.length})</span>
                      {equations.length < GRAPH_COLORS.length && (
                        <button
                          onClick={addEquation}
                          className="flex items-center gap-1 text-xs text-cyan-400 hover:bg-slate-700/30 px-2 py-1 rounded transition-colors"
                        >
                          <Plus size={14} /> Add
                        </button>
                      )}
                    </div>
                    {equations.map((eq) => (
                      <div
                        key={eq.id}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedGraphId === eq.id
                            ? "bg-slate-700/50 border border-cyan-400/30"
                            : "hover:bg-slate-700/30"
                        }`}
                        onClick={() => {
                          setSelectedGraphId(eq.id)
                          setIsGraphSelectorOpen(false)
                        }}
                      >
                        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: eq.color }} />
                        <span className="text-sm text-foreground flex-1">f(x) = {eq.expr || "empty"}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeEquation(eq.id)
                          }}
                          disabled={equations.length === 1}
                          className="p-1 rounded text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 p-3 border-b border-border min-h-[52px]">
          <button
            onClick={() => setShowRoots(!showRoots)}
            className={`glass px-2 py-1 rounded text-xs transition-colors ${
              showRoots
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-card/90"
            }`}
          >
            <Target size={12} />
            Roots
          </button>
          <button
            onClick={() => setShowExtrema(!showExtrema)}
            className={`glass px-2 py-1 rounded text-xs transition-colors ${
              showExtrema
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-card/90"
            }`}
          >
            <TrendingDown size={12} />
            Extrema
          </button>
          <button
            onClick={() => setShowIntersections(!showIntersections)}
            className={`glass px-2 py-1 rounded text-xs transition-colors ${
              showIntersections
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-card/90"
            }`}
          >
            <Move size={12} />
            Intersections
          </button>
          <button
            onClick={() => setShowMouseTracking(!showMouseTracking)}
            className={`glass px-2 py-1 rounded text-xs transition-colors ${
              showMouseTracking
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-card/90"
            }`}
          >
            <Target size={12} />
            Track
          </button>
        </div>

        <div className="p-1 relative">
          <canvas ref={canvasRef} width={482} height={350} className="w-full h-auto rounded-lg cursor-grab" />
          <div className="absolute bottom-2 right-3 text-xs text-muted-foreground flex items-center gap-1">
            <Move size={12} />
            <span>Pan & Scroll to Zoom</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {hoveredPoint && (
          <motion.div
            key="hover-tooltip"
            className="fixed z-[60] glass-strong rounded-lg px-2 py-1 text-xs text-foreground pointer-events-none shadow-xl"
            style={{
              left: mousePos.x + 10,
              top: mousePos.y - 35,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
          >
            {hoveredPoint.info}
          </motion.div>
        )}
        {trackingPoint && showMouseTracking && (
          <motion.div
            key="track-tooltip"
            className="fixed z-[60] bg-amber-800/95 backdrop-blur-lg border border-amber-700/50 rounded-lg px-2 py-1 text-xs text-amber-100 pointer-events-none shadow-xl"
            style={{
              left: mousePos.x + 10,
              top: mousePos.y - 55,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
          >
            ({Math.abs(trackingPoint.x) < 1e-6 ? 0 : Math.round(trackingPoint.x * 1000) / 1000},{" "}
            {Math.abs(trackingPoint.y) < 1e-6 ? 0 : Math.round(trackingPoint.y * 1000) / 1000})
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}