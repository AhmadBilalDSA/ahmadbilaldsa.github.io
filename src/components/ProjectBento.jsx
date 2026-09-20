import { ArrowUpRight, CircuitBoard, Database, GitPullRequest, History, Play, ShieldCheck } from 'lucide-react'
import data from '../data/portfolioData.json'
import TiltCard from './TiltCard'
import useLiveTelemetry from '../hooks/useLiveTelemetry'
import { GithubIcon } from './BrandIcons'
import { formatUTC } from '../lib/datetime'

const CATEGORY = {
  systems: {
    key: 'accent',
    label: 'Systems & Desktop',
    icon: CircuitBoard,
    glow: 'rgba(6,182,212,0.18)',
  },
  data: {
    key: 'sky',
    label: 'Data & Pipelines',
    icon: Database,
    glow: 'rgba(56,189,248,0.18)',
  },
  openSource: {
    key: 'mint',
    label: 'Open Source',
    icon: GitPullRequest,
    glow: 'rgba(16,185,129,0.18)',
  },
}

const ARCHITECTURE_TAGS = ['SPOF analyzer', 'Cache-pressure', 'Windows SAPI', 'Offline heuristic']

function ProjectViewport({ src, alt = 'Project preview', children = null }) {
  return (
    <div className="w-full h-40 sm:h-44 rounded-xl overflow-hidden border border-slate-800/80 bg-[#07090e] mb-4 relative group">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover object-center opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d121c] via-transparent to-transparent pointer-events-none" />
      {children}
    </div>
  )
}

function MockForgeMedia() {
  return (
    <ProjectViewport src="/projects/mockforge-preview.svg" alt="MockForge Studio system-design schematic">
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 p-3">
        {ARCHITECTURE_TAGS.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-cyan-400/30 bg-[#0d121c]/85 px-2.5 py-0.5 font-mono text-[10px] text-cyan-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </ProjectViewport>
  )
}

function DuckDiffTelemetry() {
  const { last_run, runs_count, open_prs, health, connected } = useLiveTelemetry()
  const rows = [
    { icon: Play, label: 'Total runs', value: runs_count.toLocaleString(), accent: 'text-cyan-300' },
    { icon: GitPullRequest, label: 'Active PRs', value: String(open_prs), accent: 'text-white' },
    {
      icon: ShieldCheck,
      label: 'Health',
      value: health,
      accent: connected ? 'text-emerald-300' : 'text-amber-300',
    },
    { icon: History, label: 'Last run', value: formatUTC(last_run), accent: 'text-slate-300' },
  ]
  return (
    <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-slate-800/80 bg-surface/90 card-bevel p-5 backdrop-blur-md transition-colors hover:border-sky-500/40">
      <ProjectViewport src="/projects/duckdiff-preview.svg" alt="duck-diff terminal diff output" />
      <span className="grid size-10 place-items-center rounded-xl bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/40">
        <Database className="size-5" />
      </span>
      <div>
        <h3 className="font-semibold text-white">duck-diff</h3>
        <p className="text-sm text-slate-300">Automated CI/CD data diffing · visual lineage</p>
      </div>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-700/70 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-300">
        <span
          className={`size-1.5 rounded-full ${connected ? 'animate-pulse-dot bg-emerald-400' : 'bg-amber-400'}`}
        />
        {connected ? 'Live pipeline' : 'Cached telemetry'}
      </span>
      <div className="mt-auto grid gap-1.5">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-white/[0.02] px-2.5 py-1.5"
          >
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <r.icon className="size-3.5" />
              {r.label}
            </span>
            <span className={`truncate font-mono text-sm font-semibold capitalize ${r.accent}`}>{r.value}</span>
          </div>
        ))}
      </div>
      <a
        href={data.projects.data[0].github}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-700/70 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-sky-500/50 hover:text-sky-300"
      >
        <GithubIcon className="size-4" />
        Source
        <ArrowUpRight className="size-3.5 opacity-60" />
      </a>
    </div>
  )
}

function PrStatePill({ state, label }) {
  const styles = {
    merged: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
    open: 'border-sky-400/30 bg-sky-500/10 text-sky-300',
    closed: 'border-slate-600/50 bg-white/[0.04] text-slate-400',
  }
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] ${styles[state] || styles.closed}`}>
      {label || state}
    </span>
  )
}

function UpstreamOss() {
  const prs = data.projects.openSource
  return (
    <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-slate-800/80 bg-surface/90 card-bevel p-5 backdrop-blur-md transition-colors hover:border-emerald-500/40 sm:p-6">
      <div className="flex items-start gap-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/40">
          <GitPullRequest className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-white">Upstream Open Source</h3>
          <p className="text-sm text-slate-300">Verified PRs across the ecosystem</p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {prs.map((pr) => (
          <a
            key={`${pr.name}-${pr.prStateLabel}`}
            href={pr.github}
            target="_blank"
            rel="noreferrer noopener"
            className="group flex items-center gap-2.5 rounded-xl border border-slate-800 bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-emerald-500/40 hover:bg-white/[0.04]"
          >
            <PrStatePill state={pr.prState} label={pr.prStateLabel} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-100">{pr.name}</span>
              <span className="block truncate text-xs text-slate-500">{pr.description}</span>
            </span>
            <ArrowUpRight className="size-3.5 shrink-0 text-slate-500 transition-colors group-hover:text-emerald-300" />
          </a>
        ))}
      </div>

      <p className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-800/80 pt-3 font-mono text-[11px] text-slate-500">
        <span className="text-emerald-300">{data.personal.ghStats.prsMerged} merged</span>
        <span className="text-cyan-300">{data.personal.ghStats.prsAuthored} PRs authored</span>
        <span>LangChain · SQLFluff · Ibis · Semantica · py-simple-wrap</span>
      </p>
    </div>
  )
}

export default function ProjectBento() {
  const [mockforge] = data.projects.systems
  const [, sqlean] = data.projects.data

  return (
    <div id="projects" className="scroll-mt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400">
            <CircuitBoard className="size-3.5" />
            04 / selected-work
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Cybernetic build matrix</h2>
        </div>
        <p className="max-w-sm text-sm text-slate-300">
          Real repos, live telemetry, and verified pull requests — no placeholder filler.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <TiltCard project={mockforge} category={CATEGORY.systems} featured featuredMedia={<MockForgeMedia />} />
        <TiltCard project={sqlean} category={CATEGORY.data} media={<ProjectViewport src="/projects/sqlean-preview.svg" alt="sqlean-lint AST transform" />} />
        <DuckDiffTelemetry />
        <UpstreamOss />
      </div>
    </div>
  )
}