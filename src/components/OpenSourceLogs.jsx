import { ArrowUpRight, GitPullRequest } from 'lucide-react'
import data from '../data/portfolioData.json'

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
      className="group flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-[#0d121c] card-bevel p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40"
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
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-red-400/80">The Problem</p>
          <p className="text-sm leading-relaxed text-slate-400">{pr.problem}</p>
        </div>
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-indigo-300/80">The Architecture & Solution</p>
          <p className="text-sm leading-relaxed text-slate-200">{pr.solution}</p>
        </div>
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">Quantified Impact</p>
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

export default function OpenSourceLogs() {
  return (
    <section id="oss-logs" className="scroll-mt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400">
            <GitPullRequest className="size-3.5" />
            05 / upstream-logs
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Open Source engineering logs</h2>
        </div>
        <p className="max-w-sm text-sm text-slate-300">
          Full architectural breakdowns of every merge — reviewed PRs in amber, shipped in emerald.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {data.projects.openSource.map((pr) => (
          <PrLogCard key={pr.title} pr={pr} />
        ))}
      </div>
    </section>
  )
}