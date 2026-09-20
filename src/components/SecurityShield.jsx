import { useEffect } from 'react'

export default function SecurityShield() {
  useEffect(() => {
    if (!import.meta.env.PROD) return

    const handleContext = (e) => e.preventDefault()
    window.addEventListener('contextmenu', handleContext)

    return () => window.removeEventListener('contextmenu', handleContext)
  }, [])

  return null
}