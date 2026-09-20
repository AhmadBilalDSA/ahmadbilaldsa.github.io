import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Braces, RefreshCw, ShieldAlert, Terminal } from 'lucide-react'
import data from '../data/portfolioData.json'
import { cn } from '../lib/utils'

const RAW_SQL = 'SELECT u.name FROM users u WHERE u.id IN (SELECT o.user_id FROM orders o WHERE o.total > 100)'

const AST_TREE = `[SelectNode]
 ├── [Projection]: users.name
 └── [JoinNode: INNER (LATERAL FLATTENED)]
      ├── [Target]: orders
      └── [Predicate]: orders.total > 100 (Indexed Scan)`

const SAMPLES = {
  normal: 'user_id = 42',
  malicious: '1; DROP TABLE users; --',
}

const TABS = [
  {
    id: 'diff',
    label: 'duck-diff (DuckDB Diff Engine)',
    icon: RefreshCw,
    repo: data.projects.data[0].github,
    prompt: 'duck-diff --base prod.parquet --target stage.parquet --keys id',
  },
  {
    id: 'ast',
    label: 'sqlean-lint (AST Query Linter)',
    icon: Braces,
    repo: data.projects.data[1].github,
    prompt: 'sqlean-lint --parse users-orders.sql --show-ast',
  },
  {
    id: 'sql',
    label: 'py-simple-wrap (SQL Injection Guard)',
    icon: ShieldAlert,
    repo: 'https://github.com/sara-czasak/py-simple-wrap',
    prompt: 'py-simple-wrap --cli evaluate payload',
  },
]

function TabHeader({ prompt, repo }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
      <p className="whitespace-pre font-mono text-[13px] leading-relaxed text-slate-400">{prompt}</p>
      <a
        href={repo}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1 rounded-md border border-slate-700/60 bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300/80 transition-colors hover:border-cyan-500/40 hover:text-cyan-200"
      >
        inspect repo
        <ArrowUpRight className="size-3" />
      </a>
    </div>
  )
}

function DiffView() {
  const [scanning, setScanning] = useState(false)
  const [rows, setRows] = useState({ inserted: 1420, deleted: 14, columns: 3 })
  const timer = useRef(null)

  const simulate = () => {
    if (scanning) return
    setScanning(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setRows({
        inserted: 1400 + Math.floor(Math.random() * 41),
        deleted: 10 + Math.floor(Math.random() * 9),
        columns: 1 + Math.floor(Math.random() * 5),
      })
      setScanning(false)
    }, 400)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <>
      <TabHeader prompt={TABS[0].prompt} repo={TABS[0].repo} />
      <div className="w-full touch-scroll rounded-lg">
        <div className="inline-block min-w-full space-y-2 rounded-xl border border-slate-800 bg-abyss/70 p-4 font-mono text-[11px] leading-relaxed sm:text-xs md:text-[13px]">
          <p className="text-emerald-300">
            + [INSERTED] {rows.inserted.toLocaleString()} rows (partition: 2026-09-Q3)
          </p>
          <p className="text-rose-300">- [DELETED] {rows.deleted} rows (keys mismatched in target)</p>
          <p className="text-amber-300">~ [MUTATED] {rows.columns} columns (price_index schema normalized)</p>
          <p className="pt-2 text-slate-500">
            {scanning ? '…re-scanning parquet footers' : `snapshot 2026-09-Q3 · fingerprint f${rows.inserted + rows.deleted}7a`}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={simulate}
          disabled={scanning}
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 font-mono text-xs font-semibold text-cyan-300 transition-colors hover:border-cyan-400 disabled:opacity-60"
        >
          <RefreshCw className={cn('size-3.5', scanning && 'animate-spin')} />
          {scanning ? 'Scanning…' : 'Simulate Rescan'}
        </button>
        <span className="font-mono text-[11px] text-slate-500">mock rescan · 400ms · random row variation</span>
      </div>
    </>
  )
}

