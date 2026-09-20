import { Braces, ChartNoAxesColumn, CircuitBoard, Database } from 'lucide-react'
import SqlLintDemo from './SqlLintDemo'
import TelemetryOrb from './TelemetryOrb'

const TIERS = [
  {
    id: 'engine',
    icon: Database,
    accent: 'bg-cyan-500/10 text-cyan-300 ring-cyan-400/40',
    label: 'Engine & Ingestion',
    detail: 'Columnar storage, streaming membranes, and the data-defense layer',
    items: ['PostgreSQL', 'DuckDB', 'Polars', 'Apache Arrow', 'Python'],
  },
  {
    id: 'ast',
    icon: Braces,
    accent: 'bg-violet-500/10 text-violet-300 ring-violet-400/40',
    label: 'AST, Systems & Compilers',
    detail: 'SQL grammars, linters, and native Tauri runtimes',
    items: ['SQLGlot', 'SQLFluff', 'Rust / Tauri v2', 'Pytest'],
  },
  {
    id: 'delivery',
    icon: ChartNoAxesColumn,
    accent: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/40',
    label: 'Delivery & Intelligence',
    detail: 'Semantic BI models, vector memory, and automated release rails',
    items: ['Power BI (DAX / Modeling)', 'Vector Stores (FAISS / LangChain)', 'GitHub Actions CI/CD'],
  },
]

export default function Arsenal() {
  return (
    <div id="arsenal" className="scroll-mt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400">
            <CircuitBoard className="size-3.5" />
            05 / toolkit
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Technical Arsenal
          </h2>
        </div>
        <p className="max-w-sm text-sm text-slate-300">
          The architectural stack — three functional tiers from raw engines to delivery rails.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-800/80 bg-surface/90 card-bevel p-5 backdrop-blur-md transition-colors hover:border-cyan-500/40"
          >
            <div className="flex items-center gap-3">
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset ${tier.accent}`}>
                <tier.icon className="size-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-white">{tier.label}</h3>
                <p className="text-[11px] text-slate-400">{tier.detail}</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {tier.items.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-white/[0.03] px-3 py-2 font-mono text-xs text-slate-200 transition-colors group-hover:border-slate-700"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-current opacity-60" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SqlLintDemo />
        </div>
        <div className="lg:col-span-2">
          <TelemetryOrb />
        </div>
      </div>
    </div>
  )
}