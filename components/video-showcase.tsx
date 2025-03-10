"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import VideoTimeline from "./video-timeline"

// Video controls component with timeline
const VideoControls = ({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  onPlayPause,
  onMuteToggle,
  onSeek,
  overlayTracks,
}: {
  isPlaying: boolean
  isMuted: boolean
  currentTime: number
  duration: number
  onPlayPause: (e: React.MouseEvent) => void
  onMuteToggle: (e: React.MouseEvent) => void
  onSeek: (time: number) => void
  overlayTracks?: { startTime: number; endTime: number; type: "pip" | "overlay" | "text"; label?: string }[]
}) => (
  <motion.div
    className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <VideoTimeline
      currentTime={currentTime}
      duration={duration}
      onSeek={onSeek}
      className="mb-2"
      overlayTracks={overlayTracks}
    />
    <div className="flex items-center justify-between">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button variant="ghost" size="icon" onClick={onPlayPause} className="text-white hover:bg-white/20">
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button variant="ghost" size="icon" onClick={onMuteToggle} className="text-white hover:bg-white/20">
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </Button>
      </motion.div>
    </div>
  </motion.div>
)

export default function VideoShowcase() {
  // Track state for each video separately
  const [mainVideoState, setMainVideoState] = useState({
    isPlaying: false,
    isMuted: false,
    currentTime: 0,
    duration: 0,
  })

  // Separate state for thumbnail videos
  const [thumbnailStates, setThumbnailStates] = useState([
    { isPlaying: false, isMuted: false, currentTime: 0, duration: 0 },
    { isPlaying: false, isMuted: false, currentTime: 0, duration: 0 },
    { isPlaying: false, isMuted: false, currentTime: 0, duration: 0 },
  ])

  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const thumbnailRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null])

  // Timer ref for updating progress
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Define your videos here with explicit poster images
  const videos = [
    {
      id: 0,
      title: "Main Showcase",
      src: "/videos/main-showcase.mp4",
      poster: "/placeholder.svg?height=720&width=405&text=Main+Video",
    },
    {
      id: 1,
      title: "Short Sample 1",
      src: "/videos/short-sample-1.mp4",
      poster: "/placeholder.svg?height=720&width=405&text=Short+1",
    },
    {
      id: 2,
      title: "Short Sample 2",
      src: "/videos/short-sample-2.mp4",
      poster: "/placeholder.svg?height=720&width=405&text=Short+2",
    },
    {
      id: 3,
      title: "Short Sample 3",
      src: "/videos/short-sample-3.mp4",
      poster: "/placeholder.svg?height=720&width=405&text=Short+3",
    },
  ]

  // Sample overlay tracks for each video
  const videoOverlayTracks = [
    // Main video overlays
    [
      { startTime: 5, endTime: 15, type: "pip" as const, label: "Reaction PiP" },
      { startTime: 20, endTime: 35, type: "overlay" as const, label: "Effect" },
      { startTime: 10, endTime: 40, type: "text" as const, label: "Subtitles" },
    ],
    // Thumbnail 1 overlays
    [
      { startTime: 2, endTime: 8, type: "pip" as const },
      { startTime: 12, endTime: 18, type: "text" as const },
    ],
    // Thumbnail 2 overlays
    [
      { startTime: 3, endTime: 10, type: "overlay" as const },
      { startTime: 5, endTime: 15, type: "text" as const },
    ],
    // Thumbnail 3 overlays
    [
      { startTime: 1, endTime: 7, type: "pip" as const },
      { startTime: 9, endTime: 14, type: "overlay" as const },
    ],
  ]

  // Function to update video progress
  const updateVideoProgress = () => {
    // Update main video progress
    if (mainVideoRef.current) {
      setMainVideoState((prev) => ({
        ...prev,
        currentTime: mainVideoRef.current!.currentTime,
        duration: mainVideoRef.current!.duration || 0,
      }))
    }

    // Update thumbnail videos progress
    thumbnailRefs.current.forEach((videoRef, index) => {
      if (videoRef) {
        setThumbnailStates((prev) => {
          const newStates = [...prev]
          newStates[index] = {
            ...newStates[index],
            currentTime: videoRef.currentTime,
            duration: videoRef.duration || 0,
          }
          return newStates
        })
      }
    })

    // Schedule next update
    progressTimerRef.current = setTimeout(updateVideoProgress, 250)
  }

  // Start progress updates
  useEffect(() => {
    progressTimerRef.current = setTimeout(updateVideoProgress, 250)

    return () => {
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current)
      }
    }
  }, [])

  // Load video metadata on component mount
  useEffect(() => {
    // Set initial muted state for main video
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = mainVideoState.isMuted
      // Force poster to be visible
      mainVideoRef.current.load()
    }

    // Set initial muted state for thumbnail videos
    thumbnailRefs.current.forEach((videoRef, index) => {
      if (videoRef) {
        videoRef.muted = thumbnailStates[index].isMuted
        // Force poster to be visible
        videoRef.load()
      }
    })
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

  // Function to pause all videos
  const pauseAllVideos = () => {
    // Pause main video
    if (mainVideoRef.current && !mainVideoRef.current.paused) {
      mainVideoRef.current.pause()
      setMainVideoState((prev) => ({ ...prev, isPlaying: false }))
    }

    // Pause all thumbnail videos
    thumbnailRefs.current.forEach((videoRef, index) => {
      if (videoRef && !videoRef.paused) {
        videoRef.pause()
        setThumbnailStates((prev) => {
          const newStates = [...prev]
          newStates[index] = { ...newStates[index], isPlaying: false }
          return newStates
        })
      }
    })
  }

  // Main video controls
  const toggleMainPlay = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling

    if (!mainVideoRef.current) return

    if (mainVideoRef.current.paused) {
      // Pause all other videos first
      pauseAllVideos()

      // Then play this video
      mainVideoRef.current
        .play()
        .then(() => {
          setMainVideoState((prev) => ({ ...prev, isPlaying: true }))
        })
        .catch((err) => {
          console.error("Error playing main video:", err)
        })
    } else {
      mainVideoRef.current.pause()
      setMainVideoState((prev) => ({ ...prev, isPlaying: false }))
    }
  }

  const toggleMainMute = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling

    if (!mainVideoRef.current) return

    mainVideoRef.current.muted = !mainVideoRef.current.muted
    setMainVideoState((prev) => ({ ...prev, isMuted: mainVideoRef.current!.muted }))
  }

  // Thumbnail video controls
  const toggleThumbnailPlay = (index: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling

    const videoRef = thumbnailRefs.current[index]
    if (!videoRef) return

    if (videoRef.paused) {
      // Pause all other videos first
      pauseAllVideos()

      // Then play this video
      videoRef
        .play()
        .then(() => {
          setThumbnailStates((prev) => {
            const newStates = [...prev]
            newStates[index] = { ...newStates[index], isPlaying: true }
            return newStates
          })
        })
        .catch((err) => {
          console.error(`Error playing thumbnail video ${index}:`, err)
        })
    } else {
      videoRef.pause()
      setThumbnailStates((prev) => {
        const newStates = [...prev]
        newStates[index] = { ...newStates[index], isPlaying: false }
        return newStates
      })
    }
  }

  const toggleThumbnailMute = (index: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling

    const videoRef = thumbnailRefs.current[index]
    if (!videoRef) return

    videoRef.muted = !videoRef.muted
    setThumbnailStates((prev) => {
      const newStates = [...prev]
      newStates[index] = { ...newStates[index], isMuted: videoRef.muted }
      return newStates
    })
  }

  // Change the main video
  const changeMainVideo = (index: number) => {
    // Pause all videos first
    pauseAllVideos()

    // Update the source of the main video
    if (mainVideoRef.current) {
      // Set the new video source
      setActiveVideoIndex(index + 1) // +1 because thumbnails start at index 1
    }
  }

  // Video timeline component
  // const VideoTimeline = ({
  //   currentTime,
  //   duration,
  //   className = "",
  // }: { currentTime: number; duration: number; className?: string }) => {
  //   const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  //   return (
  //     <div className={`w-full h-1 bg-gray-700 rounded-full overflow-hidden ${className}`}>
  //       <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
  //     </div>
  //   )
  // }

  return (
    <section id="showcase" ref={sectionRef} className="py-20 overflow-hidden">
      <motion.div className="container px-4 md:px-6" style={{ opacity, y }}>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Featured <span className="text-gray-400">Work</span>
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            style={{ isolation: "isolate" }}
          >
            <div className="apple-blur-heavy rounded-3xl border border-zinc-800/30 overflow-hidden apple-glow">
              <div className="p-0 relative">
                <div className="aspect-[9/16] w-full max-w-[405px] mx-auto">
                  <video
                    ref={mainVideoRef}
                    className="w-full h-full object-cover"
                    poster={videos[activeVideoIndex].poster}
                    muted={mainVideoState.isMuted}
                    playsInline
                    preload="auto"
                    onPlay={() => {
                      // Pause all other videos when this one plays
                      thumbnailRefs.current.forEach((videoRef, index) => {
                        if (videoRef && !videoRef.paused) {
                          videoRef.pause()
                          setThumbnailStates((prev) => {
                            const newStates = [...prev]
                            newStates[index] = { ...newStates[index], isPlaying: false }
                            return newStates
                          })
                        }
                      })

                      setMainVideoState((prev) => ({ ...prev, isPlaying: true }))
                    }}
                    onPause={() => setMainVideoState((prev) => ({ ...prev, isPlaying: false }))}
                    onTimeUpdate={() => {
                      if (mainVideoRef.current) {
                        setMainVideoState((prev) => ({
                          ...prev,
                          currentTime: mainVideoRef.current!.currentTime,
                          duration: mainVideoRef.current!.duration || 0,
                        }))
                      }
                    }}
                    onLoadedMetadata={() => {
                      if (mainVideoRef.current) {
                        setMainVideoState((prev) => ({
                          ...prev,
                          duration: mainVideoRef.current!.duration || 0,
                        }))
                      }
                    }}
                  >
                    <source src={videos[activeVideoIndex].src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Main video controls with timeline */}
                <VideoControls
                  isPlaying={mainVideoState.isPlaying}
                  isMuted={mainVideoState.isMuted}
                  currentTime={mainVideoState.currentTime}
                  duration={mainVideoState.duration}
                  onPlayPause={toggleMainPlay}
                  onMuteToggle={toggleMainMute}
                  overlayTracks={videoOverlayTracks[activeVideoIndex]}
                  onSeek={(time) => {
                    if (mainVideoRef.current) {
                      mainVideoRef.current.currentTime = time
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {videos.slice(1, 4).map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    delay: 0.1 * index,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                style={{ isolation: "isolate" }}
                className="cursor-pointer"
                onClick={() => changeMainVideo(index)}
              >
                <div className="apple-blur rounded-3xl border border-zinc-800/30 overflow-hidden apple-glow">
                  <div className="p-0">
                    <div className="relative aspect-[9/16] bg-zinc-800">
                      <video
                        ref={(el) => (thumbnailRefs.current[index] = el)}
                        className="w-full h-full object-cover"
                        src={video.src}
                        poster={video.poster}
                        muted={thumbnailStates[index].isMuted}
                        playsInline
                        preload="auto"
                        onPlay={() => {
                          // Pause main video when this one plays
                          if (mainVideoRef.current && !mainVideoRef.current.paused) {
                            mainVideoRef.current.pause()
                            setMainVideoState((prev) => ({ ...prev, isPlaying: false }))
                          }

                          // Pause other thumbnail videos
                          thumbnailRefs.current.forEach((videoRef, i) => {
                            if (i !== index && videoRef && !videoRef.paused) {
                              videoRef.pause()
                              setThumbnailStates((prev) => {
                                const newStates = [...prev]
                                newStates[i] = { ...newStates[i], isPlaying: false }
                                return newStates
                              })
                            }
                          })

                          setThumbnailStates((prev) => {
                            const newStates = [...prev]
                            newStates[index] = { ...newStates[index], isPlaying: true }
                            return newStates
                          })
                        }}
                        onPause={() => {
                          setThumbnailStates((prev) => {
                            const newStates = [...prev]
                            newStates[index] = { ...newStates[index], isPlaying: false }
                            return newStates
                          })
                        }}
                        onTimeUpdate={() => {
                          const videoRef = thumbnailRefs.current[index]
                          if (videoRef) {
                            setThumbnailStates((prev) => {
                              const newStates = [...prev]
                              newStates[index] = {
                                ...newStates[index],
                                currentTime: videoRef.currentTime,
                                duration: videoRef.duration || 0,
                              }
                              return newStates
                            })
                          }
                        }}
                        onLoadedMetadata={() => {
                          const videoRef = thumbnailRefs.current[index]
                          if (videoRef) {
                            setThumbnailStates((prev) => {
                              const newStates = [...prev]
                              newStates[index] = {
                                ...newStates[index],
                                duration: videoRef.duration || 0,
                              }
                              return newStates
                            })
                          }
                        }}
                      >
                        <source src={video.src} type="video/mp4" />
                      </video>

                      {/* Thumbnail video controls with timeline */}
                      <VideoControls
                        isPlaying={thumbnailStates[index].isPlaying}
                        isMuted={thumbnailStates[index].isMuted}
                        currentTime={thumbnailStates[index].currentTime}
                        duration={thumbnailStates[index].duration}
                        onPlayPause={(e) => toggleThumbnailPlay(index, e)}
                        onMuteToggle={(e) => toggleThumbnailMute(index, e)}
                        overlayTracks={videoOverlayTracks[index + 1]} // +1 because thumbnails start at index 1
                        onSeek={(time) => {
                          const videoRef = thumbnailRefs.current[index]
                          if (videoRef) {
                            videoRef.currentTime = time
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* New section stating videos are edited by me */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <div className="apple-blur-light rounded-3xl border border-zinc-800/30 overflow-hidden p-4 apple-glow">
              <p
