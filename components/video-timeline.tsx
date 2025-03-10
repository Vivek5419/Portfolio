"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

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
  const [showTooltip, setShowTooltip] = useState(false)

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

    // Show tooltip with a slight delay to prevent flickering
    if (!showTooltip) {
      setShowTooltip(true)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setHoverPosition(null)
    setIsHovering(false)
    setActiveOverlay(null)
    setShowTooltip(false)
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

  // Get overlay track color based on type
  const getOverlayColor = (type: OverlayTrack["type"]) => {
    switch (type) {
      case "pip":
        return "bg-blue-500"
      case "overlay":
        return "bg-purple-500"
      case "text":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get overlay track glow color based on type
  const getOverlayGlowColor = (type: OverlayTrack["type"]) => {
    switch (type) {
      case "pip":
        return "shadow-blue-500/50"
      case "overlay":
        return "shadow-purple-500/50"
      case "text":
        return "shadow-green-500/50"
      default:
        return "shadow-gray-500/50"
    }
  }

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

      {/* Overlay tracks section */}
      <div className="mb-1 h-4 relative">
        {overlayTracks.map((track, index) => {
          const startPercent = (track.startTime / duration) * 100
          const endPercent = (track.endTime / duration) * 100
          const width = endPercent - startPercent

          return (
            <motion.div
              key={index}
              className={cn(
                "absolute h-2 rounded-full opacity-70 hover:opacity-100 transition-all duration-300",
                getOverlayColor(track.type),
                activeOverlay === track && "opacity-100 ring-1 ring-white shadow-md",
                getOverlayGlowColor(track.type),
              )}
              style={{
                left: `${startPercent}%`,
                width: `${width}%`,
                top: track.type === "pip" ? "0" : track.type === "overlay" ? "4px" : "8px",
                height: "4px",
              }}
              title={track.label || `${track.type} (${formatTime(track.startTime)} - ${formatTime(track.endTime)})`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: activeOverlay === track ? 1.1 : 1,
                opacity: activeOverlay === track ? 1 : 0.7,
                height: activeOverlay === track ? "6px" : "4px",
              }}
              transition={{ duration: 0.2 }}
              whileHover={{
                scale: 1.1,
                height: "6px",
                boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
              }}
            />
          )
        })}

        {/* Current time indicator for overlay tracks */}
        <motion.div
          className="absolute w-0.5 bg-white h-full pointer-events-none"
          style={{ left: `${progress}%` }}
          initial={{ height: "100%" }}
          animate={{
            height: "100%",
            boxShadow: "0 0 4px rgba(255, 255, 255, 0.7)",
          }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Timeline container */}
      <div
        ref={timelineRef}
        className={cn(
          "group relative h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer touch-none transition-all duration-300",
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
      >
        {/* Progress bar background glow */}
        <div
          className="absolute inset-0 bg-red-600/20 rounded-full origin-left blur-sm"
          style={{ transform: `scaleX(${progress / 100})` }}
        />

        {/* Progress bar */}
        <motion.div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded-full origin-left",
            (isHovering || isDragging) && "from-red-500 to-red-400",
          )}
          style={{ transform: `scaleX(${progress / 100})` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
        />

        {/* Hover preview */}
        {hoverPosition !== null && (
          <motion.div
            className="absolute top-0 left-0 h-full w-0.5 bg-white/80"
            style={{ transform: `translateX(${hoverPosition * 100}%)` }}
            initial={{ opacity: 0, height: "100%" }}
            animate={{ opacity: 1, height: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}

        {/* Scrubber handle */}
        <motion.div
          className={cn(
            "absolute top-1/2 -ml-2 w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full -translate-y-1/2 shadow-md shadow-red-600/50",
            (isHovering || isDragging) && "from-red-400 to-red-500 shadow-red-500/70",
          )}
          style={{ left: `${progress}%` }}
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{
            scale: isHovering || isDragging ? 1.2 : 1,
            opacity: 1,
            boxShadow: isHovering || isDragging ? "0 0 10px rgba(239, 68, 68, 0.7)" : "0 0 5px rgba(239, 68, 68, 0.5)",
          }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Preview time tooltip */}
      <AnimatePresence>
        {showTooltip && hoverPosition !== null && (
          <motion.div
            className="absolute -top-10 px-2 py-1 bg-black/90 rounded text-xs text-white transform -translate-x-1/2 pointer-events-none border border-white/10 shadow-lg backdrop-blur-sm"
            style={{ left: `${hoverPosition * 100}%` }}
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

      {/* Legend for overlay tracks */}
      <motion.div
        className="mt-2 flex items-center justify-end gap-3 text-xs text-white/70"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 shadow-sm shadow-blue-500/50"></div>
          <span>PiP</span>
        </motion.div>
        <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-1 shadow-sm shadow-purple-500/50"></div>
          <span>Overlay</span>
        </motion.div>
        <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 shadow-sm shadow-green-500/50"></div>
          <span>Text</span>
        </motion.div>
      </motion.div>
    </div>
  )
}

