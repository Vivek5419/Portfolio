"use client"

import { useEffect, useRef } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

function createFluidPoints(width: number, height: number, pointsCount: number) {
  const points: { x: number; y: number }[] = []
  for (let i = 0; i < pointsCount; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
    })
  }
  return points
}

export default function FluidAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<{ x: number; y: number }[]>([])
  const mouseSpring = useSpring(0, {
    stiffness: 100,
    damping: 30,
  })
  const mouseY = useSpring(0, {
    stiffness: 100,
    damping: 30,
  })

  const gradientOpacity = useTransform(mouseSpring, [-100, 0, 100], [0.2, 0.3, 0.2])
  const gradientRotation = useTransform(mouseSpring, [-100, 0, 100], [-15, 0, 15])

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const container = containerRef.current
    const { width, height } = container.getBoundingClientRect()

    canvas.width = width
    canvas.height = height

    pointsRef.current = createFluidPoints(width, height, 50)

    let animationFrameId: number
    let lastTime = 0
    const fps = 60
    const interval = 1000 / fps

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate)

      const deltaTime = currentTime - lastTime
      if (deltaTime < interval) return

      ctx.clearRect(0, 0, width, height)

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, `rgba(99, 102, 241, ${gradientOpacity.get()})`)
      gradient.addColorStop(0.5, `rgba(168, 85, 247, ${gradientOpacity.get()})`)
      gradient.addColorStop(1, `rgba(236, 72, 153, ${gradientOpacity.get()})`)

      ctx.fillStyle = gradient
      ctx.strokeStyle = gradient

      // Update points
      pointsRef.current.forEach((point, i) => {
        point.x += Math.sin(currentTime * 0.001 + i) * 0.5
        point.y += Math.cos(currentTime * 0.001 + i) * 0.5

        if (point.x < 0) point.x = width
        if (point.x > width) point.x = 0
        if (point.y < 0) point.y = height
        if (point.y > height) point.y = 0
      })

      // Draw fluid connections
      ctx.beginPath()
      pointsRef.current.forEach((point, i) => {
        pointsRef.current.forEach((otherPoint, j) => {
          if (i === j) return

          const dx = point.x - otherPoint.x
          const dy = point.y - otherPoint.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.moveTo(point.x, point.y)
            ctx.quadraticCurveTo(
              (point.x + otherPoint.x) / 2 + Math.sin(currentTime * 0.001) * 20,
              (point.y + otherPoint.y) / 2 + Math.cos(currentTime * 0.001) * 20,
              otherPoint.x,
              otherPoint.y,
            )
          }
        })
      })
      ctx.stroke()

      lastTime = currentTime - (deltaTime % interval)
    }

    animate(0)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      mouseSpring.set(x - width / 2)
      mouseY.set(y - height / 2)
    }

    container.addEventListener("mousemove", handleMouseMove)

    return () => {
      cancelAnimationFrame(animationFrameId)
      container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mouseSpring, mouseY, gradientOpacity])

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          transform: `rotate(${gradientRotation.get()}deg)`,
          transition: "transform 0.3s ease-out",
        }}
      />
    </motion.div>
  )
}

