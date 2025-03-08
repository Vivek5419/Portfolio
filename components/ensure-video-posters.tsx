"use client"

import { useEffect } from "react"
import VideoPosterGenerator from "./video-poster-generator"

interface EnsureVideoPostersProps {
  videoSources: string[]
}

export default function EnsureVideoPosters({ videoSources }: EnsureVideoPostersProps) {
  useEffect(() => {
    // Find all video elements on the page
    const videoElements = document.querySelectorAll("video")

    // For each video element
    videoElements.forEach((video) => {
      // If it has a source but no poster
      if (video.src && !video.poster) {
        // Try to get a cached poster
        const cachedPoster = localStorage.getItem(`video-poster-${video.src}`)
        if (cachedPoster) {
          video.poster = cachedPoster
        }
      }
    })
  }, [])

  return (
    <>
      {videoSources.map((src, index) => (
        <VideoPosterGenerator
          key={index}
          videoSrc={src}
          onPosterGenerated={(posterUrl) => {
            // Find video elements with this source
            const videoElements = document.querySelectorAll(`video[src="${src}"]`)
            videoElements.forEach((video) => {
              if (!video.poster) {
                video.poster = posterUrl
              }
            })
          }}
        />
      ))}
    </>
  )
}

