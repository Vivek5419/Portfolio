"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"

interface VideoWithFallbackProps {
  src: string
  poster: string
  className?: string
  muted?: boolean
  autoPlay?: boolean
  loop?: boolean
  controls?: boolean
  onPlay?: () => void
  onPause?: () => void
}

export default function VideoWithFallback({
  src,
  poster,
  className = "",
  muted = true,
  autoPlay = false,
  loop = false,
  controls = false,
  onPlay,
  onPause,
}: VideoWithFallbackProps) {
  const [error, setError] = useState(false)

  const handleError = () => {
    console.error(`Error loading video: ${src}`)
    setError(true)
  }

  const handlePlay = () => {
    if (onPlay) onPlay()
  }

  const handlePause = () => {
    if (onPause) onPause()
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900 ${className}`}>
        <div className="text-center p-4">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
          <p className="text-sm text-gray-400">Video could not be loaded</p>
        </div>
      </div>
    )
  }

  return (
    <video
      className={className}
      poster={poster}
      muted={muted}
      autoPlay={autoPlay}
      loop={loop}
      controls={controls}
      playsInline
      onError={handleError}
      onPlay={handlePlay}
      onPause={handlePause}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}

