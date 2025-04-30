"use client"

import { useEffect, useRef, useState } from "react"
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from "lucide-react"

export default function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [temperatureState, setTemperatureState] = useState<"cold" | "mild" | "warm" | "hot">("mild")

  useEffect(() => {
    // Cycle through temperature states
    const interval = setInterval(() => {
      setTemperatureState((prev) => {
        const states: Array<"cold" | "mild" | "warm" | "hot"> = ["cold", "mild", "warm", "hot"]
        const currentIndex = states.indexOf(prev)
        const nextIndex = (currentIndex + 1) % states.length
        return states[nextIndex]
      })
    }, 8000) // Change every 8 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear previous elements
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    // Create background gradient based on temperature state
    const backgroundGradient = document.createElement("div")
    backgroundGradient.className = "absolute inset-0 transition-colors duration-3000"

    switch (temperatureState) {
      case "cold":
        backgroundGradient.classList.add(
          "bg-gradient-to-br",
          "from-blue-100",
          "to-blue-300",
          "dark:from-blue-900",
          "dark:to-blue-700",
        )
        break
      case "mild":
        backgroundGradient.classList.add(
          "bg-gradient-to-br",
          "from-sky-100",
          "to-indigo-200",
          "dark:from-sky-900",
          "dark:to-indigo-800",
        )
        break
      case "warm":
        backgroundGradient.classList.add(
          "bg-gradient-to-br",
          "from-yellow-100",
          "to-orange-200",
          "dark:from-yellow-900",
          "dark:to-orange-800",
        )
        break
      case "hot":
        backgroundGradient.classList.add(
          "bg-gradient-to-br",
          "from-orange-100",
          "to-red-200",
          "dark:from-orange-900",
          "dark:to-red-800",
        )
        break
    }

    container.appendChild(backgroundGradient)

    // Create temperature indicator
    const tempIndicator = document.createElement("div")
    tempIndicator.className =
      "absolute top-4 right-4 bg-white/80 dark:bg-slate-800/80 rounded-full px-3 py-1 text-sm font-medium shadow-md transition-all duration-1000"

    switch (temperatureState) {
      case "cold":
        tempIndicator.textContent = "5°C"
        tempIndicator.classList.add("text-blue-600", "dark:text-blue-400")
        break
      case "mild":
        tempIndicator.textContent = "18°C"
        tempIndicator.classList.add("text-sky-600", "dark:text-sky-400")
        break
      case "warm":
        tempIndicator.textContent = "25°C"
        tempIndicator.classList.add("text-orange-600", "dark:text-orange-400")
        break
      case "hot":
        tempIndicator.textContent = "32°C"
        tempIndicator.classList.add("text-red-600", "dark:text-red-400")
        break
    }

    container.appendChild(tempIndicator)

    // Create weather elements
    const weatherTypes = [
      { icon: Sun, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/50" },
      { icon: Cloud, color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800/50" },
      { icon: CloudRain, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/50" },
      { icon: CloudSnow, color: "text-slate-300", bg: "bg-slate-100 dark:bg-slate-800/50" },
      { icon: CloudLightning, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/50" },
    ]

    // Create profile icons
    const profileIcons = ["👨‍💼", "👩‍🌾", "🏃‍♀️", "👨‍🎓", "🚗"]

    // Create elements array to track all elements for connections
    const elements: HTMLElement[] = []

    // Create and animate weather icons
    weatherTypes.forEach((weather, index) => {
      const div = document.createElement("div")
      div.className = `absolute ${weather.bg} p-3 rounded-full shadow-md transition-all duration-1000 z-10`
      div.style.left = `${Math.random() * 70 + 10}%`
      div.style.top = `${Math.random() * 40 + 5}%`
      div.style.opacity = "0"
      div.style.transform = "scale(0.5)"

      // Create the SVG icon
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
      svg.setAttribute("width", "24")
      svg.setAttribute("height", "24")
      svg.setAttribute("viewBox", "0 0 24 24")
      svg.setAttribute("fill", "none")
      svg.setAttribute("stroke", "currentColor")
      svg.setAttribute("stroke-width", "2")
      svg.setAttribute("stroke-linecap", "round")
      svg.setAttribute("stroke-linejoin", "round")

      // Set the icon path based on the weather type
      if (weather.icon === Sun) {
        svg.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`
      } else if (weather.icon === Cloud) {
        svg.innerHTML = `<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>`
      } else if (weather.icon === CloudRain) {
        svg.innerHTML = `<line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>`
      } else if (weather.icon === CloudSnow) {
        svg.innerHTML = `<path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="8" y1="20" x2="8.01" y2="20"></line><line x1="12" y1="18" x2="12.01" y2="18"></line><line x1="12" y1="22" x2="12.01" y2="22"></line><line x1="16" y1="16" x2="16.01" y2="16"></line><line x1="16" y1="20" x2="16.01" y2="20"></line>`
      } else if (weather.icon === CloudLightning) {
        svg.innerHTML = `<path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><polyline points="13 11 9 17 15 17 11 23"></polyline>`
      }

      svg.classList.add(weather.color)
      div.appendChild(svg)

      // Append to container
      container.appendChild(div)
      elements.push(div)

      // Animate entry
      setTimeout(() => {
        div.style.opacity = "1"
        div.style.transform = "scale(1)"
      }, index * 300)

      // Animate movement
      setInterval(() => {
        div.style.left = `${Math.random() * 70 + 10}%`
        div.style.top = `${Math.random() * 40 + 5}%`
      }, 5000)
    })

    // Create and animate profile icons
    profileIcons.forEach((emoji, index) => {
      const div = document.createElement("div")
      div.className = "absolute bg-white dark:bg-slate-800 p-2 rounded-full shadow-md transition-all duration-1000 z-10"
      div.style.left = `${Math.random() * 70 + 10}%`
      div.style.top = `${Math.random() * 30 + 60}%`
      div.style.opacity = "0"
      div.style.transform = "scale(0.5)"
      div.textContent = emoji
      div.style.fontSize = "24px"

      // Append to container
      container.appendChild(div)
      elements.push(div)

      // Animate entry
      setTimeout(
        () => {
          div.style.opacity = "1"
          div.style.transform = "scale(1)"
        },
        1000 + index * 300,
      )

      // Animate movement
      setInterval(() => {
        div.style.left = `${Math.random() * 70 + 10}%`
        div.style.top = `${Math.random() * 30 + 60}%`
      }, 6000)
    })

    // Create connecting lines
    const canvas = document.createElement("canvas")
    canvas.className = "absolute inset-0 w-full h-full"
    container.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Add temperature-specific elements
    const addTemperatureElements = () => {
      // Clear any previous temperature elements
      const tempElements = container.querySelectorAll(".temp-element")
      tempElements.forEach((el) => el.remove())

      switch (temperatureState) {
        case "cold":
          // Add snowflakes
          for (let i = 0; i < 15; i++) {
            const snowflake = document.createElement("div")
            snowflake.className =
              "absolute temp-element text-blue-200 dark:text-blue-600 transition-all duration-1000 z-5"
            snowflake.textContent = "❄"
            snowflake.style.left = `${Math.random() * 90 + 5}%`
            snowflake.style.top = `${Math.random() * 90 + 5}%`
            snowflake.style.opacity = "0.7"
            snowflake.style.fontSize = `${Math.random() * 10 + 10}px`
            snowflake.style.transform = "rotate(0deg)"
            container.appendChild(snowflake)

            // Animate snowflakes
            setInterval(() => {
              snowflake.style.top = `${Number.parseFloat(snowflake.style.top) + 0.5}%`
              snowflake.style.transform = `rotate(${Math.random() * 360}deg)`

              if (Number.parseFloat(snowflake.style.top) > 95) {
                snowflake.style.top = "5%"
                snowflake.style.left = `${Math.random() * 90 + 5}%`
              }
            }, 200)
          }
          break

        case "hot":
          // Add heat waves
          for (let i = 0; i < 8; i++) {
            const heatWave = document.createElement("div")
            heatWave.className =
              "absolute temp-element bg-red-500/10 dark:bg-red-500/20 rounded-full blur-md transition-all duration-1000 z-5"
            heatWave.style.width = `${Math.random() * 100 + 50}px`
            heatWave.style.height = `${Math.random() * 100 + 50}px`
            heatWave.style.left = `${Math.random() * 80 + 10}%`
            heatWave.style.top = `${Math.random() * 80 + 10}%`
            heatWave.style.opacity = "0"
            container.appendChild(heatWave)

            // Animate heat waves
            setTimeout(() => {
              heatWave.style.opacity = "0.7"
            }, i * 200)

            setInterval(() => {
              heatWave.style.width = `${Math.random() * 100 + 50}px`
              heatWave.style.height = `${Math.random() * 100 + 50}px`
              heatWave.style.left = `${Math.random() * 80 + 10}%`
              heatWave.style.top = `${Math.random() * 80 + 10}%`
            }, 3000)
          }
          break

        case "warm":
          // Add sun rays
          const sunRays = document.createElement("div")
          sunRays.className =
            "absolute temp-element top-10 left-1/2 transform -translate-x-1/2 transition-all duration-1000 z-5"
          sunRays.innerHTML = `
            <div class="w-20 h-20 bg-yellow-400 dark:bg-yellow-600 rounded-full animate-pulse"></div>
            <div class="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 border-4 border-yellow-300/30 dark:border-yellow-500/30 rounded-full"></div>
            <div class="absolute top-1/2 left-1/2 w-60 h-60 -translate-x-1/2 -translate-y-1/2 border-4 border-yellow-300/20 dark:border-yellow-500/20 rounded-full"></div>
          `
          container.appendChild(sunRays)
          break

        case "mild":
          // Add clouds
          for (let i = 0; i < 5; i++) {
            const cloud = document.createElement("div")
            cloud.className =
              "absolute temp-element bg-white/40 dark:bg-slate-300/20 rounded-full blur-md transition-all duration-1000 z-5"
            cloud.style.width = `${Math.random() * 120 + 80}px`
            cloud.style.height = `${Math.random() * 60 + 40}px`
            cloud.style.left = `${Math.random() * 80}%`
            cloud.style.top = `${Math.random() * 40}%`
            cloud.style.opacity = "0"
            container.appendChild(cloud)

            // Animate clouds
            setTimeout(() => {
              cloud.style.opacity = "0.7"
            }, i * 300)

            setInterval(() => {
              cloud.style.left = `${Number.parseFloat(cloud.style.left) + 0.1}%`

              if (Number.parseFloat(cloud.style.left) > 100) {
                cloud.style.left = "-20%"
              }
            }, 100)
          }
          break
      }
    }

    addTemperatureElements()

    // Animation loop for connections
    const animate = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set line style based on temperature
      switch (temperatureState) {
        case "cold":
          ctx.strokeStyle = "rgba(191, 219, 254, 0.3)" // blue-200
          break
        case "mild":
          ctx.strokeStyle = "rgba(148, 163, 184, 0.3)" // slate-300
          break
        case "warm":
          ctx.strokeStyle = "rgba(253, 186, 116, 0.3)" // orange-300
          break
        case "hot":
          ctx.strokeStyle = "rgba(252, 165, 165, 0.3)" // red-300
          break
      }

      ctx.lineWidth = 1.5

      // Connect all elements with lines if they're close enough
      for (let i = 0; i < elements.length; i++) {
        const el1 = elements[i]
        const rect1 = el1.getBoundingClientRect()
        const x1 = rect1.left + rect1.width / 2 - container.getBoundingClientRect().left
        const y1 = rect1.top + rect1.height / 2 - container.getBoundingClientRect().top

        for (let j = i + 1; j < elements.length; j++) {
          const el2 = elements[j]
          const rect2 = el2.getBoundingClientRect()
          const x2 = rect2.left + rect2.width / 2 - container.getBoundingClientRect().left
          const y2 = rect2.top + rect2.height / 2 - container.getBoundingClientRect().top

          const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

          // Increase the connection distance to ensure more elements are connected
          if (distance < 200) {
            // Calculate opacity based on distance (closer = more opaque)
            const opacity = 1 - distance / 200

            // Set line style with dynamic opacity
            switch (temperatureState) {
              case "cold":
                ctx.strokeStyle = `rgba(191, 219, 254, ${opacity * 0.5})` // blue-200
                break
              case "mild":
                ctx.strokeStyle = `rgba(148, 163, 184, ${opacity * 0.5})` // slate-300
                break
              case "warm":
                ctx.strokeStyle = `rgba(253, 186, 116, ${opacity * 0.5})` // orange-300
                break
              case "hot":
                ctx.strokeStyle = `rgba(252, 165, 165, ${opacity * 0.5})` // red-300
                break
            }

            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Update temperature elements when temperature state changes
    const temperatureObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-temperature") {
          addTemperatureElements()
        }
      })
    })

    temperatureObserver.observe(container, { attributes: true })

    // Set initial temperature attribute
    container.setAttribute("data-temperature", temperatureState)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      temperatureObserver.disconnect()
    }
  }, [temperatureState])

  // Update the data-temperature attribute when temperatureState changes
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.setAttribute("data-temperature", temperatureState)
    }
  }, [temperatureState])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-lg overflow-hidden transition-all duration-3000"
      data-temperature={temperatureState}
    >
      <style jsx global>{`
        .duration-3000 {
          transition-duration: 3000ms;
        }
      `}</style>
    </div>
  )
}
