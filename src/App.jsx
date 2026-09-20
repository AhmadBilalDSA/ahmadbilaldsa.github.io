import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, FileDown, Mail } from 'lucide-react'
import data from './data/portfolioData.json'
import FloatingHeader from './components/FloatingHeader'
import HeroSection from './components/HeroSection'
import CommandPalette from './components/CommandPalette'
import ResumeModal from './components/ResumeModal'
import TelemetryConsole from './components/TelemetryConsole'
import ProjectBento from './components/ProjectBento'
import ExperienceTimeline from './components/ExperienceTimeline'
import ArsenalTabs from './components/ArsenalTabs'
import LightweightSparkles from './components/LightweightSparkles'
import { GithubIcon, LinkedinIcon } from './components/BrandIcons'

function Footer() {
  const p = data.personal
  return (
    <footer className="border-t border-slate-800/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
        <div>
          <p className="text-sm font-semibold text-white">{p.name}</p>
          <p className="mt-1 font-mono text-xs text-slate-500">
            © {new Date().getFullYear()} · {p.location} · press&nbsp;<kbd>⌘K</kbd>&nbsp;anywhere
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={p.linkedinUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700/70 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-sky-500/50 hover:text-sky-400"
          >
            <LinkedinIcon className="size-4" />
            LinkedIn
          </a>
          <a
            href={p.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700/70 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
          >
            <GithubIcon className="size-4" />
            GitHub
          </a>
          <a
            href={`mailto:${p.email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700/70 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-emerald-500/50 hover:text-emerald-300"
          >
            <Mail className="size-4" />
            Email
          </a>
          <a
            href={p.cvPath}
            download
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-abyss transition-transform hover:-translate-y-0.5 hover:shadow-glow"
          >
            <FileDown className="size-4" />
            Download CV
            <ArrowUpRight className="size-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </footer>
  )
}

function Section({ children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55 }}
      className={`pb-20 sm:pb-28 ${className}`}
    >
      {children}
    </motion.section>
  )
}

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      } else if (e.key === 'Escape') {
        setPaletteOpen(false)
        setResumeOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div id="top" className="relative min-h-screen overflow-x-clip">
      {/* Zero-WebGL backdrop: slate dot-grid + upper ambient glow + 2D particle sparkles */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#07090e]">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute -top-48 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent blur-[130px]" />
        <LightweightSparkles className="h-full" />
      </div>

      <div className="relative z-10">
        <FloatingHeader
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenResume={() => setResumeOpen(true)}
        />

        <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
          <Section className="pt-6">
            <HeroSection onOpenResume={() => setResumeOpen(true)} />
          </Section>

          <Section>
            <TelemetryConsole />
          </Section>

          <Section>
            <ProjectBento />
          </Section>

          <Section className="pb-16">
            <ExperienceTimeline />
          </Section>

          <Section className="pb-16">
            <ArsenalTabs />
          </Section>
        </main>

        <Footer />
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenResume={() => {
          setPaletteOpen(false)
          setResumeOpen(true)
        }}
      />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  )
}