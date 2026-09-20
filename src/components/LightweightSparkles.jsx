import { useEffect, useRef } from 'react'

const COUNT = 40
const R = 56 // 0x38
const G = 189 // 0xBD
const B = 248 // 0xF8 = #38BDF8 sky-400
const BASE_ALPHA = 0.15
const MAX_DPR = 2

function makeParticle(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.5 + Math.random() * 0.9,
    vx: (Math.random() - 0.5) * 0.16,
    vy: -(0.02 + Math.random() * 0.12),
    phase: Math.random() * Math.PI * 2,
  }
}

/**
 * Zero-WebGL backdrop: a 2D canvas drifting 40 faint sky-blue micro-particles
 * (#38BDF8 @ 0.15 alpha, ~1px radius). GPU-friendly — single overlay canvas,
 * DPR-capped, resize-aware, and it freezes for prefers-reduced-motion.
 */
export default function LightweightSparkles({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let w = 0
    let h = 0
    let particles = []
    let alive = true

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = Array.from({ length: COUNT }, () => makeParticle(w, h))
    }

    const frame = () => {
      if (!alive) return
      const alpha = BASE_ALPHA
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.phase += 0.02
        if (p.y < -4) {
          p.y = h + 4
          p.x = Math.random() * w
        }
        if (p.x < -4) p.x = w + 4
        else if (p.x > w + 4) p.x = -4
        const twinkle = 0.7 + 0.3 * Math.sin(p.phase)
        ctx.fillStyle = `rgba(${R}, ${G}, ${B}, ${(alpha * twinkle).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    if (reduceMotion.matches) {
      frame()
    } else {
      raf = requestAnimationFrame(frame)
    }

    const onVisibility = () => {
      if (document.hidden) {
        alive = false
        cancelAnimationFrame(raf)
      } else if (!reduceMotion.matches) {
        alive = true
        raf = requestAnimationFrame(frame)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}