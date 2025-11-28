"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, Plus, Trash2, Move, Settings, Target, TrendingDown,
  Eye, EyeOff, Maximize, Minus, Search, Calculator, ChevronRight, ChevronLeft
} from "lucide-react"
import { create, all, type EvalFunction } from "mathjs"

const math = create(all)

const GRAPH_COLORS = [
  "#22d3ee",
  "#e879f9",
  "#4ade80",
  "#fb7185",
  "#facc15",
  "#818cf8",
  "#fb923c",
]

interface Equation {
  id: number
  expr: string
  compiled: EvalFunction | null
  color: string
  visible: boolean
  error?: boolean
}

interface AnalysisPoint {
  x: number
  y: number
  type: "root" | "intersection" | "minimum" | "maximum"
  equationId?: number
  info: string
}

export default function FullscreenGraphingTool() {
  const [equations, setEquations] = useState<Equation[]>([
    { id: 1, expr: "sin(x)", compiled: math.compile("sin(x)"), color: GRAPH_COLORS[0], visible: true },
    { id: 2, expr: "x^2 / 10", compiled: math.compile("x^2 / 10"), color: GRAPH_COLORS[1], visible: true },
  ])

  const [view, setView] = useState({ zoom: 40, centerX: 0, centerY: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const [showRoots, setShowRoots] = useState(false)
  const [showExtrema, setShowExtrema] = useState(false)
  const [showIntersections, setShowIntersections] = useState(false)
  const [showMouseTracking, setShowMouseTracking] = useState(false)

  const [trackingPoint, setTrackingPoint] = useState<{ x: number; y: number; color: string } | null>(null)
  const [analysisPoints, setAnalysisPoints] = useState<AnalysisPoint[]>([])
  const [hoveredPoint, setHoveredPoint] = useState<AnalysisPoint | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastAnalysisViewRef = useRef<string>("")

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const updateSize = () => {
      const { width, height } = container.getBoundingClientRect()
      // Set actual canvas size to match display size for sharpness
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      // Scale context to match dpr
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
    }

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(container)
    updateSize() // Initial size

    return () => resizeObserver.disconnect()
  }, [])

  const calculateAnalysisPoints = useCallback(() => {
    if (!showRoots && !showExtrema && !showIntersections) {
      setAnalysisPoints([])
      return
    }

    const canvas = canvasRef.current
    if (!canvas || canvas.width === 0) return

    // Use logical width (CSS pixels), not physical width
    const width = canvas.clientWidth
    const toWorldX = (screenX: number) => (screenX - width / 2) / view.zoom + view.centerX

    const points: AnalysisPoint[] = []

    equations.forEach((eq) => {
      if (!eq.compiled || !eq.visible) return

      const samples = 500
      const xMin = toWorldX(0)
      const xMax = toWorldX(width)
      const step = (xMax - xMin) / samples
      const values: { x: number; y: number }[] = []

      for (let i = 0; i <= samples; i++) {
        const x = xMin + i * step
        try {
          const y = eq.compiled.evaluate({ x })
          if (isNaN(y) || !isFinite(y)) continue
          values.push({ x, y })
        } catch (e) { continue }
      }

      for (let i = 1; i < values.length; i++) {
        const curr = values[i]
        const prev = values[i - 1]

        if (showRoots && Math.sign(curr.y) !== Math.sign(prev.y)) {
          // Binary search for precision
          let x1 = prev.x, x2 = curr.x
          for (let j = 0; j < 6; j++) {
            const xMid = (x1 + x2) / 2
            const yMid = eq.compiled.evaluate({ x: xMid })
            if (Math.sign(yMid) === Math.sign(prev.y)) x1 = xMid; else x2 = xMid
          }
          const rootX = (x1 + x2) / 2
          points.push({
            x: rootX, y: 0, type: "root", equationId: eq.id,
            info: `Root: (${rootX.toFixed(3)}, 0)`
          })
        }
      }

      if (showExtrema && values.length > 4) {
        for (let i = 2; i < values.length - 2; i++) {
          const [p2, p1, c, n1, n2] = [values[i - 2], values[i - 1], values[i], values[i + 1], values[i + 2]]
          const isMin = c.y < p1.y && c.y < n1.y && p1.y < p2.y && n1.y < n2.y;
          const isMax = c.y > p1.y && c.y > n1.y && p1.y > p2.y && n1.y > n2.y;
          if (isMin || isMax) {
            points.push({
              x: c.x, y: c.y, type: isMin ? "minimum" : "maximum", equationId: eq.id,
              info: `${isMin ? "Min" : "Max"}: (${c.x.toFixed(2)}, ${c.y.toFixed(2)})`
            })
            i += 2 // Skip neighbors
          }
        }
      }
    })

    if (showIntersections && equations.filter(e => e.visible).length > 1) {
      const visibleEqs = equations.filter(e => e.visible && e.compiled);
      for (let i = 0; i < visibleEqs.length; i++) {
        for (let j = i + 1; j < visibleEqs.length; j++) {
          const eq1 = visibleEqs[i], eq2 = visibleEqs[j]
          if (!eq1.compiled || !eq2.compiled) continue

          const samples = 400
          const xMin = toWorldX(0), xMax = toWorldX(width), step = (xMax - xMin) / samples

          for (let k = 0; k < samples; k++) {
            const x1 = xMin + k * step, x2 = xMin + (k + 1) * step
            try {
              const diff1 = eq1.compiled.evaluate({ x: x1 }) - eq2.compiled.evaluate({ x: x1 })
              const diff2 = eq1.compiled.evaluate({ x: x2 }) - eq2.compiled.evaluate({ x: x2 })

              if (Math.sign(diff1) !== Math.sign(diff2)) {
                let low = x1, high = x2, intersectX = x1
                for (let iter = 0; iter < 5; iter++) {
                  const mid = (low + high) / 2
                  const dMid = eq1.compiled.evaluate({ x: mid }) - eq2.compiled.evaluate({ x: mid })
                  if (Math.sign(dMid) === Math.sign(diff1)) low = mid; else high = mid
                  intersectX = mid
                }
                const intersectY = eq1.compiled.evaluate({ x: intersectX })
                points.push({
                  x: intersectX, y: intersectY, type: "intersection",
                  info: `Intersect: (${intersectX.toFixed(2)}, ${intersectY.toFixed(2)})`
                })
              }
            } catch (e) { continue }
          }
        }
      }
    }
    setAnalysisPoints(points)
  }, [equations, view, showRoots, showExtrema, showIntersections])

  useEffect(() => {
    const viewSignature = `${view.zoom.toFixed(1)}-${view.centerX.toFixed(2)}-${view.centerY.toFixed(2)}-${equations.map(eq => eq.visible ? eq.expr : '').join(",")}-${showRoots}-${showExtrema}-${showIntersections}`
    if (viewSignature === lastAnalysisViewRef.current) return

    if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current)
    analysisTimeoutRef.current = setTimeout(() => {
      calculateAnalysisPoints()
      lastAnalysisViewRef.current = viewSignature
    }, isPanning ? 150 : 50)

    return () => { if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current) }
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
      canvas.style.cursor = "crosshair"
    }

    const handleMouseLeave = () => {
      setIsPanning(false)
      setTrackingPoint(null)
      setHoveredPoint(null)
      canvas.style.cursor = "crosshair"
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const canvasX = e.clientX - rect.left
      const canvasY = e.clientY - rect.top

      if (isPanning) {
        const dx = e.clientX - lastMousePos.current.x
        const dy = e.clientY - lastMousePos.current.y
        setView(prev => ({
          ...prev,
          centerX: prev.centerX - dx / prev.zoom,
          centerY: prev.centerY + dy / prev.zoom
        }))
        lastMousePos.current = { x: e.clientX, y: e.clientY }
        return
      }

      const toWorldX = (screenX: number) => (screenX - width / 2) / view.zoom + view.centerX

      if (showMouseTracking) {
        const worldX = toWorldX(canvasX)
        let closestY = Infinity
        let closestEqColor = "#fff"
        let minDist = Infinity

        equations.filter(eq => eq.visible && eq.compiled).forEach(eq => {
          try {
            const worldY = eq.compiled!.evaluate({ x: worldX })
            // Convert back to screen to check distance
            const screenY = -(worldY - view.centerY) * view.zoom + height / 2
            const dist = Math.abs(canvasY - screenY)

            // Snap if within 50px vertical distance
            if (dist < 50 && dist < minDist) {
              minDist = dist
              closestY = worldY
              closestEqColor = eq.color
            }
          } catch (e) { }
        })

        if (minDist < Infinity) {
          setTrackingPoint({ x: worldX, y: closestY, color: closestEqColor })
        } else {
          setTrackingPoint(null) // No graph near cursor
        }
      } else {
        setTrackingPoint(null)
      }

      let foundPoint: AnalysisPoint | null = null
      let minPointDist = 20

      for (const point of analysisPoints) {
        const screenX = (point.x - view.centerX) * view.zoom + width / 2
        const screenY = -(point.y - view.centerY) * view.zoom + height / 2
        const dist = Math.sqrt((canvasX - screenX) ** 2 + (canvasY - screenY) ** 2)

        if (dist < minPointDist) {
          minPointDist = dist
          foundPoint = point
        }
      }
      setHoveredPoint(foundPoint)
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      // Zoom towards mouse pointer
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      const worldX = (mouseX - width / 2) / view.zoom + view.centerX
      const worldY = -(mouseY - height / 2) / view.zoom + view.centerY

      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9
      const newZoom = Math.max(5, Math.min(5000, view.zoom * zoomFactor))

      // Adjust center so world X,Y remains at mouse X,Y
      const newCenterX = worldX - (mouseX - width / 2) / newZoom
      const newCenterY = worldY + (mouseY - height / 2) / newZoom

      setView({ zoom: newZoom, centerX: newCenterX, centerY: newCenterY })
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("wheel", handleWheel)
    }
  }, [isPanning, view, analysisPoints, showMouseTracking, equations])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    const toScreenX = (worldX: number) => (worldX - view.centerX) * view.zoom + width / 2
    const toScreenY = (worldY: number) => -(worldY - view.centerY) * view.zoom + height / 2
    const toWorldX = (screenX: number) => (screenX - width / 2) / view.zoom + view.centerX

    const gridSize = Math.pow(10, Math.floor(Math.log10(100 / view.zoom)))

    ctx.lineWidth = 1 / dpr
    ctx.font = "10px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    const startX = Math.floor(toWorldX(0) / gridSize) * gridSize
    const endX = toWorldX(width)

    for (let x = startX; x < endX; x += gridSize) {
      const sx = toScreenX(x)

      if (Math.abs(x) < gridSize / 10) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        ctx.lineWidth = 2
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        ctx.lineWidth = 1
      }

      ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, height); ctx.stroke()

      if (Math.abs(x) > gridSize / 10) {
        ctx.fillStyle = "rgba(148, 163, 184, 0.8)"
        ctx.fillText(parseFloat(x.toPrecision(4)).toString(), sx, toScreenY(0) + 6)
      }
    }

    const startY = Math.floor(toWorldX(height) / gridSize) * gridSize
    const worldBottom = -(height - height / 2) / view.zoom + view.centerY
    const worldTop = -(0 - height / 2) / view.zoom + view.centerY

    const startYReal = Math.floor(worldBottom / gridSize) * gridSize

    for (let y = startYReal; y < worldTop; y += gridSize) {
      const sy = toScreenY(y)

      if (Math.abs(y) < gridSize / 10) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        ctx.lineWidth = 2
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        ctx.lineWidth = 1
      }

      ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(width, sy); ctx.stroke()

      if (Math.abs(y) > gridSize / 10) {
        ctx.fillStyle = "rgba(148, 163, 184, 0.8)"
        ctx.fillText(parseFloat(y.toPrecision(4)).toString(), toScreenX(0) - 15, sy - 4)
      }
    }

    equations.forEach((eq) => {
      if (!eq.compiled || !eq.visible) return

      ctx.strokeStyle = eq.color
      ctx.lineWidth = 2.5
      ctx.lineJoin = "round"
      ctx.beginPath()

      let isDrawing = false

      for (let px = 0; px < width; px += 2) {
        const x = toWorldX(px)
        try {
          const y = eq.compiled.evaluate({ x: x })
          const py = toScreenY(y)

          if (isNaN(y) || !isFinite(y) || Math.abs(py) > height * 2) {
            isDrawing = false
            continue
          }

          if (!isDrawing) {
            ctx.moveTo(px, py)
            isDrawing = true
          } else {
            ctx.lineTo(px, py)
          }
        } catch (e) { isDrawing = false }
      }
      ctx.stroke()
    })

    analysisPoints.forEach((point) => {
      const screenX = toScreenX(point.x)
      const screenY = toScreenY(point.y)
      if (screenX < -20 || screenX > width + 20 || screenY < -20 || screenY > height + 20) return

      ctx.fillStyle = point.type === "intersection" ? "#ffffff" : equations.find(eq => eq.id === point.equationId)?.color || "#ffffff"
      ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.arc(screenX, screenY, 5, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
    })

    if (trackingPoint && showMouseTracking) {
      const screenX = toScreenX(trackingPoint.x)
      const screenY = toScreenY(trackingPoint.y)

      ctx.fillStyle = trackingPoint.color
      ctx.strokeStyle = "white"
      ctx.lineWidth = 3

      ctx.beginPath()
      ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])

      ctx.beginPath(); ctx.moveTo(screenX, 0); ctx.lineTo(screenX, height); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, screenY); ctx.lineTo(width, screenY); ctx.stroke()

      ctx.setLineDash([])
    }

  }, [equations, view, analysisPoints, trackingPoint, showMouseTracking])

  const handleEquationChange = (id: number, newExpr: string) => {
    setEquations((prev) =>
      prev.map((eq) => {
        if (eq.id === id) {
          let compiled = null
          let error = false
          if (newExpr.trim()) {
            try {
              compiled = math.compile(newExpr)
            } catch (e) { error = true }
          }
          return { ...eq, expr: newExpr, compiled, error }
        }
        return eq
      })
    )
  }

  const toggleVisibility = (id: number) => {
    setEquations(prev => prev.map(eq => eq.id === id ? { ...eq, visible: !eq.visible } : eq))
  }

  const deleteEquation = (id: number) => {
    setEquations(prev => prev.filter(eq => eq.id !== id))
  }

  const addEquation = () => {
    const newId = Math.max(0, ...equations.map(e => e.id)) + 1
    const nextColor = GRAPH_COLORS[equations.length % GRAPH_COLORS.length]
    setEquations([...equations, { id: newId, expr: "", compiled: null, color: nextColor, visible: true }])
  }

  return (
    <div className="w-full h-full flex bg-[#0f172a] relative overflow-hidden">

      {/* --- Sidebar (Functions List) --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-4 bottom-4 left-4 w-80 glass-strong rounded-2xl z-20 flex flex-col border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-400" />
                Functions
              </h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <ChevronLeft size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
              {equations.map((eq) => (
                <motion.div
                  layout
                  key={eq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group relative bg-card/40 backdrop-blur-sm border rounded-xl p-3 transition-all duration-200 ${eq.error ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 hover:border-white/20'}`}
                  style={{ borderLeftColor: eq.color, borderLeftWidth: 4 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground" style={{ color: eq.color }}>f{eq.id}(x) =</span>
                    <div className="flex-1" />
                    <button onClick={() => toggleVisibility(eq.id)} className="text-muted-foreground hover:text-white transition-colors p-1">
                      {eq.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => deleteEquation(eq.id)} className="text-muted-foreground hover:text-red-400 transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={eq.expr}
                    onChange={(e) => handleEquationChange(eq.id, e.target.value)}
                    placeholder="Type expression..."
                    className="w-full bg-transparent border-none outline-none text-lg font-medium text-foreground placeholder-white/20"
                    spellCheck={false}
                  />
                  {eq.error && <div className="text-xs text-red-400 mt-1">Invalid syntax</div>}
                </motion.div>
              ))}

              <button
                onClick={addEquation}
                className="w-full py-3 rounded-xl border border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add Function
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Sidebar Toggle (When Closed) --- */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-6 left-6 z-20 glass p-3 rounded-xl hover:bg-white/20 transition-all shadow-lg"
        >
          <ChevronRight className="text-white" />
        </button>
      )}

      {/* --- Main Canvas --- */}
      <div ref={containerRef} className="flex-1 relative h-full w-full cursor-crosshair">
        <canvas ref={canvasRef} className="block w-full h-full touch-none" />

        {/* --- Tooltip --- */}
        <AnimatePresence>
          {(hoveredPoint || trackingPoint) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-30 pointer-events-none"
              style={{
                left: (function () {
                  if (hoveredPoint) return (hoveredPoint.x - view.centerX) * view.zoom + containerRef.current!.clientWidth / 2
                  if (trackingPoint) return (trackingPoint.x - view.centerX) * view.zoom + containerRef.current!.clientWidth / 2
                  return 0
                })(),
                top: (function () {
                  if (hoveredPoint) return -(hoveredPoint.y - view.centerY) * view.zoom + containerRef.current!.clientHeight / 2 - 50
                  if (trackingPoint) return -(trackingPoint.y - view.centerY) * view.zoom + containerRef.current!.clientHeight / 2 - 50
                  return 0
                })(),
                transform: 'translate(-50%, 0)'
              }}
            >
              <div className="glass-strong px-3 py-2 rounded-lg text-xs font-medium text-white shadow-xl border border-white/10 backdrop-blur-md">
                {hoveredPoint ? hoveredPoint.info : `(${trackingPoint?.x.toFixed(2)}, ${trackingPoint?.y.toFixed(2)})`}
              </div>
              {/* Arrow pointer */}
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/20 mx-auto" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Bottom Tool Dock --- */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <motion.div
            className="glass-strong p-1.5 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-1"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <ToolButton
              active={showRoots}
              onClick={() => setShowRoots(!showRoots)}
              icon={Target}
              label="Roots"
              color="cyan"
            />
            <ToolButton
              active={showExtrema}
              onClick={() => setShowExtrema(!showExtrema)}
              icon={TrendingDown}
              label="Extrema"
              color="purple"
            />
            <ToolButton
              active={showIntersections}
              onClick={() => setShowIntersections(!showIntersections)}
              icon={Move}
              label="Intersect"
              color="green"
            />
            <div className="w-px h-8 bg-white/10 mx-1" />
            <ToolButton
              active={showMouseTracking}
              onClick={() => setShowMouseTracking(!showMouseTracking)}
              icon={Search}
              label="Trace"
              color="amber"
            />
          </motion.div>
        </div>

        {/* --- Zoom Controls --- */}
        <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
          <button
            onClick={() => setView(prev => ({ ...prev, zoom: prev.zoom * 1.2 }))}
            className="glass p-3 rounded-full hover:bg-white/20 transition-colors"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => setView(prev => ({ ...prev, zoom: prev.zoom / 1.2 }))}
            className="glass p-3 rounded-full hover:bg-white/20 transition-colors"
          >
            <Minus size={20} />
          </button>
          <button
            onClick={() => setView({ zoom: 40, centerX: 0, centerY: 0 })}
            className="glass p-3 rounded-full hover:bg-white/20 transition-colors mt-2"
            title="Reset View"
          >
            <Maximize size={20} />
          </button>
        </div>

      </div>
    </div>
  )
}

// Helper Component for Tools
const ToolButton = ({ active, onClick, icon: Icon, label, color }: any) => {
  const colorClasses: Record<string, string> = {
    cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    green: "bg-green-500/20 text-green-300 border-green-500/30",
    amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200 border
        ${active
          ? colorClasses[color]
          : "border-transparent text-muted-foreground hover:bg-white/5 hover:text-white"
        }
      `}
    >
      <Icon size={20} className={`mb-1 ${active ? "" : "opacity-70"}`} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}