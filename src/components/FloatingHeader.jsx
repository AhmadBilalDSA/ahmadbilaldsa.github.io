import { FileText, Search } from 'lucide-react'
import data from '../data/portfolioData.json'
import { GithubIcon, LinkedinIcon } from './BrandIcons'

const NAV = [
  { id: '#telemetry', label: 'Telemetry' },
  { id: '#projects', label: 'Projects' },
  { id: '#experience', label: 'Experience' },
]

export default function FloatingHeader({ onOpenPalette, onOpenResume }) {
  return (
    <header className="fixed inset-x-0 top-4 z-50 mx-auto max-w-4xl px-4">
      <div className="glass-bar flex items-center justify-between gap-3 rounded-2xl border border-slate-800/80 px-4 py-2.5 shadow-card sm:px-5">
        <div className="flex items-center gap-3">
          <a
            href={data.personal.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub avatar — AhmadBilalDSA"
            className="transition-transform hover:scale-105"
          >
            <img
              src={data.personal.avatarUrl}
              alt="Ahmad Bilal"
              width={36}
              height={36}
              loading="lazy"
              className="size-9 rounded-xl border border-cyan-500/40 object-cover shadow-glow"
            />
          </a>
          <span className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 text-sm font-extrabold text-cyan-300 ring-1 ring-cyan-500/30">
            AB
          </span>
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 md:inline-flex">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
            Open for Roles
          </span>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={item.id}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-cyan-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenPalette}
            className="hidden items-center gap-2 rounded-lg border border-slate-700/70 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-cyan-500/50 hover:text-cyan-300 sm:inline-flex"
            aria-label="Open command palette"
          >
            <Search className="size-3.5" />
            <span className="hidden md:inline">Search…</span>
            <kbd>⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={onOpenPalette}
            className="grid size-9 place-items-center rounded-lg border border-slate-700/70 bg-white/[0.03] text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-cyan-300 sm:hidden"
            aria-label="Open command palette"
          >
            <Search className="size-4" />
          </button>

          <a
            href={data.personal.linkedinUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn — AHMADBILALDES"
            className="grid size-9 place-items-center rounded-lg border border-slate-700/70 bg-white/[0.03] text-slate-300 transition-colors hover:border-sky-500/50 hover:text-sky-400"
          >
            <LinkedinIcon className="size-4" />
          </a>
          <a
            href={data.personal.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub profile"
            className="grid size-9 place-items-center rounded-lg border border-slate-700/70 bg-white/[0.03] text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
          >
            <GithubIcon className="size-4" />
          </a>
          <button
            type="button"
            onClick={onOpenResume}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 py-2 text-xs font-semibold text-abyss transition-transform hover:-translate-y-px hover:shadow-glow"
          >
            <FileText className="size-3.5" />
            <span className="hidden sm:inline">Resume</span>
          </button>
        </div>
      </div>
    </header>
  )
}