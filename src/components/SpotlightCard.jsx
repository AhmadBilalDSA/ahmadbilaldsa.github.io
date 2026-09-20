import { useRef, useEffect } from 'react'

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

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
      el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
    }

    const handleMouseLeave = () => {
      el.style.setProperty('--mouse-x', '-999px')
      el.style.setProperty('--mouse-y', '-999px')
    }

    el.addEventListener('mousemove', handleMouseMove, { passive: true })
    el.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div ref={cardRef} className={`spotlight-card ${className}`} style={{ '--glow-color': glowColor, ...style }} {...props}>
      {children}
    </div>
  )
}

export default SpotlightCard