"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function VideoShowcase() {
  // Track state for each video
  const [videoStates, setVideoStates] = useState([
    { isPlaying: false, isMuted: false },
    { isPlaying: false, isMuted: false },
    { isPlaying: false, isMuted: false },
    { isPlaying: false, isMuted: false },
  ])

  const [activeVideo, setActiveVideo] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null, null])

  // Define your videos here
  const videos = [
    {
      id: 1,
      title: "Main Showcase",
      src: "/videos/main-showcase.mp4",
      poster: "/placeholder.svg?height=720&width=405&text=Main+Video",
    },
    {
      id: 2,
      title: "Short Sample 1",
      src: "/videos/short-sample-1.mp4",
      poster: "/placeholder.svg?height=720&width=405&text=Short+1",
    },
    {
      id: 3,
      title: "Short Sample 2",
      src: "/videos/short-sample-2.mp4",
      poster: "/placeholder.svg?height=720&width=405&text=Short+2",
    },
    {
      id: 4,
      title: "Short Sample 3",
      src: "/videos/short-sample-3.mp4",
      poster: "/placeholder.svg?height=720&width=405&text=Short+3",
    },
  ]

  // Load video metadata on component mount
  useEffect(() => {
    // Preload video metadata
    videoRefs.current.forEach((videoRef, index) => {
      if (videoRef) {
        videoRef.preload = "metadata"

        // Set initial muted state (false = sound enabled)
        videoRef.muted = videoStates[index].isMuted

        // Load poster immediately
        if (videoRef.poster === "") {
          videoRef.poster = videos[index < videos.length ? index : 0].poster
        }
      }
    })
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

  // Toggle play/pause for any video
  const togglePlay = (index: number) => {
    const videoRef = videoRefs.current[index]
    if (!videoRef) return

    const newVideoStates = [...videoStates]

    if (videoRef.paused) {
      // Pause all other videos first
      videoRefs.current.forEach((ref, i) => {
        if (i !== index && ref && !ref.paused) {
          ref.pause()
          newVideoStates[i] = { ...newVideoStates[i], isPlaying: false }
        }
      })

      // Play this video
      videoRef
        .play()
        .then(() => {
          newVideoStates[index] = { ...newVideoStates[index], isPlaying: true }
          setVideoStates(newVideoStates)
        })
        .catch((err) => {
          console.error("Error playing video:", err)
        })
    } else {
      videoRef.pause()
      newVideoStates[index] = { ...newVideoStates[index], isPlaying: false }
      setVideoStates(newVideoStates)
    }
  }

  // Toggle mute for any video
  const toggleMute = (index: number) => {
    const videoRef = videoRefs.current[index]
    if (!videoRef) return

    const newVideoStates = [...videoStates]
    videoRef.muted = !videoRef.muted
    newVideoStates[index] = { ...newVideoStates[index], isMuted: videoRef.muted }
    setVideoStates(newVideoStates)
  }

  // Change the main video
  const changeMainVideo = (index: number) => {
    // First pause the current main video
    const currentMainVideo = videoRefs.current[activeVideo]
    if (currentMainVideo && !currentMainVideo.paused) {
      currentMainVideo.pause()

      const newVideoStates = [...videoStates]
      newVideoStates[activeVideo] = { ...newVideoStates[activeVideo], isPlaying: false }
      setVideoStates(newVideoStates)
    }

    // Set the new active video
    setActiveVideo(index)

    // Copy the muted state from the thumbnail to the main video
    setTimeout(() => {
      const mainVideoRef = videoRefs.current[activeVideo]
      const thumbnailVideoRef = videoRefs.current[index]

      if (mainVideoRef && thumbnailVideoRef) {
        mainVideoRef.muted = thumbnailVideoRef.muted

        const newVideoStates = [...videoStates]
        newVideoStates[activeVideo] = {
          ...newVideoStates[activeVideo],
          isMuted: thumbnailVideoRef.muted,
        }
        setVideoStates(newVideoStates)
      }
    }, 50)
  }

  // Video controls component for reuse
  const VideoControls = ({ index }: { index: number }) => (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => togglePlay(index)} className="text-white hover:bg-white/20">
          {videoStates[index].isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => toggleMute(index)} className="text-white hover:bg-white/20">
          {videoStates[index].isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  )

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
                    ref={(el) => (videoRefs.current[activeVideo] = el)}
                    className="w-full h-full object-cover"
                    poster={videos[activeVideo].poster}
                    muted={videoStates[activeVideo].isMuted}
                    playsInline
                    preload="auto"
                    onPlay={() => {
                      const newVideoStates = [...videoStates]
                      newVideoStates[activeVideo] = { ...newVideoStates[activeVideo], isPlaying: true }
                      setVideoStates(newVideoStates)
                    }}
                    onPause={() => {
                      const newVideoStates = [...videoStates]
                      newVideoStates[activeVideo] = { ...newVideoStates[activeVideo], isPlaying: false }
                      setVideoStates(newVideoStates)
                    }}
                  >
                    <source src={videos[activeVideo].src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <VideoControls index={activeVideo} />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {videos.slice(1, 4).map((video, index) => {
              const videoIndex = index + 1 // Actual index in the videos array

              return (
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
                >
                  <div className="apple-blur rounded-3xl border border-zinc-800/30 overflow-hidden apple-glow">
                    <div className="p-0">
                      <div className="relative aspect-[9/16] bg-zinc-800">
                        <video
                          ref={(el) => (videoRefs.current[videoIndex] = el)}
                          className="w-full h-full object-cover"
                          src={video.src}
                          poster={video.poster}
                          muted={videoStates[videoIndex].isMuted}
                          playsInline
                          preload="auto"
                          onPlay={() => {
                            const newVideoStates = [...videoStates]
                            newVideoStates[videoIndex] = { ...newVideoStates[videoIndex], isPlaying: true }
                            setVideoStates(newVideoStates)
                          }}
                          onPause={() => {
                            const newVideoStates = [...videoStates]
                            newVideoStates[videoIndex] = { ...newVideoStates[videoIndex], isPlaying: false }
                            setVideoStates(newVideoStates)
                          }}
                        >
                          <source src={video.src} type="video/mp4" />
                        </video>

                        {/* Add the same controls to thumbnail videos */}
                        <VideoControls index={videoIndex} />

                        {/* Add a play button overlay that changes the main video */}
                        <div
                          className="absolute inset-0 flex items-center justify-center z-10"
                          onClick={() => changeMainVideo(videoIndex)}
                        >
                          <div className="bg-black/30 rounded-full p-3 hover:bg-black/50 transition-colors">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

          
