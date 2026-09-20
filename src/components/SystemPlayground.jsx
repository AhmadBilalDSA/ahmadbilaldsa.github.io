import { useState } from 'react'
import { ChevronRight, ShieldAlert, Terminal, Zap } from 'lucide-react'
import { cn } from '../lib/utils'

const TABS = [
  { id: 'diff', label: 'duckdb-data-diff', icon: Terminal },
  { id: 'ast', label: 'ast-query-optimizer', icon: Zap },
  { id: 'sql', label: 'sql-injection-guard', icon: ShieldAlert },
]

function StatusLine({ sign, text, state }) {
  const colors = {
    ok: 'text-emerald-400',
    alert: 'text-rose-400',
    neutral: 'text-slate-400',
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4">
      <span className={cn('font-mono text-[13px]', colors[state])}>{text}</span>
      <span
        className={cn(
          'rounded-md border px-2 py-0.5 font-mono text-[10px] tracking-wider',
          state === 'ok'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
            : state === 'alert'
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
              : 'border-slate-700/60 bg-white/[0.03] text-slate-400',
        )}
      >
        {sign}
      </span>
    </div>
  )
}

function DiffScene() {
  return (
    <div className="space-y-3 whitespace-pre font-mono text-[13px] leading-relaxed text-slate-300">
      <p className="text-cyan-300">
        $ duck-diff --left prod_v1.parquet --right stage_v2.parquet
      </p>
      <p className="text-slate-500">
        [analysis] comparing 1,820 rows across 3 keys
        schema version 7 · prod.orders.pq → stg.orders.pq
      </p>
      <div className="space-y-1.5 py-1">
        <StatusLine sign="[OK]" text="  + 1,420 rows inserted    (new records)" state="ok" />
        <StatusLine sign="[ALERT]" text="  -    14 rows mutated     (drifted values)" state="alert" />
        <StatusLine sign="[OK]" text="  ~     0 rows deleted     (parity retained)" state="neutral" />
      </div>
      <p className="text-slate-500">
        [dispatch] CI/CD hook → status 200 · snapshot ar-t24-09a.parquet
      </p>
    </div>
  )
}

const UNOPTIMIZED_SQL = `SELECT order_id
FROM orders o
WHERE o.customer_id IN (
    SELECT customer_id
    FROM customers c
    WHERE c.segment = 'vip'
);`

const OPTIMIZED_SQL = `SELECT o.order_id
FROM orders o
JOIN LATERAL (
    SELECT customer_id
    FROM customers c
    WHERE c.segment = 'vip'
      AND c.id = o.customer_id
) c ON true;`

function AstScene() {
  const [optimized, setOptimized] = useState(false)
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[13px] text-slate-400">
          <span className="text-cyan-300">$ sqlean-lint --optimize</span> orders-by-segment.sql
        </p>
        <button
          type="button"
          onClick={() => setOptimized((v) => !v)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-colors',
            optimized
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400'
              : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:border-cyan-400',
          )}
        >
          <Zap className="size-3.5" />
          {optimized ? 'rewrite applied' : 'run optimizer'}
        </button>
      </div>

      <div className="space-y-3 whitespace-pre rounded-xl border border-slate-800 bg-abyss/70 p-4 font-mono text-[13px] leading-relaxed text-slate-300">
        {optimized ? OPTIMIZED_SQL : UNOPTIMIZED_SQL}
      </div>

      {optimized && (
        <div className="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
            AST nodes
          </p>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[12px]">
            {['SELECT', 'JOIN · LATERAL', 'SUBQUERY · FLATTENED', 'INDEX · SCAN'].map((node, i) => (
              <span key={node} className="flex items-center gap-2">
                <span className="rounded-md border border-slate-700/70 bg-white/[0.03] px-2 py-1 text-slate-200">
                  {node}
                </span>
                {i < 3 && <ChevronRight className="size-3.5 text-slate-600" />}
              </span>
            ))}
          </div>
          <p className="pt-1 font-mono text-[11px] text-amber-300">AST Mutation: Optimal — route validated</p>
        </div>
      )}
    </div>
  )
}

const ATTEMPT_1 = `cursor.execute(f"SELECT * FROM users WHERE id = {user_input}")`
const ATTEMPT_2_IDENT = `ident = whitelist.resolve('users:id')`
const ATTEMPT_2_EXEC = `cursor.execute(safe_query(ident), params={'value': user_input})`

function SqlScene() {
  return (
    <div className="space-y-4 whitespace-pre font-mono text-[13px] leading-relaxed">
      <div className="space-y-2 rounded-xl border border-rose-500/20 bg-rose-500/[0.05] p-4 text-slate-300">
        <p className="text-[10px] uppercase tracking-widest text-rose-400">attempt 1 · raw string interpolation</p>
        <p className="text-slate-400">{ATTEMPT_1}</p>
        <p className="text-rose-300">&gt;&gt;&gt; BLOCKED · identifier not whitelisted</p>
      </div>
      <div className="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4 text-slate-200">
        <p className="text-[10px] uppercase tracking-widest text-emerald-400">attempt 2 · whitelisted identifier</p>
        <p className="text-slate-400">{ATTEMPT_2_IDENT}</p>
        <p className="text-slate-400">{ATTEMPT_2_EXEC}</p>
        <p className="text-emerald-300">&gt;&gt;&gt; ALLOWED · py-simple-wrap #199 policy</p>
      </div>
      <p className="text-slate-500">policy: strict identifier whitelist · parameterized values · 52-test pytest harness</p>
    </div>
  )
}

const SCENES = {
  diff: <DiffScene />,
  ast: <AstScene />,
  sql: <SqlScene />,
}

export default function SystemPlayground() {
  const [tab, setTab] = useState('diff')

  return (
    <section id="playground" className="scroll-mt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400">
            <Terminal className="size-3.5" />
            03 / systems-playground
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Interactive system playground</h2>
        </div>
        <p className="max-w-sm text-sm text-slate-300">
          The internal toolchain in motion — diff engines, AST rewrites, and injection defenses running as live console sessions.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c1017] shadow-card backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-elevated/70 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-rose/70" />
            <span className="size-3 rounded-full bg-amber/70" />
            <span className="size-3 rounded-full bg-emerald-400/70" />
            <span className="ml-2 font-mono text-xs text-slate-500">ahmad@dev — system.playground</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">zsh · local · {tab}</span>
        </div>

        <div className="flex overflow-x-auto border-b border-slate-800/80">
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
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-500 hover:text-slate-200',
                )}
              >
                <Icon className="size-3.5" />
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="overflow-x-auto p-5 sm:p-6">
          <div className="animate-fade-up" key={tab}>
            {SCENES[tab]}
          </div>
        </div>
      </div>
    </section>
  )
}