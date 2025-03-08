"use client"

import type React from "react"
import "./globals.css"
import AnimatedBackground from "@/components/animated-background"
import { AnimatePresence } from "framer-motion"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnimatedBackground />
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </>
  )
}

