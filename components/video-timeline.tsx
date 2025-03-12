"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useSpring } from "framer-motion"

interface VideoTimelineProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  className?: string
}

export default function VideoTimeline({ currentTime, duration, onSeek, className }: VideoTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverPosition, setHoverPosition] = useState<number | null>(null)
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [lastValidPosition, setLastValidPosition] = useState<number>(0)

  // Use spring animation for smoother progress updates
  const springProgress = useSpring(0, {
    stiffness: 170,
    damping: 26,
    restDelta: 0.001,
    mass: 0.6,
  })

  // Update spring value when currentTime changes
  useEffect(() => {
    if (duration > 0 && !isDragging) {
      const progress = (currentTime / duration) * 100
      springProgress.set(progress)
      setLastValidPosition(progress)
    }
  }, [currentTime, duration, springProgress, isDragging])

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Calculate time for position with constraints
  const getTimeForPosition = (position: number) => {
    const constrainedPosition = Math.max(0, Math.min(position, 1))
    return constrainedPosition * duration
  }

  // Get precise cursor position
  const getCursorPosition = (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!timelineRef.current) return null

    const rect = timelineRef.current.getBoundingClientRect()
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX
    const position = (clientX - rect.left) / rect.width
    return Math.max(0, Math.min(position, 1))
  }

  // Handle interaction start
  const handleInteractionStart = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault()
    const position = getCursorPosition(event)
    if (position !== null) {
      setIsDragging(true)
      setDragStartX(position)
      onSeek(getTimeForPosition(position))
      setLastValidPosition(position * 100)
    }
  }

  // Handle interaction move
  const handleInteractionMove = (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (isDragging) {
      const position = getCursorPosition(event)
      if (position !== null) {
        onSeek(getTimeForPosition(position))
        springProgress.set(position * 100)
        setLastValidPosition(position * 100)
        setHoverPosition(position)
      }
    } else if ("clientX" in event) {
      const position = getCursorPosition(event)
      if (position !== null) {
        setHoverPosition(position)
      }
    }
  }

  // Handle interaction end
  const handleInteractionEnd = () => {
    setIsDragging(false)
    setDragStartX(null)
  }

  // Add/remove document-level event listeners
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        e.preventDefault()
        handleInteractionMove(e)
      }
    }

    const handleGlobalEnd = () => {
      handleInteractionEnd()
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMove)
      document.addEventListener("touchmove", handleGlobalMove, { passive: false })
      document.addEventListener("mouseup", handleGlobalEnd)
      document.addEventListener("touchend", handleGlobalEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMove)
      document.removeEventListener("touchmove", handleGlobalMove)
      document.removeEventListener("mouseup", handleGlobalEnd)
      document.removeEventListener("touchend", handleGlobalEnd)
    }
  }, [isDragging])

  return (
    <div className={cn("relative select-none touch-none", className)}>
      {/* Time display */}
      <div className="absolute -top-6 left-0 text-sm text-white/90 font-medium tracking-wider">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Timeline container */}
      <motion.div
        ref={timelineRef}
        className={cn(
          "group relative h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer",
          isDragging && "h-2.5",
          isHovering && "h-2.5",
        )}
        onMouseDown={(e) => handleInteractionStart(e)}
        onTouchStart={(e) => handleInteractionStart(e)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false)
          setHoverPosition(null)
        }}
        whileHover={{ height: 10 }}
        animate={{ height: isDragging ? 10 : 6 }}
        transition={{ duration: 0.2 }}
      >
        {/* Loaded progress bar (blurred background) */}
        <motion.div
          className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full"
          style={{ width: `${springProgress.get()}%` }}
        />

        {/* Progress bar (red overlay) */}
        <motion.div
          className={cn(
            "absolute inset-0 bg-red-600/70 rounded-full origin-left",
            (isHovering || isDragging) && "bg-red-500/80",
          )}
          style={{ width: `${springProgress.get()}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {/* Hover preview line */}
        <AnimatePresence>
          {hoverPosition !== null && (
            <motion.div
              className="absolute top-0 left-0 h-full w-0.5 bg-white/70"
              style={{ left: `${hoverPosition * 100}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Preview time tooltip */}
      <AnimatePresence>
        {hoverPosition !== null && (
          <motion.div
            className="absolute -top-10 px-2 py-1 bg-black/90 rounded text-xs text-white transform -translate-x-1/2 pointer-events-none"
            style={{ left: `${hoverPosition * 100}%` }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            {formatTime(getTimeForPosition(hoverPosition))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

                
