import { motion } from 'framer-motion'
import { Activity, GitPullRequest, History, Play, ShieldCheck } from 'lucide-react'
import useLiveTelemetry from '../hooks/useLiveTelemetry'
import { cn } from '../lib/utils'
import { formatUTC } from '../lib/datetime'

function Stat({ label, value, accent, icon: Icon }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-white/[0.02] px-4 py-3 transition-colors hover:border-cyan-500/40">
      <span className="flex items-center gap-2 text-xs text-slate-500">
        <Icon className="size-3.5 text-cyan-400/80" />
        {label}
      </span>
      <span className={cn('font-mono text-sm font-semibold', accent)}>{value}</span>
    </div>
  )
}

export default function TelemetryConsole() {
  const { last_run, runs_count, open_prs, health, connected, loading } = useLiveTelemetry()
  const online = connected

  return (
    <section id="telemetry" className="scroll-mt-28">
      <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
        <Activity className="size-3.5" />
        01 / live-telemetry
      </p>

      <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-surface/80 shadow-card backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-elevated/70 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-rose/70" />
            <span className="size-3 rounded-full bg-amber/70" />
            <span className="size-3 rounded-full bg-emerald-400/70" />
            <span className="ml-2 font-mono text-xs text-slate-500">
              bilal@dev — duck-diff :: portfolio_status.json
            </span>
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide',
              online
                ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-400/30 bg-amber-500/10 text-amber-300',
            )}
          >
            {loading ? 'syncing' : online ? 'live · connected' : 'cached · offline'}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-2 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4"
        >
          <Stat label="Total runs" value={runs_count.toLocaleString()} accent="text-cyan-300" icon={Play} />
          <Stat label="Active PRs" value={String(open_prs)} accent="text-slate-50" icon={GitPullRequest} />
          <Stat
            label="Upstream health"
            value={health}
            accent={online ? 'text-emerald-300' : 'text-amber-300'}
            icon={ShieldCheck}
          />
          <Stat label="Last run" value={formatUTC(last_run)} accent="text-slate-400" icon={History} />
        </motion.div>

        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-800/80 px-4 py-2.5 font-mono text-[11px] text-slate-600">
          <span>$# duck-diff status — headless CI/CD telemetry</span>
          <span className="ml-auto">source: duck-diff/portfolio_status.json · ⌘K anywhere</span>
        </p>
      </div>
    </section>
  )
}