"use client"

import { useRef, useState, useEffect } from "react"
import { VideoTimeline } from "./video-timeline"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoPlayerProps {
  src: string
  poster?: string
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Example markers (you can customize these)
  const markers = [
    { time: 30, label: "Chapter 1" },
    { time: 60, label: "Chapter 2" },
  ]

  // Toggle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(videoRef.current.muted)
  }

  // Handle seeking
  const handleSeek = (time: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = time
  }

  // Update time display
  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(video.duration)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("durationchange", handleDurationChange)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("durationchange", handleDurationChange)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [])

  return (
    <div className="relative group">
      {/* Video */}
      <video ref={videoRef} className="w-full rounded-lg" poster={poster} playsInline>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Controls overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Timeline */}
          <VideoTimeline
            currentTime={currentTime}
            duration={duration}
            markers={markers}
            onSeek={handleSeek}
            className="mb-4"
          />

          {/* Control buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

