"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="py-8 relative" style={{ isolation: "isolate" }}>
      <div className="apple-blur-light absolute inset-0 -z-10 border-t border-zinc-800/30"></div>
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 text-center">
            <motion.h2
              className="text-1xl font-bold animate-gradient"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              Made with ♥ by Vivek
            </motion.h2>
            <p className="text-gray-400 text-sm">YouTube Shorts Editor</p>
          </div>
        </motion.div>
        <motion.div
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          © {new Date().getFullYear()} Portfolio of Vivek. All rights reserved.
        </motion.div>
      </div>
    </footer>
  )
}

