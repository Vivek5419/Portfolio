"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface VideoTimelineProps {
  /**
   * Current time in seconds
   */
  currentTime: number
  /**
   * Total duration in seconds
   */
  duration: number
  /**
   * Array of markers/chapters to display on timeline
   */
  markers?: {
    time: number
    label: string
  }[]
  /**
   * Callback when timeline is scrubbed
   */
  onSeek?: (time: number) => void
  /**
   * Optional CSS class names
   */
  className?: string
}

export function VideoTimeline({ currentTime, duration, markers = [], onSeek, className }: VideoTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoverTime, setHoverTime] = useState<number | null>(null)

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progress = (currentTime / duration) * 100

  // Handle timeline click/touch
  const handleTimelineInteraction = (clientX: number) => {
    if (!timelineRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const position = (clientX - rect.left) / rect.width
    const newTime = Math.max(0, Math.min(position * duration, duration))

    if (onSeek) {
      onSeek(newTime)
    }
  }

  // Mouse/Touch event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleTimelineInteraction(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!timelineRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const position = (e.clientX - rect.left) / rect.width
    const hoverTimeValue = Math.max(0, Math.min(position * duration, duration))
    setHoverTime(hoverTimeValue)

    if (isDragging) {
      handleTimelineInteraction(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setHoverTime(null)
    if (isDragging) {
      setIsDragging(false)
    }
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    handleTimelineInteraction(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleTimelineInteraction(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Add/remove document-level event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging])

  return (
    <div className={cn("relative select-none", className)}>
      {/* Time display */}
      <div className="absolute -top-6 left-0 text-sm text-white/90 font-medium">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Hover time preview */}
      {hoverTime !== null && (
        <div
          className="absolute -top-6 text-sm text-white/90 font-medium pointer-events-none"
          style={{
            left: `${(hoverTime / duration) * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          {formatTime(hoverTime)}
        </div>
      )}

      {/* Timeline container */}
      <div
        ref={timelineRef}
        className="h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Progress bar */}
        <div
          className="h-full bg-red-600 transition-all duration-100 ease-out group-hover:bg-red-500"
          style={{ width: `${progress}%` }}
        />

        {/* Markers */}
        {markers.map((marker, index) => (
          <div
            key={index}
            className="absolute top-0 w-0.5 h-full bg-white/40"
            style={{
              left: `${(marker.time / duration) * 100}%`,
            }}
            title={marker.label}
          />
        ))}

        {/* Scrubber handle */}
        <div
          className={cn(
            "absolute top-1/2 w-3 h-3 bg-red-600 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform",
            "group-hover:scale-125",
            isDragging && "scale-125",
          )}
          style={{
            left: `${progress}%`,
          }}
        />
      </div>
    </div>
  )
}

