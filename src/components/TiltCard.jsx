import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { GithubIcon } from './BrandIcons'
import { openCaseStudy } from '../hooks/useCaseStudyDrawer'

const badgeStyles = {
  accent: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20',
  sky: 'bg-sky-500/10 text-sky-300 border border-sky-500/20',
  mint: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
}

const prStateStyles = {
  merged: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
  open: 'border-sky-400/30 bg-sky-500/10 text-sky-300',
  closed: 'border-slate-600/50 bg-white/[0.04] text-slate-400',
}

const prStateLabel = {
  merged: 'Merged',
  open: 'Open',
  closed: 'Contributed',
}

function PrStatePill({ state, label }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${prStateStyles[state]}`}
    >
      <span
        className={`size-1.5 rounded-full ${
          state === 'merged' ? 'bg-emerald-400' : state === 'open' ? 'bg-sky-400' : 'bg-slate-400'
        }`}
      />
      {label || prStateLabel[state]}
    </span>
  )
}

export default function TiltCard({ project, category, featured = false, featuredMedia = null, media = null, caseStudyId = null }) {
  const cx = useMotionValue(0.5)
  const cy = useMotionValue(0.5)

  const spring = { stiffness: 260, damping: 24, mass: 0.6 }

  const rotateY = useSpring(useTransform(cx, [0, 1], [-7, 7]), spring)
  const rotateX = useSpring(useTransform(cy, [0, 1], [7, -7]), spring)

  const transform = useMotionTemplate`perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

  const glareX = useTransform(cx, (v) => `${v * 100}%`)
  const glareY = useTransform(cy, (v) => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(620px circle at ${glareX} ${glareY}, ${category.glow}, transparent 62%)`

  const tint = badgeStyles[category.key]

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    cx.set((e.clientX - rect.left) / rect.width)
    cy.set((e.clientY - rect.top) / rect.height)
  }

  const handleLeave = () => {
    cx.set(0.5)
    cy.set(0.5)
  }

  return (
    <motion.div
      className={`group relative h-full card-3d ${featured ? 'lg:col-span-2' : ''}`}
      style={{ transform }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-slate-800/80 bg-surface/90 card-bevel backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40">
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -inset-x-24 -top-px h-px animate-shine bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        {featured && featuredMedia ? (
          <div className="relative flex flex-col p-5 sm:p-6">
            {featuredMedia}
            <div className="flex min-w-0 flex-col gap-4">
              <CardHead project={project} category={category} tint={tint} />
              <p className="text-sm leading-relaxed text-slate-300">{project.description}</p>
              <CardFooter project={project} tint={tint} caseStudyId={caseStudyId} />
            </div>
          </div>
        ) : media ? (
          <div className="relative flex h-full flex-col p-5 sm:p-6 [transform:translateZ(24px)]">
            {media}
            <div className="flex min-w-0 flex-col gap-4">
              <CardHead project={project} category={category} tint={tint} />
              <p className="text-sm leading-relaxed text-slate-300">{project.description}</p>
              <CardFooter project={project} tint={tint} />
            </div>
          </div>
        ) : (
          <div className="relative flex h-full flex-col gap-4 p-5 sm:p-6 [transform:translateZ(24px)]">
            <CardHead project={project} category={category} tint={tint} />
            <p className="text-sm leading-relaxed text-slate-300">{project.description}</p>
            <CardFooter project={project} tint={tint} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

function CardHead({ project, category, tint }) {
  return (
    <>
      <div className="flex items-start gap-3.5">
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ring-1 ${tint}`}>
          <category.icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-white">{project.name}</h3>
          <p className="text-sm text-slate-300">{project.tagline}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-300">
          {category.label}
        </span>
        {project.prState ? (
          <PrStatePill state={project.prState} label={project.prStateLabel} />
        ) : project.live ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
            Live
          </span>
        ) : null}
      </div>
    </>
  )
}

function CardFooter({ project, tint, caseStudyId = null }) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <Badge key={t} className={tint}>
            {t}
          </Badge>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2">
        {caseStudyId && (
          <button
            type="button"
            onClick={() => openCaseStudy(caseStudyId)}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-sm font-medium text-cyan-300 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/20"
          >
            Case Study Breakdown
            <ArrowUpRight className="size-3.5 opacity-80" />
          </button>
        )}
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700/70 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors duration-300 hover:border-cyan-500/50 hover:bg-white/[0.06] hover:text-cyan-300"
        >
          <GithubIcon className="size-4" />
          {project.prState ? 'Pull request' : 'Source'}
          <ArrowUpRight className="size-3.5 opacity-60" />
        </a>
      </div>
    </>
  )
}

function Badge({ className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] font-medium ${className}`}
    >
      {children}
    </span>
  )
}