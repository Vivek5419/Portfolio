"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { vibrateDevice } from "@/lib/vibration"

export default function Menu() {
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isSmallMobile = useMediaQuery("(max-width: 360px)")

  // Ensure component is mounted before applying animations
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleButtonClick = (id: string) => {
    // Vibrate device when menu button is clicked
    vibrateDevice(42)

    setActiveButton(id)
    // Reset after animation completes
    setTimeout(() => setActiveButton(null), 400)
  }

  const menuItems = [
    { id: "work", label: "Work", href: "#showcase" },
    { id: "skills", label: "Skills", href: "#skills" },
    { id: "pricing", label: "Pricing", href: "#pricing" },
    { id: "contact", label: "Contact", href: "#contact" },
  ]

  if (!mounted) return null

  return (
    <motion.nav
      className="fixed top-4 left-0 right-0 mx-auto z-50 menu-container"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ isolation: "isolate", width: "fit-content", maxWidth: "95%" }}
    >
      <div className="menu-backdrop px-3 sm:px-6 py-2 sm:py-3 apple-glow">
        <div className={`flex items-center justify-center ${isSmallMobile ? "gap-1" : isMobile ? "gap-2" : "gap-4"}`}>
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              animate={
                activeButton === item.id
                  ? {
                      scale: [1, 0.9, 1.1, 0.95, 1],
                      transition: {
                        duration: 0.4,
                        times: [0, 0.2, 0.4, 0.6, 1],
                        ease: "easeInOut",
                      },
                    }
                  : {}
              }
            >
              <Button
                asChild
                variant="ghost"
                size={isSmallMobile ? "xs" : isMobile ? "sm" : "default"}
                className="text-white menu-button"
                onClick={() => handleButtonClick(item.id)}
              >
                <Link
                  href={item.href}
                  className={isSmallMobile ? "text-xs px-1.5 py-1" : isMobile ? "text-sm px-2 py-1.5" : "px-4 py-2"}
                >
                  {item.label}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

