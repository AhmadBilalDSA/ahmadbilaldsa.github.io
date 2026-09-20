import { useState } from 'react'
import { Activity, Cpu, Eye, GitPullRequest, Play } from 'lucide-react'
import data from '../data/portfolioData.json'
import { cn } from '../lib/utils'
import useLiveTelemetry from '../hooks/useLiveTelemetry'
import SpotlightCard from './SpotlightCard'

const EDGE_VIEWS_KEY = 'ab-edge-views'

function useEdgeViews() {
  const [views] = useState(() => {
    try {
      let count = Number(window.localStorage.getItem(EDGE_VIEWS_KEY) || 0)
      if (!window.sessionStorage.getItem(EDGE_VIEWS_KEY)) {
        count += 1
        window.localStorage.setItem(EDGE_VIEWS_KEY, String(count))
        window.sessionStorage.setItem(EDGE_VIEWS_KEY, '1')
      }
      return count
    } catch {
      /* private mode — counter stays local and silent */
      return 0
    }
  })
  return views
}

function Cell({ icon: Icon, label, accent = 'text-cyan-400', children }) {
  return (
    <SpotlightCard className="flex h-full flex-col gap-3 rounded-xl border border-slate-800 bg-white/[0.02] p-4 transition-colors hover:border-cyan-500/30">
      <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400 sm:text-xs">
        <Icon className={cn('size-3.5', accent)} />
        {label}
      </span>
      <div className="flex flex-1 flex-col justify-center gap-1.5">{children}</div>
    </SpotlightCard>
  )
}

export default function TelemetryHub() {
  const { runs_count, health, connected, loading } = useLiveTelemetry()
  const views = useEdgeViews()

  const upstream = data.projects.openSource
  const mergedCount = upstream.filter((pr) => pr.status === 'MERGED').length
  const reconciliation = health === 'healthy' ? 'PASS' : 'WARN'

  return (
    <section id="telemetry" className="scroll-mt-28">
      <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400">
        <Activity className="size-3.5" />
        01 / presence-hub
      </p>

      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c1017] shadow-card backdrop-blur-md">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-elevated/70 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-rose/70" />
            <span className="size-3 rounded-full bg-amber/70" />
            <span className="size-3 rounded-full bg-emerald-400/70" />
            <span className="ml-2 font-mono text-xs text-slate-500">bilal@dev — activity-hub :: void</span>
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide',
              loading
                ? 'border-slate-700/70 text-slate-400'
                : connected
                  ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-amber-400/30 bg-amber-500/10 text-amber-300',
            )}
          >
            {loading ? 'syncing' : connected ? 'live · connected' : 'cached · offline'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-4">
          <Cell icon={Cpu} label="system pulse" accent="text-emerald-400">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-sm font-bold tracking-wider text-white">ACTIVE // DEV MODE</span>
            </div>
            <p className="font-mono text-[11px] text-slate-400">current focus</p>
            <p className="font-mono text-xs font-semibold text-cyan-300">Rust / Tauri v2 &amp; AST Tooling</p>
          </Cell>

          <Cell icon={Play} label="automated ci/cd" accent="text-cyan-400">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              DuckDB Reconciliation: {reconciliation}
            </span>
            <p className="font-mono text-[11px] text-slate-400">automated runs</p>
            <p className="font-mono text-2xl font-bold text-white">
              {runs_count.toLocaleString()}
              <span className="ml-1 text-sm font-semibold text-cyan-300">+</span>
            </p>
          </Cell>

          <Cell icon={GitPullRequest} label="upstream sync" accent="text-amber-400">
            <p className="font-mono text-sm font-bold text-white">
              {mergedCount} Merged
              <span className="text-slate-500"> /</span>
              <span className="text-cyan-300"> {upstream.length} Active upstream PRs</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {upstream.map((pr) => (
                <a
                  key={pr.name}
                  href={pr.prUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-md border border-slate-700/60 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
                >
                  {pr.name}
                </a>
              ))}
            </div>
          </Cell>

          <Cell icon={Eye} label="edge traffic" accent="text-sky-400">
            <p className="font-mono text-2xl font-bold text-white">{views.toLocaleString()}</p>
            <p className="font-mono text-[11px] text-slate-400">local page views · this device</p>
            <p className="font-mono text-[11px] text-slate-500">localStorage counter · zero cookies</p>
          </Cell>
        </div>

        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-800/80 px-4 py-2.5 font-mono text-[11px] text-slate-600">
          <span>$# activity hub — engine, upstream, edge</span>
          <span className="ml-auto flex items-center gap-1.5 text-slate-500">
            <span className="size-1.5 rounded-full bg-cyan-400" />
            Live telemetry synchronized via DuckDB engine
          </span>
        </p>
      </div>
    </section>
  )
}