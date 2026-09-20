import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, FileText, Printer, X } from 'lucide-react'
import data from '../data/portfolioData.json'
import ResumeDocument from './ResumeDocument'

export default function ResumeModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    document.body.classList.add('print-resume')
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('print-resume')
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label="ATS resume drawer"
        >
          <button
            type="button"
            aria-label="Close resume"
            className="absolute inset-0 cursor-default bg-abyss/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden border-l border-slate-800/80 bg-[#0E1420] shadow-card"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34, mass: 0.9 }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-3 sm:px-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-100">
                <FileText className="size-4 text-cyan-400" />
                Resume
                <span className="hidden rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-300 sm:inline">
                  ATS
                </span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
                >
                  <Printer className="size-3.5" />
                  Print / Save PDF
                </button>
                <a
                  href={data.personal.resumeUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-emerald-500/50 hover:text-emerald-300"
                >
                  Standalone
                  <ExternalLink className="size-3" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="grid size-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-100"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto overscroll-contain">
              <ResumeDocument />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}