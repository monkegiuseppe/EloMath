"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, Calculator } from "lucide-react"

export default function Notepad({ onClose }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [content, setContent] = useState("")
  const notepadRef = useRef(null)

  useEffect(() => {
    const node = notepadRef.current
    if (!node) return

    // Center the notepad initially
    if (position.x === 0 && position.y === 0) {
      const { innerWidth, innerHeight } = window
      const { offsetWidth, offsetHeight } = node
      setPosition({
        x: (innerWidth - offsetWidth) / 2,
        y: (innerHeight - offsetHeight) / 3,
      })
    }

    // Drag handler
    const handleMouseDown = (e) => {
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

    const header = node.querySelector("#notepad-header")
    header.addEventListener("mousedown", handleMouseDown)

    return () => {
      header.removeEventListener("mousedown", handleMouseDown)
    }
  }, [position])

  return (
    <motion.div
      ref={notepadRef}
      className="fixed glass-strong rounded-xl shadow-2xl z-50 flex flex-col"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "400px",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* Header */}
      <div
        id="notepad-header"
        className="flex items-center justify-between p-3 bg-muted/50 rounded-t-xl cursor-move select-none
                   hover:bg-muted/70 transition-colors group"
        title="Drag to move"
      >
        <div className="flex items-center gap-2 text-foreground font-medium">
          <Calculator size={16} className="group-hover:text-primary transition-colors" />
          <span>Scratchpad</span>
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

      {/* Content Area */}
      <div className="p-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[300px] bg-background/90 border border-border rounded-lg p-4 text-foreground 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     transition-colors resize-none font-mono text-sm placeholder-muted-foreground"
          placeholder="Type your notes here...

Use this space for calculations, sketches, or any working notes while solving problems."
        />
      </div>

      {/* Footer hint */}
      <div className="px-4 pb-3">
        <div className="text-xs text-muted-foreground">
          <span>Drag the header to move • Click outside to keep open</span>
        </div>
      </div>
    </motion.div>
  )
}
