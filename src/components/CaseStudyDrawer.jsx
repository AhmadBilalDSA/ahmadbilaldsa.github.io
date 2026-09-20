import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Cpu, Layers, TrendingUp, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useCaseStudyDrawer } from '../hooks/useCaseStudyDrawer'

function SectionTitle({ icon: Icon, children, accent = 'text-cyan-400' }) {
  return (
    <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
      <Icon className={cn('size-3.5', accent)} />
      {children}
    </p>
  )
}

export default function CaseStudyDrawer() {
  const { study, close } = useCaseStudyDrawer()

  useEffect(() => {
    if (!study) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [study, close])

  return (
    <AnimatePresence>
      {study && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={study.title}
            className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto custom-scrollbar border-l border-slate-800 bg-[#0a0e17] p-5 text-slate-200 shadow-2xl sm:max-w-2xl sm:p-8 md:p-10 lg:max-w-3xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-400">
                  deep-dive · case study breakdown
                </p>
                <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                  {study.title}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-cyan-300">
                    {study.role}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-slate-700/70 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-slate-300">
                    {study.timeline}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close case study"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-8 space-y-8">
              <div>
                <SectionTitle icon={Activity}>The Bottleneck &amp; Context</SectionTitle>
                <p className="break-words text-xs leading-relaxed text-slate-300 sm:text-sm md:text-base">{study.challenge}</p>
              </div>

              <div>
                <SectionTitle icon={Layers}>Architectural Pipeline</SectionTitle>
                <div className="relative overflow-x-auto rounded-xl border border-slate-800 bg-[#07090e] card-bevel p-4 max-w-full sm:p-5">
                  <span className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-cyan-400/80 via-cyan-400/30 to-transparent" />
                  <p className="break-words whitespace-pre-wrap font-mono text-xs leading-relaxed text-cyan-300 sm:text-sm">
                    {study.architecture}
                  </p>
                </div>
              </div>

              <div>
                <SectionTitle icon={TrendingUp} accent="text-emerald-400">
                  Quantified Impact
                </SectionTitle>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {study.metrics.map((metric) => (
                    <div
                      key={metric}
                      className="flex flex-col justify-between rounded-xl border border-emerald-500/20 bg-[#0d121c] card-bevel p-4"
                    >
                      <p className="break-words text-xs font-medium leading-snug text-emerald-300 sm:text-sm">{metric}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle icon={Cpu}>Core Technology Stack</SectionTitle>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {study.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-cyan-500/20 bg-cyan-950/40 px-3 py-1 font-mono text-xs text-cyan-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {study.highlights && (
                <div className="break-words rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
                  <p className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-cyan-300">
                    Engineering Highlight
                  </p>
                  {study.highlights}
                </div>
              )}

              <p className="pt-2 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-slate-600">
                · end of case study ·
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}