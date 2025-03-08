"use client"

import { useEffect, useRef } from "react"

interface VideoPosterGeneratorProps {
  videoSrc: string
  onPosterGenerated?: (posterUrl: string) => void
}

export default function VideoPosterGenerator({ videoSrc, onPosterGenerated }: VideoPosterGeneratorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    // Check if we already have a cached poster
    const cachedPoster = localStorage.getItem(`video-poster-${videoSrc}`)
    if (cachedPoster && onPosterGenerated) {
      onPosterGenerated(cachedPoster)
      return
    }

    // Try to load the video
    video.src = videoSrc
    video.preload = "metadata"
    video.muted = true

    // When metadata is loaded, seek to the first frame
    video.onloadedmetadata = () => {
      // Seek to the first frame
      video.currentTime = 0
    }

    // When seeking is complete, capture the frame
    video.onseeked = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the video frame to the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to data URL
      try {
        const posterUrl = canvas.toDataURL("image/jpeg", 0.8)

        // Call the callback with the poster URL
        if (onPosterGenerated) {
          onPosterGenerated(posterUrl)
        }

        // Store in localStorage for future use
        localStorage.setItem(`video-poster-${videoSrc}`, posterUrl)
      } catch (e) {
        console.error("Error generating poster:", e)
      }
    }

    return () => {
      // Clean up
      video.onloadedmetadata = null
      video.onseeked = null
    }
  }, [videoSrc, onPosterGenerated])

  return (
    <div style={{ display: "none" }}>
      <video ref={videoRef} muted playsInline crossOrigin="anonymous" />
      <canvas ref={canvasRef} />
    </div>
  )
}

