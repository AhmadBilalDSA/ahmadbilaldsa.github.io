import { useEffect } from 'react'

export default function SpotlightFX() {
  useEffect(() => {
    let raf = 0
    const onMove = (e) => {
      const card = e.target.closest?.('.card-spotlight')
      if (!card) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return null
}