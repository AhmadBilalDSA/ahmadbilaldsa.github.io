import { useEffect } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { Activity, GitPullRequest, History, ShieldCheck } from 'lucide-react'
import useLiveTelemetry from '../hooks/useLiveTelemetry'
import { formatUTC } from '../lib/datetime'

export default function TelemetryOrb() {
  const { last_run, runs_count, open_prs, health, connected, loading } = useLiveTelemetry()
  const online = connected

  const runs = useMotionValue(0)
  useEffect(() => {
    const c = animate(runs, runs_count, { duration: 0.8, ease: 'easeOut' })
    return () => c.stop()
  }, [runs, runs_count])
  const runsText = useTransform(runs, (v) => Math.round(v).toLocaleString())

  return (
    <div className="relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-2xl border border-slate-800/80 bg-surface/70 p-5 shadow-card backdrop-blur-sm sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-emerald-500/10 blur-3xl"
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
            <Activity className="size-3.5" />
            Live Telemetry
          </p>
          <p className="mt-1.5 text-sm text-slate-400">duck-diff pipeline health</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${
            online
              ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
              : 'border-amber-400/30 bg-amber-500/10 text-amber-300'
          }`}
        >
          {online ? 'live' : loading ? 'syncing' : 'offline'}
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <span
            className={`block size-16 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 blur-[6px] ${
              online ? 'animate-pulse-dot' : ''
            }`}
          />
          <span
            className={`absolute inset-1 grid place-items-center rounded-full border bg-abyss/80 font-mono text-lg font-bold ${
              online ? 'text-emerald-300' : 'text-amber-300'
            }`}
          >
            {online ? '●' : '○'}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-2xl font-bold text-slate-50">
            <motion.span>{runsText}</motion.span>
            <span className="ml-1 text-sm font-medium text-slate-500">runs</span>
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <History className="size-3.5 text-cyan-400" />
            last sync {formatUTC(last_run)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-800 bg-white/[0.02] p-3">
          <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <GitPullRequest className="size-3.5" />
            Open PRs
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-cyan-300">
            {open_prs}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-3">
          <p className="flex items-center gap-1.5 text-[11px] text-emerald-300/80">
            <ShieldCheck className="size-3.5" />
            Upstream Health
          </p>
          <p className="mt-1 font-mono text-lg font-semibold capitalize text-emerald-300">
            {health}
          </p>
        </div>
      </div>
    </div>
  )
}