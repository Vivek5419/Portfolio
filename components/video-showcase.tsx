"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function VideoShowcase() {
  // Track state for each video separately
  const [mainVideoState, setMainVideoState] = useState({
    isPlaying: false,
    isMuted: false,
  })

  // Separate state for thumbnail videos
  const [thumbnailStates, setThumbnailStates] = useState([
    { isPlaying: false, isMuted: false },
    { isPlaying: false, isMuted: false },
    { isPlaying: false, isMuted: false },
  ])

  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const thumbnailRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null])

  // Define your videos here
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

  // Load video metadata on component mount
  useEffect(() => {
    // Set initial muted state for main video
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = mainVideoState.isMuted
    }

    // Set initial muted state for thumbnail videos
    thumbnailRefs.current.forEach((videoRef, index) => {
      if (videoRef) {
        videoRef.muted = thumbnailStates[index].isMuted
      }
    })
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

  // Main video controls
  const toggleMainPlay = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling

    if (!mainVideoRef.current) return

    if (mainVideoRef.current.paused) {
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
    // Update the source of the main video
    if (mainVideoRef.current) {
      // Pause the current main video
      mainVideoRef.current.pause()
      setMainVideoState((prev) => ({ ...prev, isPlaying: false }))

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
                    onPlay={() => setMainVideoState((prev) => ({ ...prev, isPlaying: true }))}
                    onPause={() => setMainVideoState((prev) => ({ ...prev, isPlaying: false }))}
                  >
                    <source src={videos[activeVideoIndex].src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Main video controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMainPlay}
                      className="text-white hover:bg-white/20"
                    >
                      {mainVideoState.isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMainMute}
                      className="text-white hover:bg-white/20"
                    >
                      {mainVideoState.isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                    </Button>
                  </div>
                </div>
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
                      >
                        <source src={video.src} type="video/mp4" />
                      </video>

                      {/* Thumbnail video controls */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent z-20">
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => toggleThumbnailPlay(index, e)}
                            className="text-white hover:bg-white/20"
                          >
                            {thumbnailStates[index].isPlaying ? (
                              <Pause className="h-6 w-6" />
                            ) : (
                              <Play className="h-6 w-6" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => toggleThumbnailMute(index, e)}
                            className="text-white hover:bg-white/20"
                          >
                            {thumbnailStates[index].isMuted ? (
                              <VolumeX className="h-6 w-6" />
                            ) : (
                              <Volume2 className="h-6 w-6" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Add a play button overlay that changes the main video */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-black/30 rounded-full p-3 hover:bg-black/50 transition-colors">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

