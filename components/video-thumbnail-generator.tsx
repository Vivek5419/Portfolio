"use client"

import { useEffect, useRef } from "react"

interface VideoThumbnailGeneratorProps {
  videoSrc: string
  thumbnailPath: string
  onThumbnailGenerated?: (thumbnailUrl: string) => void
}

export default function VideoThumbnailGenerator({
  videoSrc,
  thumbnailPath,
  onThumbnailGenerated,
}: VideoThumbnailGeneratorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    // Try to load the video
    video.src = videoSrc
    video.preload = "metadata"

    // When metadata is loaded, seek to the middle and capture a frame
    video.onloadedmetadata = () => {
      // Seek to 25% of the video
      video.currentTime = video.duration * 0.25
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
        const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8)

        // Call the callback with the thumbnail URL
        if (onThumbnailGenerated) {
          onThumbnailGenerated(thumbnailUrl)
        }

        // Store in localStorage for future use
        localStorage.setItem(`video-thumbnail-${videoSrc}`, thumbnailUrl)
      } catch (e) {
        console.error("Error generating thumbnail:", e)
      }
    }

    // Check if we already have a cached thumbnail
    const cachedThumbnail = localStorage.getItem(`video-thumbnail-${videoSrc}`)
    if (cachedThumbnail && onThumbnailGenerated) {
      onThumbnailGenerated(cachedThumbnail)
    }

    return () => {
      // Clean up
      video.onloadedmetadata = null
      video.onseeked = null
    }
  }, [videoSrc, thumbnailPath, onThumbnailGenerated])

  return (
    <div style={{ display: "none" }}>
      <video ref={videoRef} crossOrigin="anonymous" />
      <canvas ref={canvasRef} />
    </div>
  )
}

