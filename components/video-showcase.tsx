"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [activeVideo, setActiveVideo] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const mainVideoRef = useRef<HTMLVideoElement>(null)

  // Define your videos here
  const videos = [
    {
      id: 1,
      title: "Main Showcase",
      src: "/videos/main-showcase.mp4", // Replace with your main video
      poster: "/placeholder.svg?height=720&width=405&text=Main+Video",
    },
    {
      id: 2,
      title: "Short Sample 1",
      src: "/videos/short-sample-1.mp4", // Replace with your first sample
      poster: "/placeholder.svg?height=720&width=405&text=Short+1",
    },
    {
      id: 3,
      title: "Short Sample 2",
      src: "/videos/short-sample-2.mp4", // Replace with your second sample
      poster: "/placeholder.svg?height=720&width=405&text=Short+2",
    },
    {
      id: 4,
      title: "Short Sample 3",
      src: "/videos/short-sample-3.mp4", // Replace with your third sample
      poster: "/placeholder.svg?height=720&width=405&text=Short+3",
    },
  ]

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

  const togglePlay = () => {
    if (!mainVideoRef.current) return

    if (mainVideoRef.current.paused) {
      mainVideoRef.current.play()
      setIsPlaying(true)
    } else {
      mainVideoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (!mainVideoRef.current) return

    mainVideoRef.current.muted = !mainVideoRef.current.muted
    setIsMuted(mainVideoRef.current.muted)
  }

  const changeVideo = (index: number) => {
    if (mainVideoRef.current) {
      mainVideoRef.current.pause()
      setIsPlaying(false)
    }

    setActiveVideo(index)

    // Small delay to ensure video source has changed
    setTimeout(() => {
      if (mainVideoRef.current) {
        mainVideoRef.current.load()
      }
    }, 50)
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
                <video
                  ref={mainVideoRef}
                  className="w-full aspect-[9/16] md:aspect-video object-cover"
                  poster={videos[activeVideo].poster}
                  muted={isMuted}
                  playsInline
                >
                  <source src={videos[activeVideo].src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <div className="flex items-center justify-between">
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
                onClick={() => changeVideo(index + 1)}
                className="cursor-pointer"
              >
                <div className="apple-blur rounded-3xl border border-zinc-800/30 overflow-hidden apple-glow">
                  <div className="p-0">
                    <div className="relative aspect-[9/16] bg-zinc-800">
                      <img
                        src={video.poster || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        whileHover={{
                          scale: 1.2,
                          transition: { duration: 0.3 },
                        }}
                      >
                        <Play className="h-12 w-12 text-white opacity-70" />
                      </motion.div>
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

