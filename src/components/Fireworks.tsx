import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  color: string
  size: number
  trail: { x: number; y: number; alpha: number }[]
}

interface LongFirework {
  x: number
  y: number
  targetY: number
  phase: "rising" | "exploding"
  particles: Particle[]
  timer: number
}

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const longFireworks: LongFirework[] = []
    const colors = [
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#ff1744",
      "#f50057",
      "#d500f9",
      "#651fff",
      "#00e676",
      "#76ff03",
      "#ffea00",
      "#ffd600",
    ]

    function createParticle(
      x: number,
      y: number,
      color: string,
      size = 2
    ): Particle {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 4 + 4
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        size,
        trail: [],
      }
    }

    function createFirework(x: number, y: number) {
      const color = colors[Math.floor(Math.random() * colors.length)]
      const particleCount = Math.floor(Math.random() * 50) + 50
      const size = Math.random() * 2 + 1

      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(x, y, color, size))
      }
    }

    function createLongFirework() {
      const x = Math.random() * (canvas?.width || 0)
      const y = canvas?.height || 0
      const targetY = Math.random() * ((canvas?.height || 0) * 0.6)

      longFireworks.push({
        x,
        y,
        targetY,
        phase: "rising",
        particles: [],
        timer: 0,
      })
    }

    function updateLongFireworks() {
      for (let i = longFireworks.length - 1; i >= 0; i--) {
        const fw = longFireworks[i]

        if (fw.phase === "rising") {
          fw.y -= 5

          particles.push({
            x: fw.x + (Math.random() - 0.5) * 2,
            y: fw.y,
            vx: 0,
            vy: 2,
            alpha: 1,
            color: "#ffeb3b",
            size: 2,
            trail: [],
          })

          if (fw.y <= fw.targetY) {
            fw.phase = "exploding"
            for (let j = 0; j < 100; j++) {
              particles.push(
                createParticle(
                  fw.x,
                  fw.y,
                  colors[Math.floor(Math.random() * colors.length)],
                  3
                )
              )
            }
          }
        } else {
          fw.timer++
          if (fw.timer > 50) {
            longFireworks.splice(i, 1)
          }
        }
      }
    }

    function createRandomFirework() {
      const position = Math.random()
      let x, y

      if (position < 0.3) {
        x = Math.random() * (canvas?.width || 0)
        y = Math.random() * ((canvas?.height || 0) * 0.3)
      } else if (position < 0.6) {
        x = Math.random() * (canvas?.width || 0)
        y = (canvas?.height || 0) * (0.3 + Math.random() * 0.4)
      } else {
        x = Math.random() * (canvas?.width || 0)
        y = (canvas?.height || 0) * (0.7 + Math.random() * 0.2)
      }

      createFirework(x, y)
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        p.trail.push({ x: p.x, y: p.y, alpha: p.alpha })
        if (p.trail.length > 5) p.trail.shift()

        p.trail.forEach((point) => {
          point.alpha *= 0.95
        })

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.15
        p.alpha *= 0.96

        if (p.alpha > 0.01) {
          ctx.save()

          p.trail.forEach((point) => {
            ctx.globalAlpha = point.alpha
            ctx.fillStyle = p.color
            ctx.beginPath()
            ctx.arc(point.x, point.y, p.size * 0.5, 0, Math.PI * 2)
            ctx.fill()
          })

          ctx.globalAlpha = p.alpha
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()

          ctx.restore()
        } else {
          particles.splice(i, 1)
        }
      }

      updateLongFireworks()

      if (Math.random() < 0.08) createRandomFirework()
      if (Math.random() < 0.02) createLongFirework()

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
  )
}
