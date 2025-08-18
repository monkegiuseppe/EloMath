"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, TrendingUp, Plus, Minus } from "lucide-react"

export default function GraphingTool({ onClose }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [equation, setEquation] = useState("x^2")
  const [zoom, setZoom] = useState(1)
  const canvasRef = useRef(null)
  const graphingRef = useRef(null)

  useEffect(() => {
    const node = graphingRef.current
    if (!node) return

    // Center the graphing tool initially
    if (position.x === 0 && position.y === 0) {
      const { innerWidth, innerHeight } = window
      const { offsetWidth, offsetHeight } = node
      setPosition({
        x: (innerWidth - offsetWidth) / 2 + 50,
        y: (innerHeight - offsetHeight) / 3 + 50,
      })
    }

    // Drag handler
    const handleMouseDown = (e) => {
      if (e.target.closest("input") || e.target.closest("button")) return
      e.preventDefault()

      const startPos = { x: e.clientX, y: e.clientY }
      const startNodePos = { ...position }

      const handleMouseMove = (moveE) => {
        const dx = moveE.clientX - startPos.x
        const dy = moveE.clientY - startPos.y

        let newX = startNodePos.x + dx
        let newY = startNodePos.y + dy

        const { innerWidth, innerHeight } = window
        const { offsetWidth, offsetHeight } = node

        newX = Math.max(0, Math.min(newX, innerWidth - offsetWidth))
        newY = Math.max(0, Math.min(newY, innerHeight - offsetHeight))

        setPosition({ x: newX, y: newY })
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    const header = node.querySelector("#graphing-header")
    header.addEventListener("mousedown", handleMouseDown)

    return () => {
      header.removeEventListener("mousedown", handleMouseDown)
    }
  }, [position])

  // Simple function plotter
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Set up coordinate system
    ctx.fillStyle = "hsl(var(--muted))"
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "hsl(var(--border))"
    ctx.lineWidth = 1

    const gridSize = 20 * zoom
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw axes
    ctx.strokeStyle = "hsl(var(--foreground))"
    ctx.lineWidth = 2

    // X-axis
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2, height)
    ctx.stroke()

    // Plot function
    try {
      ctx.strokeStyle = "hsl(var(--primary))"
      ctx.lineWidth = 3
      ctx.beginPath()

      let firstPoint = true
      for (let px = 0; px < width; px += 2) {
        const x = (px - width / 2) / (20 * zoom)
        let y

        // Simple expression evaluator
        const expr = equation.replace(/x/g, `(${x})`)
        try {
          y = eval(expr.replace(/\^/g, "**"))
        } catch {
          continue
        }

        if (isNaN(y) || !isFinite(y)) continue

        const py = height / 2 - y * 20 * zoom

        if (py < -100 || py > height + 100) continue

        if (firstPoint) {
          ctx.moveTo(px, py)
          firstPoint = false
        } else {
          ctx.lineTo(px, py)
        }
      }
      ctx.stroke()
    } catch (e) {
      // Invalid equation
    }
  }, [equation, zoom])

  return (
    <motion.div
      ref={graphingRef}
      className="fixed glass-strong rounded-xl shadow-2xl z-50 flex flex-col"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "450px",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* Header */}
      <div
        id="graphing-header"
        className="flex items-center justify-between p-3 bg-muted/50 rounded-t-xl cursor-move select-none
                   hover:bg-muted/70 transition-colors group"
        title="Drag to move"
      >
        <div className="flex items-center gap-2 text-foreground font-medium">
          <TrendingUp size={16} className="group-hover:text-primary transition-colors" />
          <span>Graphing Tool</span>
        </div>
        <motion.button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={16} />
        </motion.button>
      </div>

      {/* Controls */}
      <div className="p-3 border-b border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-medium text-foreground">f(x) =</label>
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            className="flex-1 bg-input border border-border rounded px-2 py-1 text-sm text-foreground
                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
            placeholder="x^2, sin(x), etc."
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Zoom:</span>
          <button
            onClick={() => setZoom(Math.max(0.1, zoom - 0.2))}
            className="p-1 rounded bg-muted hover:bg-muted/80 transition-colors"
          >
            <Minus size={12} />
          </button>
          <span className="text-sm font-mono w-12 text-center">{zoom.toFixed(1)}x</span>
          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.2))}
            className="p-1 rounded bg-muted hover:bg-muted/80 transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="p-1">
        <canvas
          ref={canvasRef}
          width={430}
          height={300}
          className="w-full h-[300px] rounded-lg border border-border/50"
        />
      </div>

      {/* Footer */}
      <div className="px-3 pb-3">
        <div className="text-xs text-muted-foreground">
          <span>Try: x^2, sin(x), cos(x), x^3-2*x, etc.</span>
        </div>
      </div>
    </motion.div>
  )
}
