import { GitPullRequest, Radar, Rocket, ShieldCheck } from 'lucide-react'
import useLiveTelemetry from '../hooks/useLiveTelemetry'

const TONES = {
  cyan: {
    dot: 'bg-cyan-400',
    iconWrap: 'bg-cyan-500/10 text-cyan-300 ring-cyan-400/40',
    meta: 'text-cyan-300',
    chip: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
  },
  amber: {
    dot: 'bg-amber-400',
    iconWrap: 'bg-amber-500/10 text-amber-300 ring-amber-400/40',
    meta: 'text-amber-300',
    chip: 'border-amber-400/20 bg-amber-500/10 text-amber-300',
  },
  emerald: {
    dot: 'bg-emerald-400',
    iconWrap: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/40',
    meta: 'text-emerald-300',
    chip: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
  },
}

function Beacon({ tone }) {
  const t = TONES[tone]
  return (
    <span className="relative flex size-2.5" aria-hidden="true">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${t.dot}`} />
      <span className={`relative inline-flex size-2.5 rounded-full ${t.dot}`} />
    </span>
  )
}

function StageCard({ stage }) {
  const t = TONES[stage.tone]
  const Icon = stage.icon
  return (
    <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-slate-800/80 bg-surface/90 p-5 shadow-card backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`grid size-10 place-items-center rounded-xl ring-1 ring-inset ${t.iconWrap}`}>
            <Icon className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-white">{stage.title}</h3>
            <p className={`font-mono text-[10px] uppercase tracking-wider ${t.meta}`}>{stage.meta}</p>
          </div>
        </div>
        <Beacon tone={stage.tone} />
      </div>
      <ul className="flex flex-1 flex-col gap-2.5">
        {stage.items.map((item) => (
          <li
            key={item.name}
            className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-white/[0.02] px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
          >
            <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${t.dot}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-100">{item.name}</p>
              <p className="truncate font-mono text-[11px] text-slate-400">{item.detail}</p>
            </div>
            {item.chip && (
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${t.chip}`}
              >
                {item.chip}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function EngineeringRadar() {
  const { open_prs, runs_count, health, connected } = useLiveTelemetry()

  const stages = [
    {
      icon: Rocket,
      tone: 'cyan',
      title: 'In flight',
      meta: 'active build · v0.2',
      items: [
        { name: 'MockForge Desktop v0.2', detail: 'Rust · Tauri v2 · SAPI bridge', chip: 'windows native' },
        { name: 'Heuristic interview engine', detail: 'SPOF / cache-pressure analyzers offline', chip: 'no egress' },
      ],
    },
    {
      icon: GitPullRequest,
      tone: 'amber',
      title: 'Upstream review',
      meta: `${open_prs} open PRs`,
      items: [
        { name: 'Ibis #12086', detail: 'base · pl.Object → dt.Unknown fallback', chip: 'open' },
        { name: 'SQLGlot #8257', detail: 'DuckDB array function AST', chip: 'review' },
        { name: 'SymPy #30384', detail: 'ut typing decorators', chip: 'review' },
      ],
    },
    {
      icon: ShieldCheck,
      tone: 'emerald',
      title: 'Shipped / maintained',
      meta: connected ? 'live telemetry' : 'cached',
      items: [
        { name: 'duck-diff', detail: `${runs_count.toLocaleString()} headless runs`, chip: health },
        { name: 'sqlean-lint PRO', detail: 'local-first AST lint CLI', chip: 'verified' },
      ],
    },
  ]

  return (
    <section id="radar" className="scroll-mt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
            <Radar className="size-3.5" />
            02 / engineering-radar
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Live engineering radar</h2>
        </div>
        <p className="max-w-sm text-sm text-slate-300">
          What's in flight, under upstream review, and shipping today — refreshed from duck-diff headless telemetry.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {stages.map((stage) => (
          <StageCard key={stage.title} stage={stage} />
        ))}
      </div>
    </section>
  )
}