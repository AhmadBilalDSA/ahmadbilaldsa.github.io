import { ArrowUpRight, GitPullRequest, Radar, Rocket, ShieldCheck } from 'lucide-react'
import data from '../data/portfolioData.json'
import useLiveTelemetry from '../hooks/useLiveTelemetry'

const TONES = {
  cyan: {
    dot: 'bg-cyan-400',
    iconWrap: 'bg-cyan-500/10 text-cyan-300 ring-cyan-400/40',
    meta: 'text-cyan-400 font-mono',
    chip: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
  },
  amber: {
    dot: 'bg-amber-400',
    iconWrap: 'bg-amber-500/10 text-amber-300 ring-amber-400/40',
    meta: 'text-amber-400 font-mono',
    chip: 'border-amber-400/20 bg-amber-500/10 text-amber-300',
  },
  emerald: {
    dot: 'bg-emerald-400',
    iconWrap: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/40',
    meta: 'text-emerald-400 font-mono',
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

function StageItem({ item, tone }) {
  const t = TONES[tone]
  const inner = (
    <>
      <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${t.dot}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-100">{item.name}</p>
        <p className="truncate font-mono text-[11px] text-slate-400">{item.detail}</p>
      </div>
      {item.chip && (
        <span className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${t.chip}`}>
          {item.chip}
        </span>
      )}
      {item.href && (
        <ArrowUpRight className="size-3.5 shrink-0 text-slate-500 transition-colors group-hover/item:text-cyan-400" />
      )}
    </>
  )
  const base = 'group/item flex items-start gap-3 rounded-xl border border-slate-800/80 bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-cyan-500/40 hover:bg-white/[0.04]'
  return item.href ? (
    <a href={item.href} target="_blank" rel="noreferrer noopener" className={base}>
      {inner}
    </a>
  ) : (
    <li className={base}>{inner}</li>
  )
}

function PrStatusBadge({ status }) {
  const merged = status === 'MERGED'
  const styles = merged
    ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
    : 'border-amber-400/30 bg-amber-500/10 text-amber-300'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${styles}`}
    >
      <span className={`size-1.5 rounded-full ${merged ? 'bg-emerald-400' : 'bg-amber-400'}`} />
      {status}
    </span>
  )
}

function PrLogCard({ pr }) {
  const merged = pr.status === 'MERGED'
  const accent = merged
    ? {
        impact: 'text-emerald-300',
        btn: 'border-emerald-500/40 hover:border-emerald-400 hover:text-emerald-300',
      }
    : {
        impact: 'text-cyan-300',
        btn: 'border-cyan-500/40 hover:border-cyan-400 hover:text-cyan-300',
      }

  return (
    <a
      href={pr.prUrl}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-[#0d121c] p-5 shadow-card backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="truncate font-mono text-[11px] text-slate-400">
          {pr.repo} · #{pr.prNumber}
        </span>
        <PrStatusBadge status={pr.status} />
        <span className="rounded-full border border-slate-700/60 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-slate-300">
          {pr.stats}
        </span>
      </div>
      <h4 className="text-[15px] font-semibold text-white">{pr.title}</h4>
      <div className="flex-1 space-y-3">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-red-400/80">The Problem</p>
          <p className="text-sm leading-relaxed text-slate-400">{pr.problem}</p>
        </div>
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-indigo-300/80">The Architecture & Solution</p>
          <p className="text-sm leading-relaxed text-slate-200">{pr.solution}</p>
        </div>
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">Quantified Impact</p>
          <p className={`text-sm font-medium leading-relaxed ${accent.impact}`}>{pr.impact}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {pr.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-slate-800 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors ${accent.btn}`}
        >
          Inspect PR & Code
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </a>
  )
}

function StageCard({ stage }) {
  const t = TONES[stage.tone]
  const Icon = stage.icon
  return (
    <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0d121c] p-5 shadow-card backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`grid size-10 place-items-center rounded-xl ring-1 ring-inset ${t.iconWrap}`}>
            <Icon className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-white">{stage.title}</h3>
            <p className={`text-[10px] uppercase tracking-wider ${t.meta}`}>{stage.meta}</p>
          </div>
        </div>
        <Beacon tone={stage.tone} />
      </div>
      <ul className="flex flex-1 flex-col gap-2.5">
        {stage.items.map((item) => (
          <StageItem key={item.name} item={item} tone={stage.tone} />
        ))}
      </ul>
    </div>
  )
}

export default function EngineeringRadar() {
  const { open_prs, runs_count, health, connected } = useLiveTelemetry()
  const { projects, personal } = data
  const upstream = [...projects.openSource]
    .sort((a, b) => (a.prState === 'open' ? 0 : 1) - (b.prState === 'open' ? 0 : 1))
    .map((pr) => ({ name: pr.name, detail: pr.description, chip: pr.prStateLabel, href: pr.github }))

  const stages = [
    {
      icon: Rocket,
      tone: 'cyan',
      title: 'In Flight',
      meta: 'active build · v0.2',
      items: [
        { name: 'MockForge Desktop v0.2', detail: 'Rust · Tauri v2 · SAPI speech bridge', chip: 'windows native', href: projects.systems[0].github },
        { name: 'Heuristic interview engine', detail: 'SPOF / cache-pressure analyzers on-device', chip: 'no egress' },
      ],
    },
    {
      icon: GitPullRequest,
      tone: 'amber',
      title: 'Under Upstream Review',
      meta: `${open_prs} open PRs · ${personal.ghStats.prsMerged} merged`,
      items: upstream,
    },
    {
      icon: ShieldCheck,
      tone: 'emerald',
      title: 'Shipped / Maintained',
      meta: connected ? 'live telemetry' : 'cached fallback',
      items: [
        { name: 'duck-diff CI/CD Engine', detail: `${runs_count.toLocaleString()} headless runs`, chip: health, href: projects.data[0].github },
        { name: 'sqlean-lint CLI', detail: 'local-first AST mutation CLI', chip: 'verified', href: projects.data[1].github },
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
          In flight, under upstream review, and shipping today — PR cards and telemetry refreshed from Phase 1 live extraction.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {stages.map((stage) => (
          <StageCard key={stage.title} stage={stage} />
        ))}
      </div>

      <div className="mt-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-emerald-400">
              <GitPullRequest className="size-3.5" />
              upstream engineering logs
            </p>
            <h3 className="text-xl font-bold tracking-tight text-white">Problem → Solution → Impact</h3>
          </div>
          <p className="max-w-sm text-sm text-slate-300">
            Full architectural breakdowns of every merge — reviewed PRs in amber, shipped in emerald.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {projects.openSource.map((pr) => (
            <PrLogCard key={pr.title} pr={pr} />
          ))}
        </div>
      </div>
    </section>
  )
}