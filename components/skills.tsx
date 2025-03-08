"use client"

import { useRef } from "react"
import { Scissors, Wand2, Zap, Layers, Clock, Sparkles } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function Skills() {
  const skills = [
    {
      icon: <Scissors className="h-6 w-6" />,
      title: "Precision Editing",
      description: "Frame-perfect cuts and transitions that enhance your content's impact.",
    },
    {
      icon: <Wand2 className="h-6 w-6" />,
      title: "Visual Effects",
      description: "Eye-catching effects that make your shorts stand out in the feed.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Fast Pacing",
      description: "Engaging rhythm that keeps viewers watching until the end.",
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Creative Compositing",
      description: "Seamless layering of elements for a professional look.",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Quick Turnaround",
      description: "Fast delivery without compromising on quality.",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Trend Awareness",
      description: "Up-to-date with the latest YouTube Shorts trends and algorithms.",
    },
  ]

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

  return (
    <section id="skills" ref={sectionRef} className="py-20 overflow-hidden">
      <motion.div className="container px-4 md:px-6" style={{ opacity, y }}>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          My <span className="text-gray-400">Skills</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: 0.1 * index,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.3 },
              }}
              style={{ isolation: "isolate" }}
            >
              <div className="h-full apple-blur rounded-3xl border border-zinc-800/30 overflow-hidden apple-glow">
                <div className="p-6 pb-2">
                  <motion.div
                    className="mb-2 text-white"
                    whileHover={{
                      rotate: [0, -10, 10, -10, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    {skill.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white">{skill.title}</h3>
                </div>
                <div className="p-6 pt-0">
                  <p className="text-gray-400 text-sm">{skill.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

