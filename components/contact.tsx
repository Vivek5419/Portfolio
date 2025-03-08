"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Youtube } from "lucide-react"
import { RedditIcon } from "@/components/icons/reddit-icon"
import { motion, useScroll, useTransform } from "framer-motion"

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

  const socialVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.3 },
    },
  }

  return (
    <section id="contact" ref={sectionRef} className="py-20 overflow-hidden">
      <motion.div className="container px-4 md:px-6" style={{ opacity, y }}>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Get In <span className="text-gray-400">Touch</span>
        </motion.h2>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            style={{ isolation: "isolate" }}
          >
            <div className="apple-blur rounded-3xl border border-zinc-800/30 mb-6 apple-glow">
              <div className="p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight mb-1.5">Connect</h3>
                <p className="text-sm text-muted-foreground">Follow me on social media</p>
              </div>
              <div className="p-6 pt-0">
                <div className="flex gap-4 justify-center">
                  <motion.div variants={socialVariants} whileHover="hover">
                    <Button asChild variant="secondary" size="icon">
                      <a href="https://m.youtube.com/@vivekthinks" target="_blank" rel="noopener noreferrer">
                        <Youtube className="h-5 w-5" />
                        <span className="sr-only">YouTube</span>
                      </a>
                    </Button>
                  </motion.div>

                  <motion.div variants={socialVariants} whileHover="hover">
                    <Button asChild variant="secondary" size="icon">
                      <a
                        href="https://www.reddit.com/u/Vivek5419/s/dNM3XZxCNU"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <RedditIcon className="h-5 w-5" />
                        <span className="sr-only">Reddit</span>
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            style={{ isolation: "isolate" }}
          >
            <div className="apple-blur rounded-3xl border border-zinc-800/30 apple-glow">
              <div className="p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight mb-1.5">Work Inquiry</h3>
                <p className="text-sm text-muted-foreground">Looking for professional editing services?</p>
              </div>
              <div className="p-6 pt-0">
                <p className="text-gray-300 mb-4">
                  I'm currently available for freelance work. Let's discuss your project!
                </p>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button asChild size="lg" className="w-full">
                    <a href="mailto:vivek.5419kumar@gmail.com">Email Me Directly</a>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

