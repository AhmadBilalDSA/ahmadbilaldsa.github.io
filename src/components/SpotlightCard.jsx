import { useEffect, useRef } from 'react'

const cards = new Set()
let frame = 0
let pointerX = 0
let pointerY = 0

function applySpotlights() {
  frame = 0
  if (cards.size === 0) return
  for (const el of cards) {
    const rect = el.getBoundingClientRect()
    const inside = pointerX >= rect.left && pointerX <= rect.right && pointerY >= rect.top && pointerY <= rect.bottom
    if (inside) {
      el.style.setProperty('--mouse-x', `${pointerX - rect.left}px`)
      el.style.setProperty('--mouse-y', `${pointerY - rect.top}px`)
    } else {
      el.style.setProperty('--mouse-x', '-999px')
      el.style.setProperty('--mouse-y', '-999px')
    }
  }
}

function onMove(e) {
  pointerX = e.clientX
  pointerY = e.clientY
  if (!frame) frame = requestAnimationFrame(applySpotlights)
}

function track(el) {
  cards.add(el)
  if (cards.size === 1) {
    window.addEventListener('pointermove', onMove, { passive: true })
  }
}

function untrack(el) {
  cards.delete(el)
  if (cards.size === 0) {
    window.removeEventListener('pointermove', onMove)
  }
}

export function SpotlightCard({
  children,
  className = '',
  glowColor = 'rgba(56, 189, 248, 0.14)',
  style = {},
  ...props
}) {
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!canHover) return

    track(el)
    return () => untrack(el)
  }, [])

  return (
    <div ref={cardRef} className={`spotlight-card ${className}`} style={{ '--glow-color': glowColor, ...style }} {...props}>
      {children}
    </div>
  )
}

export default SpotlightCard