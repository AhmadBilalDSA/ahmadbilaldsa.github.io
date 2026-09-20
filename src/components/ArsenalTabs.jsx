import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Atom,
  Boxes,
  Braces,
  ChartNoAxesColumn,
  CircuitBoard,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Table2,
  Terminal,
  Wrench,
} from 'lucide-react'
import data from '../data/portfolioData.json'
import SqlLintDemo from './SqlLintDemo'
import TelemetryOrb from './TelemetryOrb'

const TABS = [
  { id: 'coreLanguages', label: 'Core Languages' },
  { id: 'biAnalytics', label: 'BI & Analytics' },
  { id: 'infrastructure', label: 'Infrastructure & Automation' },
]

const ARSENAL_ICONS = {
  braces: Braces,
  code: Code2,
  wrench: Wrench,
  react: Atom,
  chart: ChartNoAxesColumn,
  sheet: Table2,
  boxes: Boxes,
  git: GitBranch,
  branch: GitBranch,
  duckdb: Database,
  cpu: Cpu,
  terminal: Terminal,
  globe: Globe,
}

export default function Arsenal() {
  const [tab, setTab] = useState(TABS[0].id)
  const tools = data.arsenal[tab]

  return (
    <div id="arsenal" className="scroll-mt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
            <CircuitBoard className="size-3.5" />
            05 / toolkit
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Technical Arsenal
          </h2>
        </div>
        <p className="max-w-sm text-sm text-slate-300">
          Tab into the stack behind pipeline-heavy analytics, AST tooling, and native desktop builds.
        </p>
      </div>

      <div className="mb-6 inline-flex items-center gap-1 rounded-xl border border-slate-800/80 bg-surface/70 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-lg bg-cyan-500/10 ring-1 ring-inset ring-cyan-500/30"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {tools.map((tool) => {
          const Icon = ARSENAL_ICONS[tool.icon] || Wrench
          return (
            <div
              key={`${tab}-${tool.label}`}
              className="group flex items-center gap-4 rounded-xl border border-slate-800/80 bg-surface/90 p-4 transition-colors hover:border-cyan-500/40"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/30 transition-transform group-hover:scale-105">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{tool.label}</p>
                <p className="truncate text-xs text-slate-300">{tool.detail}</p>
              </div>
            </div>
          )
        })}
      </motion.div>

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