import { useEffect, useState } from 'react'
import { Activity, Cpu, Eye } from 'lucide-react'
import { cn } from '../lib/utils'
import useLiveTelemetry from '../hooks/useLiveTelemetry'

const EDGE_VIEWS_KEY = 'ab-edge-views'

function useUtcClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

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

function HubBlock({ icon: Icon, label, accent = 'text-cyan-400', children }) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-xl border border-slate-800 bg-white/[0.02] p-4">
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
        <Icon className={cn('size-3.5', accent)} />
        {label}
      </span>
      <div className="flex flex-1 flex-col justify-center gap-1">{children}</div>
    </div>
  )
}

export default function TelemetryHub() {
  const { runs_count, connected, loading } = useLiveTelemetry()
  const utc = useUtcClock()
  const views = useEdgeViews()

  return (
    <section id="telemetry" className="scroll-mt-28">
      <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400">
        <Activity className="size-3.5" />
        01 / presence-hub
      </p>

      <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c1017] shadow-card backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-elevated/70 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-rose/70" />
            <span className="size-3 rounded-full bg-amber/70" />
            <span className="size-3 rounded-full bg-emerald-400/70" />
            <span className="ml-2 font-mono text-xs text-slate-500">bilal@dev — presence-hub :: void</span>
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

        <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
          <HubBlock icon={Cpu} label="engineering pulse" accent="text-cyan-400">
            <p className="font-mono text-2xl font-bold text-white sm:text-3xl">
              {runs_count.toLocaleString()}
              <span className="ml-2 text-sm font-semibold text-cyan-300">runs</span>
            </p>
            <p className="font-mono text-[11px] text-slate-400">automated duck-diff engine</p>
            <p className="mt-1 border-t border-slate-800/80 pt-2 font-mono text-[11px] text-emerald-300">
              UTC sync <span className="text-slate-300">{utc.toUTCString()}</span>
            </p>
          </HubBlock>

          <HubBlock icon={Activity} label="activity beacon" accent="text-emerald-400">
            <p className="flex items-center gap-2 font-mono text-sm font-semibold text-emerald-300">
              <span className="size-2.5 animate-pulse-dot rounded-full bg-emerald-400" />
              In Development
            </p>
            <p className="font-mono text-[11px] text-slate-400">// Systems Tooling</p>
            <p className="mt-1 border-t border-slate-800/80 pt-2 font-mono text-[11px] text-slate-500">
              active: ripgrep · duck-diff · sqlean-lint
            </p>
          </HubBlock>

          <HubBlock icon={Eye} label="edge traffic" accent="text-sky-400">
            <p className="font-mono text-2xl font-bold text-white sm:text-3xl">
              {views.toLocaleString()}
              <span className="ml-2 text-sm font-semibold text-sky-300">views</span>
            </p>
            <p className="font-mono text-[11px] text-slate-400">this device session-based</p>
            <p className="mt-1 border-t border-slate-800/80 pt-2 font-mono text-[11px] text-slate-500">
              local-storage counter · zero cookies
            </p>
          </HubBlock>
        </div>

        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-800/80 px-4 py-2.5 font-mono text-[11px] text-slate-600">
          <span>$# presence — privacy-friendly edge metrics</span>
          <span className="ml-auto">source: duck-diff/portfolio_status.json · localStorage</span>
        </p>
      </div>
    </section>
  )
}