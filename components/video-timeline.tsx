"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface VideoTimelineProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  className?: string
}

export default function VideoTimeline({ currentTime, duration, onSeek, className }: VideoTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoverPosition, setHoverPosition] = useState<number | null>(null)

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Handle mouse/touch events
  const handleInteraction = (clientX: number) => {
    if (!timelineRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const position = (clientX - rect.left) / rect.width
    const newTime = Math.max(0, Math.min(position * duration, duration))
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
    if (isDragging) {
      setIsDragging(false)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    handleInteraction(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleInteraction(e.touches[0].clientX)
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

  const progress = (currentTime / duration) * 100

  return (
    <div className={cn("relative select-none", className)}>
      {/* Time display */}
      <div className="absolute -top-6 left-0 text-sm text-white/90 font-medium tracking-wider">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Timeline container */}
      <div
        ref={timelineRef}
        className="group relative h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Progress bar */}
        <div
          className="absolute inset-0 bg-red-600 rounded-full origin-left transition-transform duration-100 ease-out group-hover:bg-red-500"
          style={{ transform: `scaleX(${progress / 100})` }}
        />

        {/* Hover preview */}
        {hoverPosition !== null && (
          <div
            className="absolute top-0 left-0 h-full w-1 bg-white/50"
            style={{ transform: `translateX(${hoverPosition * 100}%)` }}
          />
        )}

        {/* Scrubber handle */}
        <div
          className={cn(
            "absolute top-1/2 w-3 h-3 -ml-1.5 bg-red-600 rounded-full -translate-y-1/2",
            "transition-transform duration-150",
            "group-hover:scale-150",
            isDragging && "scale-150",
          )}
          style={{ left: `${progress}%` }}
        />
      </div>
    </div>
  )
}
