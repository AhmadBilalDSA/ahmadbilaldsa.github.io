import { useEffect, useState } from 'react'
import portfolioData from '../data/portfolioData.json'

const TELEMETRY_URL =
  'https://raw.githubusercontent.com/AhmadBilalDSA/duck-diff/main/data/portfolio_status.json'

const FALLBACK = portfolioData.telemetryFallback

function normalize(data) {
  return {
    last_run: data.last_run_timestamp ?? FALLBACK.last_run_timestamp,
    runs_count: Number(data.runs_count ?? FALLBACK.runs_count),
    open_prs: Number(data.open_prs ?? FALLBACK.open_prs),
    health: data.repo_health ?? FALLBACK.repo_health,
    connected: false,
  }
}

/**
 * Fetches live duck-diff telemetry from the raw GitHub JSON and exposes a clean
 * state object: { last_run, runs_count, open_prs, health, connected }.
 * `connected` is true only after a successful live fetch; otherwise the
 * cached starter metrics from the data layer are served.
 */
export default function useLiveTelemetry() {
  const [telemetry, setTelemetry] = useState(() => normalize(FALLBACK))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const load = async () => {
      try {
        const res = await fetch(TELEMETRY_URL, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error(`Telemetry fetch failed: ${res.status}`)
        const data = await res.json()
        if (!cancelled) setTelemetry({ ...normalize(data), connected: true })
      } catch {
        // keep cached/starter metrics while offline
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  return { ...telemetry, loading }
}