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
  markers?: Array<{ time: number; label: string }>
}

export default function VideoTimeline({ currentTime, duration, onSeek, className, markers = [] }: VideoTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverPosition, setHoverPosition] = useState<number | null>(null)
  const [dragStartX, setDragStartX] = useState(0)
  const [initialProgress, setInitialProgress] = useState(0)

  // Use spring animation for smoother progress updates
  const springProgress = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Update spring value when currentTime changes
  useEffect(() => {
    if (duration > 0 && !isDragging) {
      springProgress.set((currentTime / duration) * 100)
    }
  }, [currentTime, duration, springProgress, isDragging])

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

  // Get position from mouse/touch event with bounds checking
  const getPositionFromEvent = (clientX: number) => {
    if (!timelineRef.current) return 0

    const rect = timelineRef.current.getBoundingClientRect()
    const position = Math.max(0, Math.min((clientX - rect.left) / rect.width, 1))
    return position
  }

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()

    // Store the initial position for more stable dragging
    setDragStartX(e.clientX)
    setInitialProgress(currentTime / duration)
    setIsDragging(true)

    // Update time based on position
    const position = getPositionFromEvent(e.clientX)
    onSeek(position * duration)
  }

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    const position = getPositionFromEvent(e.clientX)
    setHoverPosition(position)

    if (isDragging) {
      // Update time based on position
      onSeek(position * duration)
      // Update spring animation directly for smoother feedback
      springProgress.set(position * 100)
    }
  }

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()

    const touch = e.touches[0]
    setDragStartX(touch.clientX)
    setInitialProgress(currentTime / duration)
    setIsDragging(true)

    const position = getPositionFromEvent(touch.clientX)
    onSeek(position * duration)
  }

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    e.preventDefault()
    const touch = e.touches[0]
    const position = getPositionFromEvent(touch.clientX)

    // Update time based on position
    onSeek(position * duration)
    // Update spring animation directly for smoother feedback
    springProgress.set(position * 100)
  }

  // Handle mouse/touch up
  const handlePointerUp = () => {
    setIsDragging(false)
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    if (!isDragging) {
      setHoverPosition(null)
      setIsHovering(false)
    }
  }

  // Add/remove document-level event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const position = getPositionFromEvent(e.clientX)
      onSeek(position * duration)
      springProgress.set(position * 100)
    }

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDragging) return

      const touch = e.touches[0]
      const position = getPositionFromEvent(touch.clientX)
      onSeek(position * duration)
      springProgress.set(position * 100)
    }

    const handleGlobalPointerUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("touchmove", handleGlobalTouchMove, { passive: false })
      document.addEventListener("mouseup", handleGlobalPointerUp)
      document.addEventListener("touchend", handleGlobalPointerUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("touchmove", handleGlobalTouchMove)
      document.removeEventListener("mouseup", handleGlobalPointerUp)
      document.removeEventListener("touchend", handleGlobalPointerUp)
    }
  }, [isDragging, duration, onSeek, springProgress])

  return (
    <div className={cn("relative select-none", className)}>
      {/* Time display */}
      <motion.div
        className="absolute -top-6 left-0 text-sm text-white/90 font-medium tracking-wider"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: isHovering || isDragging ? 1 : 0.7 }}
        transition={{ duration: 0.2 }}
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </motion.div>

      {/* Timeline container */}
      <motion.div
        ref={timelineRef}
        className="relative h-2 bg-white/10 backdrop-blur-sm rounded-full overflow-hidden cursor-pointer touch-none"
        style={{ touchAction: "none" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handlePointerUp}
        animate={{
          height: isDragging ? 8 : isHovering ? 6 : 4,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Blurred progress bar background */}
        <motion.div
          className="absolute inset-0 backdrop-blur-md bg-white/10 rounded-full"
          style={{ width: `${springProgress.get()}%` }}
        />

        {/* Colored progress bar */}
        <motion.div
          className="absolute inset-0 bg-white/30 rounded-full"
          style={{ width: `${springProgress.get()}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {/* Hover preview line */}
        <AnimatePresence>
          {hoverPosition !== null && !isDragging && (
            <motion.div
              className="absolute top-0 h-full w-0.5 bg-white/70"
              style={{ left: `${hoverPosition * 100}%` }}
              initial={{ opacity: 0, height: "0%" }}
              animate={{ opacity: 1, height: "100%" }}
              exit={{ opacity: 0, height: "0%" }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>

        {/* Markers */}
        {markers.map((marker, index) => {
          const markerPosition = (marker.time / duration) * 100
          return (
            <motion.div
              key={index}
              className="absolute top-0 bottom-0 w-0.5 bg-yellow-500/70 z-10"
              style={{ left: `${markerPosition}%` }}
              whileHover={{
                scale: 1.5,
                backgroundColor: "rgba(234, 179, 8, 0.9)",
              }}
              title={marker.label}
            />
          )
        })}
      </motion.div>

      {/* Preview time tooltip */}
      <AnimatePresence>
        {hoverPosition !== null && (
          <motion.div
            className="absolute -top-10 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-xs text-white transform -translate-x-1/2 pointer-events-none"
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

