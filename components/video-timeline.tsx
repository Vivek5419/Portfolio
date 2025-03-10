"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface OverlayTrack {
  startTime: number
  endTime: number
  type: "pip" | "overlay" | "text"
  label?: string
}

interface VideoTimelineProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  className?: string
  overlayTracks?: OverlayTrack[]
}

export default function VideoTimeline({
  currentTime,
  duration,
  onSeek,
  className,
  overlayTracks = [],
}: VideoTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverPosition, setHoverPosition] = useState<number | null>(null)
  const [activeOverlay, setActiveOverlay] = useState<OverlayTrack | null>(null)

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

    // Check if hovering over an overlay track
    const hoverTime = getTimeForPosition(position)
    const hoveredOverlay = overlayTracks.find((track) => hoverTime >= track.startTime && hoverTime <= track.endTime)

    setActiveOverlay(hoveredOverlay || null)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setHoverPosition(null)
    setIsHovering(false)
    setActiveOverlay(null)
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

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={cn("relative select-none", className)}>
      {/* Time display */}
      <motion.div
        className="absolute -top-6 left-0 text-sm text-white/90 font-medium tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </motion.div>

      {/* Timeline container */}
      <motion.div
        ref={timelineRef}
        className="group relative bg-white/20 rounded-full overflow-hidden cursor-pointer touch-none"
        initial={{ height: 2 }}
        animate={{
          height: isDragging || isHovering ? 4 : 2,
          transition: { duration: 0.2, ease: "easeInOut" },
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress bar */}
        <motion.div
          className="absolute inset-0 bg-red-600 rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: progress / 100,
            backgroundColor: isHovering || isDragging ? "#f87171" : "#ef4444",
          }}
          transition={{
            scaleX: { duration: 0.05, ease: "linear" },
            backgroundColor: { duration: 0.2 },
          }}
        />

        {/* Hover preview */}
        <AnimatePresence>
          {hoverPosition !== null && (
            <motion.div
              className="absolute top-0 left-0 h-full w-0.5 bg-white/50"
              style={{ left: `${hoverPosition * 100}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>

        {/* Scrubber handle */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 bg-red-600 rounded-full"
          style={{ left: `${progress}%` }}
          initial={{ width: 8, height: 8, x: -4 }}
          animate={{
            width: isHovering || isDragging ? 12 : 8,
            height: isHovering || isDragging ? 12 : 8,
            x: isHovering || isDragging ? -6 : -4,
            backgroundColor: isHovering || isDragging ? "#f87171" : "#ef4444",
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Preview time tooltip */}
      <AnimatePresence>
        {hoverPosition !== null && (
          <motion.div
            className="absolute px-2 py-1 bg-black/90 rounded text-xs text-white transform -translate-x-1/2 pointer-events-none"
            style={{
              left: `${hoverPosition * 100}%`,
              top: isDragging ? -28 : -24,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            {activeOverlay ? (
              <span className="font-medium">{activeOverlay.label || activeOverlay.type}</span>
            ) : (
              formatTime(getTimeForPosition(hoverPosition))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

