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

  // Use spring animation for smoother progress updates
  const springProgress = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Update spring value when currentTime changes
  useEffect(() => {
    if (duration > 0) {
      springProgress.set((currentTime / duration) * 100)
    }
  }, [currentTime, duration, springProgress])

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Calculate time for hover preview
  const getTimeForPosition = (position: number) => {
    return Math.max(0, Math.min(position * duration, duration))
  }

  // Handle mouse/touch events
  const handleInteraction = (clientX: number) => {
    if (!timelineRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const position = (clientX - rect.left) / rect.width
    const newTime = getTimeForPosition(position)
    onSeek(newTime)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleInteraction(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = timelineRef.current?.getBoundingClientRect()
    if (!rect) return

    const position = (e.clientX - rect.left) / rect.width
    setHoverPosition(position)

    if (isDragging) {
      handleInteraction(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setHoverPosition(null)
    setIsHovering(false)
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault() // Prevent scrolling while touching the timeline
    setIsDragging(true)
    handleInteraction(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault() // Prevent scrolling while dragging
      handleInteraction(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Add/remove document-level event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    const handleGlobalTouchEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mouseup", handleGlobalMouseUp)
      document.addEventListener("touchend", handleGlobalTouchEnd)
    }

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp)
      document.removeEventListener("touchend", handleGlobalTouchEnd)
    }
  }, [isDragging])

  return (
    <div className={cn("relative select-none", className)}>
      {/* Time display */}
      <div className="absolute -top-6 left-0 text-sm text-white/90 font-medium tracking-wider">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Timeline container */}
      <motion.div
        ref={timelineRef}
        className={cn(
          "group relative h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer touch-none",
          isDragging && "h-2.5",
          isHovering && "h-2.5",
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        whileHover={{ height: 10 }}
        animate={{ height: isDragging ? 10 : 6 }}
        transition={{ duration: 0.2 }}
      >
        {/* Progress bar with spring animation */}
        <motion.div
          className={cn(
            "absolute inset-0 bg-red-600 rounded-full origin-left",
            (isHovering || isDragging) && "bg-red-500",
          )}
          style={{ width: springProgress }}
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

              
