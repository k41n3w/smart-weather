"use client"

import { useRef, useEffect } from "react"

interface WeatherAnimationProps {
  condition: string
}

export function WeatherAnimation({ condition }: WeatherAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation variables
    let animationFrameId: number
    let particles: any[] = []

    // Create particles based on weather condition
    const createParticles = () => {
      particles = []
      const normalizedCondition = condition.toLowerCase()

      switch (normalizedCondition) {
        case "rain":
        case "rainy":
          for (let i = 0; i < 100; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              length: Math.random() * 20 + 10,
              speed: Math.random() * 15 + 10,
            })
          }
          break

        case "snow":
        case "snowy":
          for (let i = 0; i < 100; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              radius: Math.random() * 3 + 1,
              speed: Math.random() * 3 + 1,
              wind: Math.random() * 2 - 1,
              wobble: Math.random() * 0.1,
              wobbleSpeed: Math.random() * 0.05,
              wobblePos: Math.random() * Math.PI * 2,
            })
          }
          break

        case "cloudy":
        case "partly cloudy":
          for (let i = 0; i < 5; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * (canvas.height / 2),
              radius: Math.random() * 40 + 30,
              speed: Math.random() * 0.5 + 0.1,
            })
          }
          break

        case "stormy":
        case "thunderstorm":
          for (let i = 0; i < 100; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              length: Math.random() * 20 + 10,
              speed: Math.random() * 15 + 10,
            })
          }

          // Add lightning
          particles.push({
            lightning: true,
            nextFlash: Math.random() * 5000 + 2000,
            lastFlash: Date.now(),
            duration: 200,
            active: false,
          })
          break

        case "fog":
        case "foggy":
        case "mist":
          for (let i = 0; i < 20; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              radius: Math.random() * 60 + 40,
              opacity: Math.random() * 0.3 + 0.1,
              speed: Math.random() * 0.2 + 0.1,
            })
          }
          break

        case "clear":
        case "sunny":
        default:
          // Sun
          particles.push({
            x: canvas.width * 0.8,
            y: canvas.height * 0.2,
            radius: 40,
            rays: 12,
            rayLength: 20,
            raySpeed: 0.01,
            rayAngle: 0,
          })
          break
      }
    }

    // Draw functions for each weather condition
    const drawRain = (timestamp: number) => {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
      ctx.lineWidth = 1

      particles.forEach((drop) => {
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x, drop.y + drop.length)
        ctx.stroke()

        drop.y += drop.speed

        if (drop.y > canvas.height) {
          drop.y = -drop.length
          drop.x = Math.random() * canvas.width
        }
      })
    }

    const drawSnow = (timestamp: number) => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"

      particles.forEach((flake) => {
        ctx.beginPath()

        // Add wobble effect
        flake.wobblePos += flake.wobbleSpeed
        const wobbleOffset = Math.sin(flake.wobblePos) * 2

        ctx.arc(flake.x + wobbleOffset, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.fill()

        flake.y += flake.speed
        flake.x += flake.wind

        if (flake.y > canvas.height) {
          flake.y = -flake.radius
          flake.x = Math.random() * canvas.width
        }

        if (flake.x > canvas.width) {
          flake.x = 0
        } else if (flake.x < 0) {
          flake.x = canvas.width
        }
      })
    }

    const drawClouds = (timestamp: number) => {
      particles.forEach((cloud) => {
        // Draw cloud
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"

        // Draw a cloud shape using multiple circles
        const drawCloudShape = (x: number, y: number, radius: number) => {
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(x + radius * 0.5, y - radius * 0.2, radius * 0.7, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(x - radius * 0.5, y - radius * 0.2, radius * 0.7, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(x + radius * 0.9, y + radius * 0.2, radius * 0.6, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(x - radius * 0.9, y + radius * 0.2, radius * 0.6, 0, Math.PI * 2)
          ctx.fill()
        }

        drawCloudShape(cloud.x, cloud.y, cloud.radius)

        cloud.x += cloud.speed

        if (cloud.x - cloud.radius * 2 > canvas.width) {
          cloud.x = -cloud.radius * 2
          cloud.y = Math.random() * (canvas.height / 2)
        }
      })
    }

    const drawThunderstorm = (timestamp: number) => {
      // Draw rain
      drawRain(timestamp)

      // Draw lightning
      const lightning = particles.find((p) => p.lightning)
      if (lightning) {
        const now = Date.now()

        if (!lightning.active && now - lightning.lastFlash > lightning.nextFlash) {
          lightning.active = true
          lightning.lastFlash = now
        }

        if (lightning.active) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          setTimeout(() => {
            lightning.active = false
            lightning.nextFlash = Math.random() * 5000 + 2000
          }, lightning.duration)
        }
      }
    }

    const drawFog = (timestamp: number) => {
      particles.forEach((fog) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${fog.opacity})`
        ctx.beginPath()
        ctx.arc(fog.x, fog.y, fog.radius, 0, Math.PI * 2)
        ctx.fill()

        fog.x += fog.speed

        if (fog.x > canvas.width + fog.radius) {
          fog.x = -fog.radius
        }
      })
    }

    const drawClear = (timestamp: number) => {
      const sun = particles[0]

      // Draw sun
      ctx.fillStyle = "rgba(255, 220, 100, 0.8)"
      ctx.beginPath()
      ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw rays
      ctx.strokeStyle = "rgba(255, 220, 100, 0.5)"
      ctx.lineWidth = 2

      for (let i = 0; i < sun.rays; i++) {
        const angle = ((Math.PI * 2) / sun.rays) * i + sun.rayAngle
        const rayX = sun.x + Math.cos(angle) * sun.radius
        const rayY = sun.y + Math.sin(angle) * sun.radius
        const endX = sun.x + Math.cos(angle) * (sun.radius + sun.rayLength)
        const endY = sun.y + Math.sin(angle) * (sun.radius + sun.rayLength)

        ctx.beginPath()
        ctx.moveTo(rayX, rayY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }

      sun.rayAngle += sun.raySpeed
    }

    // Create particles
    createParticles()

    // Main animation loop
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const normalizedCondition = condition.toLowerCase()

      if (normalizedCondition.includes("rain")) {
        drawRain(timestamp)
      } else if (normalizedCondition.includes("snow")) {
        drawSnow(timestamp)
      } else if (normalizedCondition.includes("cloud")) {
        drawClouds(timestamp)
      } else if (normalizedCondition.includes("storm") || normalizedCondition.includes("thunder")) {
        drawThunderstorm(timestamp)
      } else if (normalizedCondition.includes("fog") || normalizedCondition.includes("mist")) {
        drawFog(timestamp)
      } else {
        // Default to clear/sunny
        drawClear(timestamp)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    // Start animation
    animationFrameId = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [condition])

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" style={{ opacity: 0.7 }} />
}

export default WeatherAnimation
