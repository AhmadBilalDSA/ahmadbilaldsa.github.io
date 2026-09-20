import { ArrowUpRight, Award, BookOpen, Briefcase, Building2, Calendar, CheckCircle2, GraduationCap } from 'lucide-react'
import data from '../data/portfolioData.json'
import { cn } from '../lib/utils'
import { openCaseStudy } from '../hooks/useCaseStudyDrawer'

function CardShell({ icon: Icon, label, accent = 'text-cyan-400' }) {
  return (
    <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-slate-400">
      <Icon className={cn('size-4', accent)} />
      {label}
    </p>
  )
}

export default function ExperienceTimeline() {
  return (
    <div id="experience" className="scroll-mt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400">
            <Briefcase className="size-3.5" />
            06 / background &amp; career
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Background &amp; Career
          </h2>
        </div>
        <p className="max-w-sm text-sm text-slate-300">
          Two years of production BI and instructor-led analytics training, backed by a finance degree and IBM.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {data.metrics.experience.map((exp) => (
          <div
            key={exp.role}
            className="rounded-2xl border border-slate-800/80 bg-surface/90 card-bevel p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40"
          >
            <div className="flex items-start justify-between gap-3">
              <CardShell icon={Building2} label={exp.organization} />
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-cyan-300">
                <Calendar className="size-3" />
                {exp.period}
              </span>
            </div>
            <p className="text-lg font-semibold text-white">{exp.role}</p>
            <ul className="mt-4 space-y-2.5">
              {exp.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-300">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
                  {point}
                </li>
              ))}
            </ul>
            {exp.caseStudyId && (
              <button
                type="button"
                onClick={() => openCaseStudy(exp.caseStudyId)}
                className="mt-5 inline-flex w-fit items-center gap-1.5 font-mono text-xs font-medium text-cyan-300 transition-colors hover:text-cyan-200"
              >
                View Case Study
                <ArrowUpRight className="size-3.5" />
              </button>
            )}
          </div>
        ))}

        <div className="rounded-2xl border border-slate-800/80 bg-surface/90 card-bevel p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40">
          <CardShell icon={GraduationCap} label="Education" accent="text-sky-400" />
          <p className="text-lg font-semibold text-white">{data.metrics.education.degree}</p>
          <p className="mt-1 text-sm text-slate-300">{data.metrics.education.school}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-sky-300">
            <Calendar className="size-3" />
            {data.metrics.education.graduation}
          </span>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.metrics.education.coursework.map((course) => (
              <span
                key={course}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300"
              >
                <BookOpen className="size-3 text-cyan-400" />
                {course}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-surface/90 card-bevel p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40">
          <CardShell icon={Award} label="Certifications" accent="text-emerald-400" />
          <ul className="space-y-3">
            {data.metrics.certifications.map((cert) => (
              <li key={cert} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                <span className="text-sm font-medium text-slate-100">{cert}</span>
              </li>
            ))}
            <li className="rounded-xl border border-slate-800 bg-white/[0.03] px-3 py-2.5 text-xs leading-relaxed text-slate-300">
              Python · SQL · Data Analysis · Predictive Modeling · Machine Learning workflows.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}