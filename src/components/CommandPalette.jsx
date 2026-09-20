import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Braces,
  Check,
  Download,
  FileText,
  GitPullRequest,
  LayoutGrid,
  Mail,
  Search,
  Terminal,
  X,
} from 'lucide-react'
import data from '../data/portfolioData.json'
import { GithubIcon } from './BrandIcons'

function run(action, onClose) {
  if (typeof action === 'string') return action
  return action(onClose)
}

function buildItems(onOpenResume) {
  return [
    {
      group: 'Jump to',
      items: [
        {
          id: 'jump-projects',
          label: 'View Projects',
          hint: 'Bento project matrix',
          icon: LayoutGrid,
          run: () => '#projects',
        },
        {
          id: 'jump-telemetry',
          label: 'Open duck-diff Telemetry',
          hint: 'Live pipeline console',
          icon: Terminal,
          run: () => '#telemetry',
        },
        {
          id: 'jump-mockforge',
          label: 'Open MockForge Studio',
          hint: 'System design & AI interviewer',
          icon: Braces,
          run: () => data.projects.systems[0].github,
        },
        {
          id: 'jump-exit',
          label: 'Review Experience',
          hint: 'Roles & education',
          icon: FileText,
          run: () => '#experience',
        },
      ],
    },
    {
      group: 'Pull requests',
      items: [
        {
          id: 'pr-ibis',
          label: 'Ibis #12086',
          hint: 'Polars pl.Object → dt.Unknown — open',
          icon: GitPullRequest,
          run: () => 'https://github.com/ibis-project/ibis/pull/12086',
        },
        {
          id: 'pr-langchain',
          label: 'LangChain #40079',
          hint: 'VectorStore.add_texts integrity guards',
          icon: GitPullRequest,
          run: () => 'https://github.com/langchain-ai/langchain/pull/40079',
        },
        {
          id: 'pr-sqlfluff',
          label: 'SQLFluff #8396',
          hint: 'DuckDB SUMMARIZE keyword parity',
          icon: GitPullRequest,
          run: () => 'https://github.com/sqlfluff/sqlfluff/pull/8396',
        },
      ],
    },
    {
      group: 'Actions',
      items: [
        {
          id: 'copy-email',
          label: 'Copy Email',
          hint: data.personal.email,
          icon: Mail,
          run: (_c, _r) => {
            navigator.clipboard?.writeText(data.personal.email)
            return 'copy'
          },
        },
        {
          id: 'preview-resume',
          label: 'Preview Resume',
          hint: 'On-page print-ready document',
          icon: FileText,
          run: () => {
            onOpenResume()
            return null
          },
        },
        {
          id: 'open-resume',
          label: 'Open /resume Route',
          hint: data.personal.resumeUrl,
          icon: ArrowRight,
          run: () => data.personal.resumeUrl,
        },
        {
          id: 'download-cv',
          label: 'Download CV',
          hint: 'Ahmad-Bilal-CV.pdf',
          icon: Download,
          run: () => data.personal.cvPath,
        },
      ],
    },
  ]
}

export default function CommandPalette({ open, onClose, onOpenResume }) {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [active, setActive] = useState(0)
  const [prevOpen, setPrevOpen] = useState(open)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setQuery('')
      setActive(0)
    }
  }

  const allGroups = useMemo(() => buildItems(onOpenResume), [onOpenResume])
  const [filtered] = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return [allGroups]
    const result = allGroups
      .map((g) => ({
        ...g,
        items: g.items.filter((it) =>
          `${it.label} ${it.hint}`.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0)
    return [result]
  }, [query, allGroups])

  const filteredFlat = filtered.flatMap((g) => g.items)
  const safeActive = filteredFlat.length > 0 ? Math.min(active, filteredFlat.length - 1) : 0

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => {
      listRef.current
        ?.querySelector(`[data-index="${safeActive}"]`)
        ?.scrollIntoView?.({ block: 'nearest' })
    })
    return () => cancelAnimationFrame(id)
  }, [safeActive, open])

  const runActive = (index) => {
    const item = filteredFlat[index]
    if (!item) return
    const result = run(item.run, onClose)
    if (result === 'copy') {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        onClose()
      }, 650)
      return
    }
    onClose()
    if (typeof result === 'string') {
      if (result.startsWith('#')) {
        const target = document.querySelector(result)
        target?.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.open(result, '_blank', 'noreferrer noopener')
      }
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, filteredFlat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      runActive(safeActive)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <button
            type="button"
            aria-label="Close command palette"
            className="absolute inset-0 cursor-default bg-abyss/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0D1420]/95 shadow-card backdrop-blur-xl animate-scale-in"
            initial={{ scale: 0.97, opacity: 0, y: 6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 6 }}
            transition={{ duration: 0.14 }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-slate-800/80 px-4 py-3.5">
              <Search className="size-4 text-slate-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                placeholder="Type a command or search…"
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
              {copied ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                  <Check className="size-3.5" />
                  Copied
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="grid size-6 place-items-center rounded-md text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <div ref={listRef} className="max-h-[46vh] overflow-y-auto p-2">
              {filteredFlat.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-slate-500">
                  No match for “{query}”.
                </p>
              )}
              {filtered.map((group) => (
                <div key={group.group}>
                  <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/80">
                    {group.group}
                  </p>
                  {group.items.map((item) => {
                    const index = filteredFlat.indexOf(item)
                    const isActive = index === safeActive
                    return (
                      <button
                        type="button"
                        key={item.id}
                        data-index={index}
                        onMouseEnter={() => setActive(index)}
                        onClick={() => runActive(index)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          isActive
                            ? 'bg-cyan-500/10 ring-1 ring-inset ring-cyan-500/30'
                            : 'hover:bg-white/[0.04]'
                        }`}
                      >
                        <span
                          className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                            isActive
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-white/[0.04] text-slate-400'
                          }`}
                        >
                          <item.icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-slate-100">
                            {item.label}
                          </span>
                          <span className="block truncate text-xs text-slate-500">
                            {item.hint}
                          </span>
                        </span>
                        {isActive && (
                          <ArrowRight className="size-4 shrink-0 text-cyan-400" />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 px-4 py-2.5 text-[11px] text-slate-500">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd>↑</kbd>
                  <kbd>↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd>↵</kbd> open
                </span>
              </span>
              <span className="hidden items-center gap-1 sm:flex">
                <GithubIcon className="size-3.5" />
                github.com/AhmadBilalDSA
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}