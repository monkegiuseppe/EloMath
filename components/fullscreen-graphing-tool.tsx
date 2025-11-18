// components/fullscreen-graphing-tool.tsx

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, TrendingUp, Plus, Trash2, Move, Settings, Target, TrendingDown } from "lucide-react"
import { create, all, type EvalFunction } from "mathjs"

const math = create(all)

const GRAPH_COLORS = [
  "#06b6d4", // cyan
  "#a855f7", // purple
  "#22c55e", // green
  "#f43f5e", // rose
  "#f59e0b", // amber
]

interface Equation {
  id: number
  expr: string
  compiled: EvalFunction | null
  color: string
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

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastAnalysisViewRef = useRef<string>("")

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        canvas.width = width
        canvas.height = height
      }
    })

    resizeObserver.observe(container)
    const { width, height } = container.getBoundingClientRect()
    canvas.width = width
    canvas.height = height

    return () => resizeObserver.disconnect()
  }, [])

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
    if (!canvas || canvas.width === 0) return

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

      for (let i = 1; i < values.length; i++) {
        const curr = values[i]
        const prev = values[i - 1]

        if (showRoots && Math.sign(curr.y) !== Math.sign(prev.y)) {
          let x1 = prev.x, x2 = curr.x
          for (let j = 0; j < 8; j++) {
            const xMid = (x1 + x2) / 2
            const yMid = eq.compiled.evaluate({ x: xMid })
            if (Math.sign(yMid) === Math.sign(prev.y)) x1 = xMid; else x2 = xMid
          }
          const rootX = (x1 + x2) / 2
          points.push({ x: rootX, y: 0, type: "root", equationId: eq.id, info: `(${(Math.abs(rootX) < 1e-6 ? 0 : rootX.toFixed(3))}, 0)` })
        }
      }

      if (showExtrema && values.length > 4) {
        for (let i = 2; i < values.length - 2; i++) {
            const [p2, p1, c, n1, n2] = [values[i - 2], values[i - 1], values[i], values[i + 1], values[i + 2]]
            const isMin = c.y < p1.y && c.y < n1.y && p1.y < p2.y && n1.y < n2.y;
            const isMax = c.y > p1.y && c.y > n1.y && p1.y > p2.y && n1.y > n2.y;
            if (isMin || isMax) {
                points.push({ x: c.x, y: c.y, type: isMin ? "minimum" : "maximum", equationId: eq.id, info: `(${(c.x.toFixed(2))}, ${(c.y.toFixed(2))})`})
                i += 2
            }
        }
      }
    })

    if (showIntersections && equations.length > 1) {
      for (let i = 0; i < equations.length; i++) {
        for (let j = i + 1; j < equations.length; j++) {
          const eq1 = equations[i], eq2 = equations[j]
          if (!eq1.compiled || !eq2.compiled) continue
          const samples = 1000
          const xMin = toWorldX(0), xMax = toWorldX(width), step = (xMax - xMin) / samples
          for (let k = 0; k < samples; k++) {
            const x1 = xMin + k * step, x2 = xMin + (k + 1) * step
            try {
              const diff1 = eq1.compiled.evaluate({x: x1}) - eq2.compiled.evaluate({x: x1})
              const diff2 = eq1.compiled.evaluate({x: x2}) - eq2.compiled.evaluate({x: x2})
              if(Math.sign(diff1) !== Math.sign(diff2)) {
                const intersectX = (x1+x2)/2
                const intersectY = eq1.compiled.evaluate({x: intersectX})
                points.push({ x: intersectX, y: intersectY, type: "intersection", info: `(${(intersectX.toFixed(2))}, ${(intersectY.toFixed(2))})`})
              }
            } catch(e) { continue }
          }
        }
      }
    }
    setAnalysisPoints(points)
  }, [equations, view.zoom, view.centerX, view.centerY, showRoots, showExtrema, showIntersections])

  useEffect(() => {
    const viewSignature = `${view.zoom.toFixed(1)}-${view.centerX.toFixed(2)}-${view.centerY.toFixed(2)}-${equations.map((eq) => eq.expr).join(",")}-${showRoots}-${showExtrema}-${showIntersections}`
    if (viewSignature === lastAnalysisViewRef.current) return
    if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current)
    analysisTimeoutRef.current = setTimeout(() => {
        calculateAnalysisPoints()
        lastAnalysisViewRef.current = viewSignature
      }, isPanning ? 100 : 50)
    return () => { if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current) }
  }, [calculateAnalysisPoints, isPanning])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const handleMouseDown = (e: MouseEvent) => { setIsPanning(true); lastMousePos.current = { x: e.clientX, y: e.clientY }; canvas.style.cursor = "grabbing" }
    const handleMouseUp = () => { setIsPanning(false); canvas.style.cursor = "grab" }
    const handleMouseLeave = () => { setIsPanning(false); setTrackingPoint(null); setHoveredPoint(null); canvas.style.cursor = "grab" }
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const toWorldX = (screenX: number) => (screenX - canvas.width / 2) / view.zoom + view.centerX;

      if (!isPanning) {
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;

        if (showMouseTracking) {
          const worldX = toWorldX(canvasX);
          const selectedEq = equations.find((eq) => eq.id === selectedGraphId);
          if (selectedEq?.compiled) {
            try {
              const worldY = selectedEq.compiled.evaluate({ x: worldX });
              if (!isNaN(worldY) && isFinite(worldY)) setTrackingPoint({ x: worldX, y: worldY });
              else setTrackingPoint(null);
            } catch (e) {
              setTrackingPoint(null);
            }
          }
        } else {
          setTrackingPoint(null);
        }

        let foundPoint: AnalysisPoint | null = null;
        for (const point of analysisPoints) {
          const screenX = (point.x - view.centerX) * view.zoom + canvas.width / 2;
          const screenY = -(point.y - view.centerY) * view.zoom + canvas.height / 2;
          if (Math.sqrt((canvasX - screenX) ** 2 + (canvasY - screenY) ** 2) < 15) {
            foundPoint = point;
            break;
          }
        }
        setHoveredPoint(foundPoint);
        return;
      }
      const dx = e.clientX - lastMousePos.current.x, dy = e.clientY - lastMousePos.current.y
      setView((prev) => ({ ...prev, centerX: prev.centerX - dx / prev.zoom, centerY: prev.centerY + dy / prev.zoom }))
      lastMousePos.current = { x: e.clientX, y: e.clientY }
    }
    const handleWheel = (e: WheelEvent) => { e.preventDefault(); setView((prev) => ({ ...prev, zoom: Math.max(5, Math.min(1000, prev.zoom * (e.deltaY < 0 ? 1.1 : 1/1.1))) })) }
    canvas.addEventListener("mousedown", handleMouseDown as EventListener); canvas.addEventListener("mouseup", handleMouseUp as EventListener); canvas.addEventListener("mouseleave", handleMouseLeave as EventListener); canvas.addEventListener("mousemove", handleMouseMove as EventListener); canvas.addEventListener("wheel", handleWheel as EventListener)
    return () => { canvas.removeEventListener("mousedown", handleMouseDown as EventListener); canvas.removeEventListener("mouseup", handleMouseUp as EventListener); canvas.removeEventListener("mouseleave", handleMouseLeave as EventListener); canvas.removeEventListener("mousemove", handleMouseMove as EventListener); canvas.removeEventListener("wheel", handleWheel as EventListener) }
  }, [isPanning, view.zoom, analysisPoints, view, showMouseTracking, equations, selectedGraphId])

  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return
    const width = canvas.width, height = canvas.height
    const toScreenX = (worldX: number) => (worldX - view.centerX) * view.zoom + width / 2
    const toScreenY = (worldY: number) => -(worldY - view.centerY) * view.zoom + height / 2
    const toWorldX = (screenX: number) => (screenX - width / 2) / view.zoom + view.centerX
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "rgba(30, 41, 59, 0.85)"; ctx.fillRect(0, 0, width, height)
    const gridSize = Math.pow(10, Math.floor(Math.log10(150 / view.zoom)));
    ctx.strokeStyle = "rgba(51, 65, 85, 0.3)"; ctx.lineWidth = 0.5; ctx.font = "10px sans-serif"; ctx.fillStyle = "rgba(148, 163, 184, 0.6)"
    for (let x = Math.floor(toWorldX(0) / gridSize) * gridSize; x < toWorldX(width); x += gridSize) { const screenX = toScreenX(x); if (screenX < 0 || screenX > width) continue; ctx.beginPath(); ctx.moveTo(screenX, 0); ctx.lineTo(screenX, height); ctx.stroke(); if (Math.abs(x) > 1e-9 && Math.abs(x / gridSize) % 2 === 0) ctx.fillText(x.toPrecision(2), screenX + 2, toScreenY(0) - 2) }
    for (let y = Math.floor(toWorldX(height) / gridSize) * gridSize; y > toWorldX(0) - gridSize; y -= gridSize) { const screenY = toScreenY(y); if (screenY < 0 || screenY > height) continue; ctx.beginPath(); ctx.moveTo(0, screenY); ctx.lineTo(width, screenY); ctx.stroke(); if (Math.abs(y) > 1e-9 && Math.abs(y / gridSize) % 2 === 0) ctx.fillText(y.toPrecision(2), toScreenX(0) + 2, screenY - 2) }
    ctx.strokeStyle = "rgba(148, 163, 184, 0.8)"; ctx.lineWidth = 1.5; const originX = toScreenX(0), originY = toScreenY(0); ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(width, originY); ctx.moveTo(originX, 0); ctx.lineTo(originX, height); ctx.stroke()
    ctx.lineWidth = 2.5; ctx.lineCap = "round"
    equations.forEach((eq) => {
      if (!eq.compiled) return;
      ctx.strokeStyle = eq.color; ctx.beginPath(); let firstPoint = true
      for (let px = 0; px < width; px++) {
        const x = toWorldX(px)
        try {
          const y = eq.compiled.evaluate({ x: x });
          if (isNaN(y) || !isFinite(y)) { firstPoint = true; continue }
          const py = toScreenY(y)
          if (firstPoint) { ctx.moveTo(px, py); firstPoint = false } else ctx.lineTo(px, py)
        } catch (e) { firstPoint = true }
      }
      ctx.stroke()
    })
    analysisPoints.forEach((point) => {
      const screenX = toScreenX(point.x), screenY = toScreenY(point.y)
      if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) return
      ctx.fillStyle = point.type === "intersection" ? "#ffffff" : equations.find(eq => eq.id === point.equationId)?.color || "#ffffff"
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"; ctx.lineWidth = 2; ctx.beginPath()
      if (point.type === "root") { ctx.moveTo(screenX, screenY-6); ctx.lineTo(screenX+6, screenY); ctx.lineTo(screenX, screenY+6); ctx.lineTo(screenX-6, screenY); ctx.closePath() }
      else if (point.type === "intersection") ctx.rect(screenX - 5, screenY - 5, 10, 10)
      else ctx.arc(screenX, screenY, 5, 0, 2 * Math.PI)
      ctx.fill(); ctx.stroke()
    })
    if (trackingPoint && showMouseTracking) {
      const screenX = toScreenX(trackingPoint.x), screenY = toScreenY(trackingPoint.y)
      if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
        ctx.fillStyle = equations.find((eq) => eq.id === selectedGraphId)?.color || "#ffffff"; ctx.strokeStyle = "rgba(255, 255, 255, 0.9)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI); ctx.fill(); ctx.stroke()
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(screenX, 0); ctx.lineTo(screenX, height); ctx.moveTo(0, screenY); ctx.lineTo(width, screenY); ctx.stroke(); ctx.setLineDash([])
      }
    }
  }, [equations, view, analysisPoints, trackingPoint, showMouseTracking, selectedGraphId])

  const handleEquationChange = (id: number, newExpr: string) => {
    setEquations((prev) =>
      prev.map((eq) => {
        if (eq.id === id) {
          if (!newExpr.trim()) return { ...eq, expr: newExpr, compiled: null };
          try {
            return { ...eq, expr: newExpr, compiled: math.compile(newExpr) };
          } catch (e) {
            return { ...eq, expr: newExpr, compiled: null };
          }
        }
        return eq;
      })
    );
  };
  
  const addEquation = () => { if (equations.length >= GRAPH_COLORS.length) return; const newId = (equations[equations.length - 1]?.id || 0) + 1; const newColor = GRAPH_COLORS[equations.length % GRAPH_COLORS.length]; setEquations((prev) => [...prev, { id: newId, expr: "", compiled: null, color: newColor }]); setSelectedGraphId(newId) }
  const removeEquation = (id: number) => { if (equations.length === 1) return; setEquations((prev) => prev.filter((eq) => eq.id !== id)); if (selectedGraphId === id) setSelectedGraphId(equations.filter(eq => eq.id !== id)[0]?.id || 1) }

  const selectedEquation = equations.find((eq) => eq.id === selectedGraphId) || equations[0]
  
  const getTooltipPosition = (point: { x: number; y: number } | null) => {
    if (!point || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const toScreenX = (worldX: number) => (worldX - view.centerX) * view.zoom + canvas.width / 2;
    const toScreenY = (worldY: number) => -(worldY - view.centerY) * view.zoom + canvas.height / 2;
    return {
      left: toScreenX(point.x),
      bottom: canvas.height - toScreenY(point.y) + 12, // 12px gap
    };
  };

  const hoveredTooltipPosition = getTooltipPosition(hoveredPoint);
  const trackingTooltipPosition = getTooltipPosition(trackingPoint);

  return (
    <div className="w-full h-full flex flex-col bg-card/50 rounded-b-lg overflow-hidden">
      <div className="flex-shrink-0">
        <div className={`relative transition-all ${isGraphSelectorOpen ? 'border-transparent' : 'border-b border-border'}`}>
          <div className="flex items-center justify-between p-3 gap-2">
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
              <div className="w-1.5 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: selectedEquation.color }} />
              <label className="text-sm font-medium text-foreground flex-shrink-0">f(x) =</label>
              <input type="text" value={selectedEquation.expr} onChange={(e) => handleEquationChange(selectedEquation.id, e.target.value)} className={`flex-1 min-w-0 bg-background/80 border-2 rounded-lg py-1 px-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all ${selectedEquation.expr && !selectedEquation.compiled ? "border-red-400" : "border-border"}`} placeholder="e.g., x^2, sin(x/2)"/>
            </div>
            <button onClick={() => setIsGraphSelectorOpen(!isGraphSelectorOpen)} className="glass p-1.5 rounded-lg hover:bg-card/90 transition-all ml-auto flex-shrink-0"><Settings size={16} /></button>
          </div>
          <AnimatePresence>
            {isGraphSelectorOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsGraphSelectorOpen(false)} />
                <motion.div className="absolute top-full left-0 right-0 bg-card/[0.98] backdrop-blur-xl border-t border-border/40 rounded-b-xl shadow-2xl z-50" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">All Graphs ({equations.length})</span>
                      {equations.length < GRAPH_COLORS.length && (<button onClick={addEquation} className="flex items-center gap-1 text-xs text-cyan-400 hover:bg-slate-700/30 px-2 py-1 rounded transition-colors"><Plus size={14} /> Add</button>)}
                    </div>
                    {equations.map((eq) => (
                      <div key={eq.id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${selectedGraphId === eq.id ? "bg-slate-700/50 border border-cyan-400/30" : "hover:bg-slate-700/30"}`} onClick={() => { setSelectedGraphId(eq.id); setIsGraphSelectorOpen(false) }}>
                        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: eq.color }} />
                        <span className="text-sm text-foreground flex-1">f(x) = {eq.expr || "empty"}</span>
                        <button onClick={(e) => { e.stopPropagation(); removeEquation(eq.id) }} disabled={equations.length === 1} className="p-1 rounded text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        <div className={`flex flex-wrap items-center gap-2 p-3 min-h-[52px] transition-all ${isGraphSelectorOpen ? 'border-transparent' : 'border-b border-border'}`}>
          <button onClick={() => setShowRoots(!showRoots)} className={`flex items-center gap-1.5 glass px-2 py-1 rounded text-xs transition-colors ${showRoots ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" : "text-muted-foreground hover:bg-card/90"}`}><Target size={12} />Roots</button>
          <button onClick={() => setShowExtrema(!showExtrema)} className={`flex items-center gap-1.5 glass px-2 py-1 rounded text-xs transition-colors ${showExtrema ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "text-muted-foreground hover:bg-card/90"}`}><TrendingDown size={12} />Extrema</button>
          <button onClick={() => setShowIntersections(!showIntersections)} className={`flex items-center gap-1.5 glass px-2 py-1 rounded text-xs transition-colors ${showIntersections ? "bg-green-500/20 text-green-400 border-green-500/30" : "text-muted-foreground hover:bg-card/90"}`}><Move size={12} />Cross</button>
          <button onClick={() => setShowMouseTracking(!showMouseTracking)} className={`flex items-center gap-1.5 glass px-2 py-1 rounded text-xs transition-colors ${showMouseTracking ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "text-muted-foreground hover:bg-card/90"}`}><Target size={12} />Track</button>
        </div>
      </div>
      <div ref={containerRef} className="relative flex-grow p-1">
        <canvas ref={canvasRef} className="w-full h-full rounded-lg cursor-grab" />
        <div className="absolute bottom-2 right-3 text-xs text-muted-foreground flex items-center gap-1 pointer-events-none">
          <Move size={12} />
          <span className="hidden sm:inline">Pan & Scroll to Zoom</span>
        </div>
        <AnimatePresence>
          {hoveredPoint && hoveredTooltipPosition && (
            <motion.div
              key="hover-tooltip"
              className="absolute z-10 glass-strong rounded-lg px-2 py-1 text-xs text-foreground pointer-events-none shadow-xl"
              style={{
                left: hoveredTooltipPosition.left,
                bottom: hoveredTooltipPosition.bottom,
                transform: "translateX(-50%)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              {hoveredPoint.info}
            </motion.div>
          )}
          {trackingPoint && showMouseTracking && trackingTooltipPosition && (
            <motion.div
              key="track-tooltip"
              className="absolute z-10 bg-amber-800/95 backdrop-blur-lg border border-amber-700/50 rounded-lg px-2 py-1 text-xs text-amber-100 pointer-events-none shadow-xl"
              style={{
                left: trackingTooltipPosition.left,
                bottom: trackingTooltipPosition.bottom,
                transform: "translateX(-50%)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              ({(Math.abs(trackingPoint.x) < 1e-6 ? 0 : trackingPoint.x.toFixed(3))}, {(Math.abs(trackingPoint.y) < 1e-6 ? 0 : trackingPoint.y.toFixed(3))})
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}