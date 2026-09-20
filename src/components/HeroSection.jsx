import { ArrowRight, FileText, MapPin, Radio, Zap } from 'lucide-react'
import data from '../data/portfolioData.json'
import useLiveTelemetry from '../hooks/useLiveTelemetry'
import { formatUTC } from '../lib/datetime'
import { GithubIcon } from './BrandIcons'

const AVATAR_SPEC = 'https://avatars.githubusercontent.com/u/148782991'
const AVATAR_VERIFIED = 'https://avatars.githubusercontent.com/u/315737484?v=4'

const KEYWORD_CHIPS = ['High-throughput SQL', 'AST analysis', 'Automated telemetry', 'Native desktop systems']

function HeroTelemetry() {
  const { last_run, runs_count, open_prs, health, connected } = useLiveTelemetry()

  const stats = [
    { label: 'Last auto sync', value: formatUTC(last_run) },
    { label: 'Automated runs', value: runs_count.toLocaleString() },
    { label: 'Active upstream PRs', value: String(open_prs) },
    { label: 'Pipeline health', value: health, live: true },
  ]

  return (
    <div className="mt-10">
      <p className="mb-3 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
        <Radio className="size-3.5 text-cyan-400" />
        live duck-diff telemetry
        <span className={connected ? 'text-emerald-300' : 'text-amber-300'}>
          {connected ? '· live' : '· cached'}
        </span>
      </p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-800/80 bg-[#0d121c]/90 px-4 py-3 text-left shadow-card"
          >
            <p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{s.label}</p>
            <p className="mt-1.5 flex items-center gap-2 font-mono text-sm font-semibold text-white sm:text-base">
              {s.live && <span className="size-1.5 shrink-0 animate-pulse-dot rounded-full bg-emerald-400" />}
              <span
                className={
                  s.live
                    ? connected
                      ? 'capitalize text-emerald-300'
                      : 'capitalize text-amber-300'
                    : 'truncate'
                }
              >
                {s.value}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HeroSection({ onOpenResume }) {
  const p = data.personal

  const onAvatarError = (e) => {
    if (e.currentTarget.getAttribute('data-fallback')) return
    e.currentTarget.setAttribute('data-fallback', '1')
    e.currentTarget.src = AVATAR_VERIFIED
  }

  return (
    <section id="top" className="pt-6 sm:pt-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative group mx-auto w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-500/50 via-indigo-500/30 to-transparent shadow-[0_0_40px_-8px_rgba(6,182,212,0.35)]">
          <div aria-hidden="true" className="border-beam absolute -inset-2 rounded-2xl opacity-80" />
          <img
            src={AVATAR_SPEC}
            onError={onAvatarError}
            alt="Ahmad Bilal — profile portrait"
            width={128}
            height={128}
            className="relative w-full h-full object-cover object-top rounded-2xl filter contrast-[1.05] brightness-95 group-hover:brightness-105 transition-all duration-300"
          />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
          <span aria-hidden="true" className="absolute -bottom-1 -right-1 flex size-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex size-3.5 rounded-full bg-emerald-400 ring-2 ring-[#07090e]" />
          </span>
        </div>

        <span className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 py-1.5 pl-3 pr-4 text-sm font-medium text-emerald-100">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          Ahmad Bilal · Open to Roles · Lahore, PK
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-6xl">
          {p.name}
          <span className="text-shine animate-gradient-shift mt-2 block bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400">
            {p.title}.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-slate-300">{p.summary}</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {KEYWORD_CHIPS.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-300"
            >
              <Zap className="size-3" />
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-abyss transition-transform hover:-translate-y-0.5 hover:shadow-glow"
          >
            Explore Projects
            <ArrowRight className="size-4" />
          </a>
          <button
            type="button"
            onClick={onOpenResume}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-200"
          >
            <FileText className="size-4" />
            View Verified CV
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

        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 font-mono text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 text-cyan-400" />
            {p.location}
          </span>
          <span>{p.ghStats.publicRepos} public repos</span>
          <span>{p.ghStats.prsMerged} PRs merged</span>
          <span>{p.ghStats.prsAuthored} PRs authored</span>
          <span>24/7 headless CI</span>
        </p>

        <HeroTelemetry />
      </div>
    </section>
  )
}