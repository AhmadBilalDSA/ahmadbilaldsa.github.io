import { ArrowRight, FileText, MapPin, Sparkles } from 'lucide-react'
import data from '../data/portfolioData.json'
import { GithubIcon } from './BrandIcons'

const BADGES = ['Data Analyst & Systems Tooling Developer', 'Open Source Contributor', 'BI · SQL · Rust']

export default function HeroSection({ onOpenResume }) {
  const p = data.personal

  return (
    <section id="top" className="pt-6 sm:pt-8">
      <div className="flex flex-wrap items-center gap-2">
        {BADGES.map((badge) => (
          <span
            key={badge}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300"
          >
            <Sparkles className="size-3 text-cyan-400" />
            {badge}
          </span>
        ))}
      </div>

      <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-6xl">
        {p.name}
        <span className="text-shine animate-gradient-shift mt-2 block bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400">
          {p.title}.
        </span>
      </h1>

      <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-slate-300">
        {p.summary}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <a
          href="#projects"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-abyss transition-transform hover:-translate-y-0.5 hover:shadow-glow"
        >
          Explore projects
          <ArrowRight className="size-4" />
        </a>
        <button
          type="button"
          onClick={onOpenResume}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700/70 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
        >
          <FileText className="size-4" />
          View resume
        </button>
        <a
          href={p.githubUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub profile"
          className="grid size-9 place-items-center rounded-lg border border-slate-700/70 bg-white/[0.03] text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
        >
          <GithubIcon className="size-4" />
        </a>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-1.5 font-mono text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5 text-cyan-400" />
          {p.location}
        </span>
        <span>{p.ghStats.publicRepos} public repos</span>
        <span>{p.ghStats.prsMerged} PRs merged</span>
        <span>{p.ghStats.prsAuthored} PRs authored</span>
        <span>24/7 headless CI</span>
      </div>
    </section>
  )
}