"use client"

import { useEffect } from "react"

export default function StaticVideoThumbnails() {
  useEffect(() => {
    // Force all videos to load their poster images
    const videos = document.querySelectorAll("video")
    videos.forEach((video) => {
      // Make sure the poster attribute is set
      if (!video.poster || video.poster === "") {
        // Set a default poster if none is specified
        video.poster = "/placeholder.svg?height=720&width=405&text=Video"
      }

      // Force the poster to be displayed
      video.preload = "none"
      video.load()
    })
  }, [])

  return null
}
