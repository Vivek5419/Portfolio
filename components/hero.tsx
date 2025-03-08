"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function Hero() {
  const [isArrowAnimating, setIsArrowAnimating] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.5 + i * 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  }

  // Arrow animation that only runs when clicked
  const arrowVariants = {
    initial: { x: 0 },
    animate: {
      x: [0, 10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  const handleButtonClick = () => {
    setIsArrowAnimating(true)
    // Reset animation state after animation completes
    setTimeout(() => setIsArrowAnimating(false), 500)
  }

  return (
    <section ref={sectionRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ y, opacity }} />

      <motion.div
        className="container relative z-10 px-4 md:px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          custom={0}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-center"
        >
          <motion.span
            className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
          >
            Portfolio of Vivek
          </motion.span>
        </motion.h1>

        <motion.p
          custom={1}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          YouTube Shorts Editor
        </motion.p>

        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          className="hero-button-container"
        >
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="w-full">
            <Button size="lg" onClick={handleButtonClick} className="w-full hero-button">
              <a href="#showcase" className="flex items-center justify-center w-full">
                Check out my Work!{" "}
                <motion.div
                  className="ml-2 inline-flex"
                  variants={arrowVariants}
                  initial="initial"
                  animate={isArrowAnimating ? "animate" : "initial"}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </a>
            </Button>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="w-full">
            <Button size="lg" variant="outline" className="w-full hero-button">
              <a href="mailto:vivek.5419kumar@gmail.com" className="flex items-center justify-center w-full">
                Contact Me
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

