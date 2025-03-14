"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface VideoTimelineProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  className?: string
  markers?: Array<{ time: number; label: string }>
}

export default function VideoTimeline({ currentTime, duration, onSeek, className, markers = [] }: VideoTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoverPosition, setHoverPosition] = useState<number | null>(null)

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Get position from mouse/touch event with bounds checking
  const getPositionFromEvent = (clientX: number) => {
    if (!timelineRef.current) return 0

    const rect = timelineRef.current.getBoundingClientRect()
    const position = (clientX - rect.left) / rect.width
    return Math.max(0, Math.min(position, 1))
  }

  // Handle mouse/touch down
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)

    // Get clientX from either mouse or touch event
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const position = getPositionFromEvent(clientX)

    // Update time based on position
    onSeek(position * duration)
  }

  // Handle mouse/touch move
  const handlePointerMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return

    // Get clientX from either mouse or touch event
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const position = getPositionFromEvent(clientX)

    // Update time based on position
    onSeek(position * duration)

    // Prevent default to avoid text selection and page scrolling
    e.preventDefault()
  }

  // Handle mouse/touch up
  const handlePointerUp = () => {
    setIsDragging(false)
  }

  // Handle hover
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) return
    const position = getPositionFromEvent(e.clientX)
    setHoverPosition(position)
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (!isDragging) {
      setHoverPosition(null)
    }
  }

  // Add/remove document-level event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handlePointerMove)
      document.addEventListener("touchmove", handlePointerMove, { passive: false })
      document.addEventListener("mouseup", handlePointerUp)
      document.addEventListener("touchend", handlePointerUp)
    }

    return () => {
      document.removeEventListener("mousemove", handlePointerMove)
      document.removeEventListener("touchmove", handlePointerMove)
      document.removeEventListener("mouseup", handlePointerUp)
      document.removeEventListener("touchend", handlePointerUp)
    }
  }, [isDragging, duration])

  return (
    <div className={cn("relative select-none", className)}>
      {/* Time display */}
      <div className="absolute -top-6 left-0 text-sm text-white/90 font-medium tracking-wider">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Timeline container */}
      <div
        ref={timelineRef}
        className={cn("relative h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer", isDragging && "h-3")}
        style={{ touchAction: "none" }}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Blurred background progress bar */}
        <div
          ref={progressRef}
          className="absolute inset-0 backdrop-blur-sm bg-white/20 rounded-full origin-left z-10"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Colored progress bar */}
        <div
          className="absolute inset-0 bg-red-500/70 rounded-full origin-left z-20"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Scrubber handle */}
        <div
          ref={handleRef}
          className="absolute top-1/2 h-4 w-4 bg-red-500 rounded-full -translate-y-1/2 z-30"
          style={{
            left: `${progressPercentage}%`,
            transform: `translateX(-50%) translateY(-50%)`,
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.3)",
          }}
        />

        {/* Hover position indicator */}
        {hoverPosition !== null && !isDragging && (
          <>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-40"
              style={{ left: `${hoverPosition * 100}%` }}
            />
            <div
              className="absolute -top-8 px-2 py-1 bg-black/90 text-white text-xs rounded pointer-events-none z-50"
              style={{
                left: `${hoverPosition * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              {formatTime(hoverPosition * duration)}
            </div>
          </>
        )}

        {/* Markers */}
        {markers.map((marker, index) => {
          const markerPosition = (marker.time / duration) * 100
          return (
            <div
              key={index}
              className="absolute top-0 bottom-0 w-0.5 bg-yellow-500 z-15"
              style={{ left: `${markerPosition}%` }}
              title={marker.label}
            />
          )
        })}
      </div>
    </div>
  )
}

