"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ParticlesProps {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  refresh?: boolean
}

export function Particles({ className, quantity = 30, staticity = 50, ease = 50, refresh = false }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const particles = useRef<Array<Particle>>([])
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })

  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (canvasContainerRef.current) {
      setDimensions({
        width: canvasContainerRef.current.offsetWidth,
        height: canvasContainerRef.current.offsetHeight,
      })
    }
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d")
    }

    if (context.current && dimensions.width && dimensions.height) {
      initializeParticles()
      animateParticles()
      window.addEventListener("resize", handleResize)
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [dimensions, refresh])

  const initializeParticles = () => {
    particles.current = []
    const { width, height } = dimensions
    const particleCount = quantity

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 2 + 0.5

      particles.current.push({
        x,
        y,
        size,
        originalX: x,
        originalY: y,
        vx: 0,
        vy: 0,
        color: `rgba(var(--primary), ${Math.random() * 0.3 + 0.2})`,
      })
    }
  }

  const animateParticles = () => {
    if (!context.current) return

    const { width, height } = dimensions
    context.current.clearRect(0, 0, width, height)

    particles.current.forEach((particle) => {
      const dx = mouse.current.x - particle.x
      const dy = mouse.current.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = 100

      // Move particles away from mouse
      if (distance < maxDistance) {
        const force = -((maxDistance - distance) / maxDistance)
        particle.vx += ((dx / distance) * force) / staticity
        particle.vy += ((dy / distance) * force) / staticity
      }

      // Return to original position
      particle.vx += (particle.originalX - particle.x) / (ease * 10)
      particle.vy += (particle.originalY - particle.y) / (ease * 10)

      // Apply velocity with damping
      particle.vx *= 0.9
      particle.vy *= 0.9
      particle.x += particle.vx
      particle.y += particle.vy

      // Draw particle
      context.current!.beginPath()
      context.current!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      context.current!.fillStyle = particle.color
      context.current!.fill()
    })

    animationRef.current = window.requestAnimationFrame(animateParticles)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (canvasContainerRef.current) {
      const rect = canvasContainerRef.current.getBoundingClientRect()
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }

  const handleResize = () => {
    if (canvasContainerRef.current) {
      setDimensions({
        width: canvasContainerRef.current.offsetWidth,
        height: canvasContainerRef.current.offsetHeight,
      })
    }
  }

  return (
    <div ref={canvasContainerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="absolute inset-0" />
    </div>
  )
}

interface Particle {
  x: number
  y: number
  size: number
  originalX: number
  originalY: number
  vx: number
  vy: number
  color: string
}
