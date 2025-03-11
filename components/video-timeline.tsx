"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
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

  return (
    <div className={cn("relative select-none", className)}>
      {/* Time display */}
      <div className="absolute -top-6 left-0 text-sm text-white/90 font-medium tracking-wider">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Overlay tracks section */}
      <div className="mb-1 h-3 relative">
        {overlayTracks.map((track, index) => {
          const startPercent = (track.startTime / duration) * 100
          const endPercent = (track.endTime / duration) * 100
          const width = endPercent - startPercent

          return (
            <div
              key={index}
              className={cn(
                "absolute h-2 rounded-sm opacity-70 hover:opacity-100 transition-opacity",
                getOverlayColor(track.type),
                activeOverlay === track && "opacity-100 ring-1 ring-white",
              )}
              style={{
                left: `${startPercent}%`,
                width: `${width}%`,
                top: track.type === "pip" ? "0" : track.type === "overlay" ? "4px" : "8px",
                height: "4px",
              }}
              title={track.label || `${track.type} (${formatTime(track.startTime)} - ${formatTime(track.endTime)})`}
            />
          )
        })}

        {/* Current time indicator for overlay tracks */}
        <div className="absolute w-0.5 bg-white h-full pointer-events-none" style={{ left: `${progress}%` }} />
      </div>

      {/* Timeline container */}
      <div
        ref={timelineRef}
        className={cn(
          "group relative h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer touch-none",
          isDragging && "h-2",
          isHovering && "h-2",
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress bar */}
        <div
          className={cn(
            "absolute inset-0 bg-red-600 rounded-full origin-left",
            (isHovering || isDragging) && "bg-red-500",
          )}
          style={{ transform: `scaleX(${progress / 100})` }}
        />

        {/* Hover preview */}
        {hoverPosition !== null && (
          <div
            className="absolute top-0 left-0 h-full w-0.5 bg-white/50"
            style={{ transform: `translateX(${hoverPosition * 100}%)` }}
          />
        )}

        {/* Scrubber handle */}
        <div
          className={cn(
            "absolute top-1/2 w-3 h-3 bg-red-600 rounded-full -translate-y-1/2",
            (isHovering || isDragging) && "scale-150 bg-red-500",
          )}
          style={{ left: `${progress}%` }}
        />
      </div>

      {/* Preview time tooltip */}
      {hoverPosition !== null && (
        <div
          className="absolute -top-10 px-2 py-1 bg-black/90 rounded text-xs text-white transform -translate-x-1/2 pointer-events-none"
          style={{ left: `${hoverPosition * 100}%` }}
        >
          {activeOverlay ? (
            <span className="font-medium">{activeOverlay.label || activeOverlay.type}</span>
          ) : (
            formatTime(getTimeForPosition(hoverPosition))
          )}
        </div>
      )}
    </div>
  )
}

