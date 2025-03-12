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
}: {
  isPlaying: boolean
  isMuted: boolean
  currentTime: number
  duration: number
  onPlayPause: (e: React.MouseEvent) => void
  onMuteToggle: (e: React.MouseEvent) => void
  onSeek: (time: number) => void
}) => (
  <motion.div
    className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <VideoTimeline currentTime={currentTime} duration={duration} onSeek={onSeek} className="mb-2" />
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
      poster: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Useless-WAS3ERoM05tL633OiHEjDiWcOtps8I.png",
    },
    {
      id: 1,
      title: "Season 08 Episode 02",
      src: "/videos/short-sample-1.mp4",
      poster: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.jpg-DZbIjLB65U3yTFBAkCF4rxJM024FI2.jpeg",
    },
    {
      id: 2,
      title: "The Life-Changing Wallet",
      src: "/videos/short-sample-2.mp4",
      poster: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.jpg-EGLISlFMzFbL39oHQUaEu5SrIbmTUl.jpeg",
    },
    {
      id: 3,
      title: "The Mirror's Secret",
      src: "/videos/short-sample-3.mp4",
      poster: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3.jpg-hbXOoSmYUIfMHKoSkphGeyEY4it3KZ.jpeg",
    },
  ]

  // Improved smooth seeking function with better touch response
  const smoothSeek = (time: number, videoRef: HTMLVideoElement) => {
    // Set the time directly for more responsive seeking
    videoRef.currentTime = time

    // Update the state immediately to reflect the change
    if (videoRef === mainVideoRef.current) {
      setMainVideoState((prev) => ({
        ...prev,
        currentTime: time,
      }))
    } else {
      // Find which thumbnail video was updated
      thumbnailRefs.current.forEach((ref, index) => {
        if (ref === videoRef) {
          setThumbnailStates((prev) => {
            const newStates = [...prev]
            newStates[index] = {
              ...newStates[index],
              currentTime: time,
            }
            return newStates
          })
        }
      })
    }
  }

  // Replace the updateVideoProgress function with this optimized version:
  const updateVideoProgress = () => {
    // Use requestAnimationFrame for smoother updates
    const animationFrame = requestAnimationFrame(() => {
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
      progressTimerRef.current = window.setTimeout(updateVideoProgress, 33) // ~30fps for smooth updates
    })

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }

  // Start progress updates
  useEffect(() => {
    const cleanup = updateVideoProgress()

    return () => {
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current)
      }
      cleanup()
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
            whileHover={{ scale: 1.02 }}
            className="transition-all duration-300"
          >
            <div className="apple-blur-heavy rounded-3xl border border-zinc-800/30 overflow-hidden apple-glow">
              <div className="p-0 relative">
                <div className="aspect-[9/16] w-full max-w-[405px] mx-auto">
                  <motion.video
                    ref={mainVideoRef}
                    className="w-full h-full object-cover"
                    poster={videos[activeVideoIndex].poster}
                    muted={mainVideoState.isMuted}
                    playsInline
                    preload="auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
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
                  </motion.video>
                </div>

                {/* Main video controls with timeline */}
                <VideoControls
                  isPlaying={mainVideoState.isPlaying}
                  isMuted={mainVideoState.isMuted}
                  currentTime={mainVideoState.currentTime}
                  duration={mainVideoState.duration}
                  onPlayPause={toggleMainPlay}
                  onMuteToggle={toggleMainMute}
                  onSeek={(time) => {
                    if (mainVideoRef.current) {
                      smoothSeek(time, mainVideoRef.current)
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
                      <motion.video
                        ref={(el) => (thumbnailRefs.current[index] = el)}
                        className="w-full h-full object-cover"
                        src={video.src}
                        poster={video.poster}
                        muted={thumbnailStates[index].isMuted}
                        playsInline
                        preload="auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
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
                      </motion.video>

                      {/* Thumbnail video controls with timeline */}
                      <VideoControls
                        isPlaying={thumbnailStates[index].isPlaying}
                        isMuted={thumbnailStates[index].isMuted}
                        currentTime={thumbnailStates[index].currentTime}
                        duration={thumbnailStates[index].duration}
                        onPlayPause={(e) => toggleThumbnailPlay(index, e)}
                        onMuteToggle={(e) => toggleThumbnailMute(index, e)}
                        onSeek={(time) => {
                          const videoRef = thumbnailRefs.current[index]
                          if (videoRef) {
                            smoothSeek(time, videoRef)
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
            <div className="apple-blur-light rounded-3xl border border-zinc-800/30 overflow-hidden p-4 apple-glo
