"use client"

import { useEffect, useRef, useState } from "react"

// Background Option 1: Gradient Mesh
const GradientMeshBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Animation variables
    let time = 0
    const colors = ["#1a1a2e", "#16213e", "#0f3460", "#e94560"]

    // Animation loop
    const animate = () => {
      time += 0.005

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, colors[0])
      gradient.addColorStop(0.3, colors[1])
      gradient.addColorStop(0.6, colors[2])
      gradient.addColorStop(1, colors[3])

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw animated mesh
      const cellSize = 50
      const amplitude = 25

      for (let x = 0; x <= canvas.width; x += cellSize) {
        for (let y = 0; y <= canvas.height; y += cellSize) {
          const distX = (x / canvas.width) * 2 - 1
          const distY = (y / canvas.height) * 2 - 1

          const noise = simplex(x * 0.005 + time, y * 0.005 + time) * amplitude

          ctx.fillStyle = "rgba(255, 255, 255, 0.05)"
          ctx.beginPath()
          ctx.arc(x + noise, y + noise, 2, 0, Math.PI * 2)
          ctx.fill()

          if (x < canvas.width - cellSize && y < canvas.height - cellSize) {
            const nextX = x + cellSize
            const nextY = y + cellSize
            const nextNoiseX = simplex(nextX * 0.005 + time, y * 0.005 + time) * amplitude
            const nextNoiseY = simplex(x * 0.005 + time, nextY * 0.005 + time) * amplitude

            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
            ctx.beginPath()
            ctx.moveTo(x + noise, y + noise)
            ctx.lineTo(nextX + nextNoiseX, y + nextNoiseY)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(x + noise, y + noise)
            ctx.lineTo(x + nextNoiseX, nextY + nextNoiseY)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    // Simple noise function (not true Simplex, but works for this demo)
    const simplex = (x: number, y: number) => {
      const dot = x * 12.9898 + y * 78.233
      return (Math.sin(dot) * 43758.5453) % 1
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1]" />
}

// Background Option 2: Noise Flow Field
const NoiseFlowFieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      color: string
      speed: number
      angle: number
      velocity: { x: number; y: number }

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.2})`
        this.speed = 0.3
        this.angle = 0
        this.velocity = { x: 0, y: 0 }
      }

      update(time: number) {
        // Get flow field angle based on position
        this.angle = noise(this.x * 0.001, this.y * 0.001, time * 0.1) * Math.PI * 4

        // Update velocity based on angle
        this.velocity.x = Math.cos(this.angle) * this.speed
        this.velocity.y = Math.sin(this.angle) * this.speed

        // Update position
        this.x += this.velocity.x
        this.y += this.velocity.y

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = Math.min(300, (canvas.width * canvas.height) / 8000)

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Simple noise function
    const noise = (x: number, y: number, z: number) => {
      const X = Math.floor(x) & 255
      const Y = Math.floor(y) & 255
      const Z = Math.floor(z) & 255

      x -= Math.floor(x)
      y -= Math.floor(y)
      z -= Math.floor(z)

      const u = fade(x)
      const v = fade(y)
      const w = fade(z)

      const A = (X + 1) & 255
      const B = (Y + 1) & 255
      const C = (Z + 1) & 255

      return lerp(
        w,
        lerp(
          v,
          lerp(u, grad(X, Y, Z, x, y, z), grad(A, Y, Z, x - 1, y, z)),
          lerp(u, grad(X, B, Z, x, y - 1, z), grad(A, B, Z, x - 1, y - 1, z)),
        ),
        lerp(
          v,
          lerp(u, grad(X, Y, C, x, y, z - 1), grad(A, Y, C, x - 1, y, z - 1)),
          lerp(u, grad(X, B, C, x, y - 1, z - 1), grad(A, B, C, x - 1, y - 1, z - 1)),
        ),
      )
    }

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)

    const lerp = (t: number, a: number, b: number) => a + t * (b - a)

    const grad = (hash: number, x: number, y: number, z: number) => {
      const h = hash & 15
      const u = h < 8 ? x : y
      const v = h < 4 ? y : h === 12 || h === 14 ? x : z
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
    }

    // Animation loop
    let time = 0
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.001

      for (const particle of particles) {
        particle.update(time)
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    // Set initial background
    ctx.fillStyle = "rgb(10, 10, 20)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1]" />
}

// Background Option 3: Geometric Patterns
const GeometricPatternBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Animation variables
    let time = 0

    // Animation loop
    const animate = () => {
      time += 0.01

      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#0f0f1a")
      gradient.addColorStop(1, "#1a1a2e")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw geometric patterns
      const size = 50
      const rows = Math.ceil(canvas.height / size)
      const cols = Math.ceil(canvas.width / size)

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = j * size
          const y = i * size
          const distance = Math.sqrt(
            Math.pow(x + size / 2 - canvas.width / 2, 2) + Math.pow(y + size / 2 - canvas.height / 2, 2),
          )

          const angle = Math.sin(distance * 0.01 + time) * Math.PI

          ctx.save()
          ctx.translate(x + size / 2, y + size / 2)
          ctx.rotate(angle)

          const alpha = 0.1 + Math.sin(distance * 0.005 + time) * 0.05
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.lineWidth = 1

          const patternType = (i + j) % 3

          if (patternType === 0) {
            // Draw circle
            ctx.beginPath()
            ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2)
            ctx.stroke()
          } else if (patternType === 1) {
            // Draw square
            ctx.beginPath()
            ctx.rect(-size * 0.3, -size * 0.3, size * 0.6, size * 0.6)
            ctx.stroke()
          } else {
            // Draw triangle
            ctx.beginPath()
            ctx.moveTo(0, -size * 0.3)
            ctx.lineTo(size * 0.3, size * 0.3)
            ctx.lineTo(-size * 0.3, size * 0.3)
            ctx.closePath()
            ctx.stroke()
          }

          ctx.restore()
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1]" />
}

// Main component that allows switching between backgrounds
const InteractiveBackground = () => {
  const [backgroundType, setBackgroundType] = useState<number>(1)

  useEffect(() => {
    // You can set a default background type here
    setBackgroundType(1)
  }, [])

  return (
    <>
      {backgroundType === 0 && <GradientMeshBackground />}
      {backgroundType === 1 && <NoiseFlowFieldBackground />}
      {backgroundType === 2 && <GeometricPatternBackground />}

      {/* Uncomment this to add background switcher controls */}
      {/* <div className="fixed bottom-4 right-4 z-50 bg-black bg-opacity-50 backdrop-blur-sm rounded-full p-2">
        <button 
          onClick={() => setBackgroundType(0)} 
          className={`px-2 py-1 rounded-full ${backgroundType === 0 ? 'bg-white text-black' : 'text-white'}`}
        >
          1
        </button>
        <button 
          onClick={() => setBackgroundType(1)} 
          className={`px-2 py-1 rounded-full ${backgroundType === 1 ? 'bg-white text-black' : 'text-white'}`}
        >
          2
        </button>
        <button 
          onClick={() => setBackgroundType(2)} 
          className={`px-2 py-1 rounded-full ${backgroundType === 2 ? 'bg-white text-black' : 'text-white'}`}
        >
          3
        </button>
      </div> */}
    </>
  )
}

export default InteractiveBackground

