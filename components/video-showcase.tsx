"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import VideoTimeline from "./video-timeline"
import { useMediaQuery } from "@/hooks/use-media-query"
import { vibrateDevice } from "@/lib/vibration"

// Video controls component with timeline
const VideoControls = ({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  onPlayPause,
  onMuteToggle,
  onSeek,
  isBuffering,
  isMobile,
}: {
  isPlaying: boolean
  isMuted: boolean
  currentTime: number
  duration: number
  onPlayPause: (e: React.MouseEvent) => void
  onMuteToggle: (e: React.MouseEvent) => void
  onSeek: (time: number) => void
  isBuffering?: boolean
  isMobile?: boolean
}) => (
  <motion.div
    className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-black to-transparent"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <VideoTimeline currentTime={currentTime} duration={duration} onSeek={onSeek} className="mb-2" />
    <div className="flex items-center justify-between gap-2 sm:gap-4">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
        <Button
          variant="ghost"
          size={isMobile ? "sm" : "icon"}
          onClick={(e) => {
            vibrateDevice(42) // Vibrate for 42ms
            onPlayPause(e)
          }}
          className="text-white hover:bg-transparent focus:bg-transparent relative z-10 h-10 w-10 sm:h-12 sm:w-12 min-h-[40px] min-w-[40px] sm:min-h-[48px] sm:min-w-[48px]"
          disabled={isBuffering}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xl rounded-full -z-10"></div>
          <AnimatePresence mode="wait">
            {isBuffering ? (
              <motion.div
                key="buffering"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="loading-animation-circle"
              >
                <div className="loading-circle-backdrop"></div>
                {/* Single circle with no inner circle */}
                <svg className={`${isMobile ? "w-5 h-5" : "w-6 h-6"} relative z-10`} viewBox="0 0 50 50">
                  <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="90,150"
                    strokeDashoffset="0"
                    className="animate-ios-spinner"
                  ></circle>
                </svg>
              </motion.div>
            ) : isPlaying ? (
              <motion.div
                key="pause"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Pause className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Play className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
        <Button
          variant="ghost"
          size={isMobile ? "sm" : "icon"}
          onClick={(e) => {
            vibrateDevice(42) // Vibrate for 42ms
            onMuteToggle(e)
          }}
          className="text-white hover:bg-transparent focus:bg-transparent relative z-10 h-10 w-10 sm:h-12 sm:w-12 min-h-[40px] min-w-[40px] sm:min-h-[48px] sm:min-w-[48px]"
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xl rounded-full -z-10"></div>

          {/* iOS-style volume transition - both icons are always present with crossfade */}
          <div className="relative h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: isMuted ? 1 : 0 }}
              animate={{ opacity: isMuted ? 1 : 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <VolumeX className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
            </motion.div>

            <motion.div
              initial={{ opacity: isMuted ? 0 : 1 }}
              animate={{ opacity: isMuted ? 0 : 1 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Volume2 className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
            </motion.div>
          </div>
        </Button>
      </motion.div>
    </div>
  </motion.div>
)

export default function VideoShowcase() {
  // Media queries for responsive design
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isSmallMobile = useMediaQuery("(max-width: 360px)")

  // Track state for each video separately
  const [mainVideoState, setMainVideoState] = useState({
    isPlaying: false,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    isBuffering: false,
  })

  // Separate state for thumbnail videos
  const [thumbnailStates, setThumbnailStates] = useState([
    { isPlaying: false, isMuted: false, currentTime: 0, duration: 0, isBuffering: false },
    { isPlaying: false, isMuted: false, currentTime: 0, duration: 0, isBuffering: false },
    { isPlaying: false, isMuted: false, currentTime: 0, duration: 0, isBuffering: false },
  ])

  const sectionRef = useRef<HTMLElement>(null)
  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const thumbnailRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null])

  // Timer ref for updating progress
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Updated videos array with new image URLs
  const videos = [
    {
      id: 0,
      title: "Main Showcase",
      src: "/videos/main-showcase.mp4",
      poster: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Main.jpg-R3NSDpzS3gKOKRIT7GHHyFK3nef3lh.jpeg", // Updated to Main.jpg
    },
    {
      id: 1,
      title: "Season 08 Episode 02",
      src: "/videos/short-sample-1.mp4",
      poster:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1%28new%29.jpg-3xJk3wzOVOYbnDmGm5JITFhXJXHop5.jpeg", // Updated to 1(new).jpg
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
    progressTimerRef.current = setTimeout(updateVideoProgress, 50) // More frequent updates for smoother animation
  }

  // Start progress updates
  useEffect(() => {
    progressTimerRef.current = setTimeout(updateVideoProgress, 50)

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

  // Fix aspect ratio issues
  useEffect(() => {
    // Fix for main video
    if (mainVideoRef.current) {
      mainVideoRef.current.style.objectFit = "cover"
      mainVideoRef.current.style.objectPosition = "center"
      mainVideoRef.current.style.width = "100%"
      mainVideoRef.current.style.height = "100%"

      // Force poster to fill container
      const mainVideoContainer = mainVideoRef.current.parentElement
      if (mainVideoContainer) {
        mainVideoContainer.style.overflow = "hidden"
        mainVideoContainer.style.display = "flex"
        mainVideoContainer.style.alignItems = "center"
        mainVideoContainer.style.justifyContent = "center"
      }
    }

    // Fix for thumbnail videos
    thumbnailRefs.current.forEach((ref) => {
      if (ref) {
        ref.style.objectFit = "cover"
        ref.style.objectPosition = "center"
        ref.style.width = "100%"
        ref.style.height = "100%"
      }
    })
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

  // Function to pause all videos except the one specified
  const pauseAllVideosExcept = (exceptIndex: number | null = null) => {
    // Pause main video if it's not the excepted one
    if (exceptIndex !== -1 && mainVideoRef.current && !mainVideoRef.current.paused) {
      mainVideoRef.current.pause()
      setMainVideoState((prev) => ({ ...prev, isPlaying: false }))
    }

    // Pause all thumbnail videos except the specified one
    thumbnailRefs.current.forEach((videoRef, index) => {
      if (index !== exceptIndex && videoRef && !videoRef.paused) {
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
      pauseAllVideosExcept(-1) // -1 indicates main video

      // Set buffering state
      setMainVideoState((prev) => ({ ...prev, isBuffering: true }))

      // Then play this video
      mainVideoRef.current
        .play()
        .then(() => {
          setMainVideoState((prev) => ({ ...prev, isPlaying: true, isBuffering: false }))
        })
        .catch((err) => {
          setMainVideoState((prev) => ({ ...prev, isBuffering: false }))
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
      pauseAllVideosExcept(index)

      // Set buffering state
      setThumbnailStates((prev) => {
        const newStates = [...prev]
        newStates[index] = { ...newStates[index], isBuffering: true }
        return newStates
      })

      // Then play this video
      videoRef
        .play()
        .then(() => {
          setThumbnailStates((prev) => {
            const newStates = [...prev]
            newStates[index] = { ...newStates[index], isPlaying: true, isBuffering: false }
            return newStates
          })
        })
        .catch(() => {
          setThumbnailStates((prev) => {
            const newStates = [...prev]
            newStates[index] = { ...newStates[index], isBuffering: false }
            return newStates
          })
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

  // Calculate the max width for the main video based on aspect ratio
  const getMainVideoMaxWidth = () => {
    if (isSmallMobile) return "95vw"
    if (isMobile) return "90vw"
    return "405px" // Default max width for desktop (same as 9:16 aspect ratio at full height)
  }

  return (
    <section id="showcase" ref={sectionRef} className="py-12 sm:py-20 overflow-hidden">
      <motion.div className="container px-2 sm:px-4 md:px-6" style={{ opacity, y }}>
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
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
                <div
                  className="aspect-[9/16] w-full mx-auto overflow-hidden flex items-center justify-center"
                  style={{ maxWidth: getMainVideoMaxWidth() }}
                >
                  <motion.video
                    ref={mainVideoRef}
                    className="w-full h-full object-cover"
                    poster={videos[0].poster} // Always use the first video's poster
                    muted={mainVideoState.isMuted}
                    playsInline
                    preload="auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    onPlay={() => {
                      // Pause all other videos when this one plays
                      pauseAllVideosExcept(-1)
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
                    onWaiting={() => {
                      setMainVideoState((prev) => ({ ...prev, isBuffering: true }))
                    }}
                    onPlaying={() => {
                      setMainVideoState((prev) => ({ ...prev, isBuffering: false }))
                    }}
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  >
                    <source src={videos[0].src} type="video/mp4" />
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
                      mainVideoRef.current.currentTime = time
                    }
                  }}
                  isBuffering={mainVideoState.isBuffering}
                  isMobile={isMobile}
                />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-8">
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
              >
                <div className="apple-blur rounded-3xl border border-zinc-800/30 overflow-hidden apple-glow">
                  <div className="p-0">
                    <div className="relative aspect-[9/16] bg-zinc-800 overflow-hidden flex items-center justify-center">
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
                        style={{ objectFit: "cover", objectPosition: "center" }}
                        onPlay={() => {
                          // Pause all other videos when this one plays
                          pauseAllVideosExcept(index)
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
                        onWaiting={() => {
                          setThumbnailStates((prev) => {
                            const newStates = [...prev]
                            newStates[index] = { ...newStates[index], isBuffering: true }
                            return newStates
                          })
                        }}
                        onPlaying={() => {
                          setThumbnailStates((prev) => {
                            const newStates = [...prev]
                            const newstates = { ...newStates[index], isBuffering: false }
                            newStates[index] = newstates
                            return newStates
                          })
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
                            videoRef.currentTime = time
                          }
                        }}
                        isBuffering={thumbnailStates[index].isBuffering}
                        isMobile={isMobile}
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
            className="mt-4 sm:mt-8 text-center"
          >
            <div className="apple-blur-light rounded-3xl border border-zinc-800/30 overflow-hidden p-3 sm:p-4 apple-glow">
              <p className="text-base sm:text-lg text-gray-300">All these videos are edited by me</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

