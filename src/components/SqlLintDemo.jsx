import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GitPullRequest, Play, RotateCcw } from 'lucide-react'

const DIRTY_SQL = `SELECT orders.id, orders.status, count(*) AS order_count
FROM orders INNER JOIN customers ON orders.customer_id = customers.id
WHERE orders.status IN ('completed','shipped') AND customers.region='EU'
GROUP BY orders.id, orders.status HAVING count(*) > 5
ORDER BY order_count DESC LIMIT 20`

const CLEAN_SQL = `-- sqlean-lint PRO · SQLGlot AST rewrite
SELECT
  o.id,
  o.status,
  count(*)  AS order_count
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.status IN ('completed', 'shipped')  AND c.region = 'EU'
GROUP BY
  o.id,
  o.status
HAVING count(*) > 5
ORDER BY order_count DESC
LIMIT 20`

const AST_NOTES = 'AST  select > join(inner) > where > group by > having > order by > limit'

const STEPS = [
  'parsing source text…',
  'building AST via SQLGlot…',
  'canonical re-write + alias inference…',
  'done — 12 tokens re-emitted',
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function SqlLintDemo() {
  const [phase, setPhase] = useState('idle') // idle | running | done
  const [step, setStep] = useState(0)

  const runLint = async () => {
    if (phase === 'running') return
    setPhase('running')
    setStep(0)
    for (let i = 0; i < STEPS.length; i += 1) {
      setStep(i)
      await delay(360)
    }
    setPhase('done')
  }

  const reset = () => {
    setPhase('idle')
    setStep(0)
  }

  return (
    <section className="h-full rounded-2xl border border-slate-800/80 bg-surface/90 p-5 shadow-card backdrop-blur-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
            <GitPullRequest className="size-3.5" />
            sqlean-lint PRO — live demo
          </p>
          <p className="mt-1.5 text-sm text-slate-300">
            Unformatted SQL in, AST-optimized SQL out. Press Run Lint.
          </p>
        </div>
        <AnimatePresence mode="wait">
          {phase === 'done' ? (
            <motion.button
              key="reset"
              type="button"
              onClick={reset}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-emerald-500/50 hover:text-emerald-300"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </motion.button>
          ) : (
            <motion.button
              key="run"
              type="button"
              onClick={runLint}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              disabled={phase === 'running'}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-3.5 py-2 text-xs font-semibold text-abyss transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Play className="size-3.5" />
              Run Lint
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-abyss/70">
        <div className="flex items-center gap-2 border-b border-slate-800 bg-elevated/70 px-3 py-2">
          <span className="size-2.5 rounded-full bg-rose/70" />
          <span className="size-2.5 rounded-full bg-amber/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 font-mono text-[11px] text-slate-500">src/query.sql</span>
        </div>

        <div className="min-h-[248px] p-4 font-mono text-[12px] leading-relaxed sm:text-[12.5px]">
          {phase === 'idle' && (
            <pre className="whitespace-pre-wrap text-amber-300/90">{DIRTY_SQL}</pre>
          )}

          {phase === 'running' && (
            <div className="space-y-1.5 text-slate-300">
              {STEPS.slice(0, step + 1).map((line, i) => (
                <p key={line} className={i < step ? 'text-slate-500' : 'text-cyan-300'}>
                  <span className="mr-2 text-slate-600">&gt;</span>
                  {line}
                  {i === step && (
                    <span className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 animate-blink bg-cyan-400" />
                  )}
                </p>
              ))}
            </div>
          )}

          {phase === 'done' && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <pre className="whitespace-pre-wrap text-emerald-300/95">{CLEAN_SQL}</pre>
              <p className="mt-3 border-t border-slate-800 pt-2 font-mono text-[11px] text-cyan-400/90">
                {AST_NOTES}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}