function AstView() {
  const [mode, setMode] = useState('raw')
  const seg = 'rounded-md px-3.5 py-2 font-mono text-xs font-medium transition-colors'
  const active = 'bg-cyan-500/10 text-cyan-300 border-b-2 border-cyan-400 rounded-b-none'
  const idle = 'text-slate-500 hover:text-slate-200'

  return (
    <>
      <TabHeader prompt={TABS[1].prompt} repo={TABS[1].repo} />
      <div className="mb-4 inline-flex items-center gap-0.5 rounded-lg border border-slate-800 bg-white/[0.02] p-0.5">
        <button type="button" onClick={() => setMode('raw')} className={cn(seg, mode === 'raw' ? active : idle)}>
          Raw Unnested SQL
        </button>
        <button type="button" onClick={() => setMode('ast')} className={cn(seg, mode === 'ast' ? active : idle)}>
          Parsed AST Node Tree
        </button>
      </div>

      <div className="w-full touch-scroll rounded-lg">
        <div className="inline-block min-w-full whitespace-pre rounded-xl border border-slate-800 bg-abyss/70 p-4 font-mono text-[11px] leading-relaxed text-slate-300 sm:text-xs md:text-[13px]">
          {mode === 'raw' ? RAW_SQL : AST_TREE}
        </div>
      </div>

      {mode === 'ast' && (
        <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[11px] text-emerald-300">
          Rule AST-042: Subquery unnested to relational join (Execution ~4.2x faster)
        </p>
      )}
    </>
  )
}

function SqlView() {
  const [sample, setSample] = useState(null)

  return (
    <>
      <TabHeader prompt={TABS[2].prompt} repo={TABS[2].repo} />
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSample('normal')}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-xs transition-colors',
              sample === 'normal'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-700/70 bg-white/[0.03] text-slate-300 hover:border-emerald-500/40',
            )}
          >
            user_id = 42
          </button>
          <button
            type="button"
            onClick={() => setSample('malicious')}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-xs transition-colors',
              sample === 'malicious'
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                : 'border-slate-700/70 bg-white/[0.03] text-slate-300 hover:border-rose-500/40',
            )}
          >
            1; DROP TABLE users; --
          </button>
        </div>

        <div className="w-full touch-scroll rounded-lg">
          <div className="inline-block min-w-full whitespace-pre rounded-xl border border-slate-800 bg-abyss/70 p-4 font-mono text-[11px] leading-relaxed sm:text-xs md:text-[13px]">
            <p className="text-slate-500">
              input <span aria-hidden="true">→</span>{' '}
              <span className="text-slate-200">{sample ? SAMPLES[sample] : '— select an input sample —'}</span>
            </p>
            <p
              className={cn(
                'mt-3',
                sample === 'malicious' ? 'text-rose-300' : sample === 'normal' ? 'text-emerald-300' : 'text-slate-600',
              )}
            >
              {sample === 'malicious'
                ? '[SECURITY FAULT TRAPPED] Identifier whitelist violation. Input rejected before query compilation. (0 SQL Injection risk)'
                : sample === 'normal'
                  ? '[QUERY COMPILED] Parameterized prepared statement ready for execution.'
                : '[awaiting input …]'}
          </p>
          </div>
        </div>
      </div>
    </>
  )
}

const SCENES = {
  diff: <DiffView />,
  ast: <AstView />,
  sql: <SqlView />,
}

export default function SystemPlayground() {
  const [tab, setTab] = useState('diff')

  return (
    <section id="playground" className="scroll-mt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400">
            <Terminal className="size-3.5" />
            03 · SYSTEM ENGINE // IN-BROWSER PLAYGROUND
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Interactive Systems Playground</h2>
        </div>
        <p className="max-w-sm text-sm text-slate-300">
          Interactive simulation of automated telemetry, AST query compilation, and defensive database security.
        </p>
      </div>

      <div className="card-spotlight overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1017] shadow-card backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-elevated/70 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-rose/70" />
            <span className="size-3 rounded-full bg-amber/70" />
            <span className="size-3 rounded-full bg-emerald-400/70" />
            <span className="ml-2 font-mono text-xs text-slate-500">ahmad@dev — system.playground</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">zsh · local · {tab}</span>
        </div>

        <div className="mobile-touch-scroll flex overflow-x-auto border-b border-slate-800/80">
          {TABS.map((t) => {
            const active = tab === t.id
            const Icon = t.icon
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 font-mono text-xs font-medium transition-colors',
                  active
                    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-400'
                    : 'border-transparent text-slate-500 hover:text-slate-200',
                )}
              >
                <Icon className="size-3.5" />
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="p-5 sm:p-6">
          <div className="animate-fade-up" key={tab}>
            {SCENES[tab]}
          </div>
        </div>
      </div>
    </section>
  )
}