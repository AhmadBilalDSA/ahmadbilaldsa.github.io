import { Award, Building2, CheckCircle2, Download, ExternalLink, FileText, Workflow } from 'lucide-react'
import data from '../data/portfolioData.json'
import { GithubIcon, LinkedinIcon } from './BrandIcons'

const ARSENAL_TITLES = {
  coreLanguages: 'Core Languages',
  biAnalytics: 'BI & Analytics',
  infrastructure: 'Infrastructure & Automation',
}

const PR_LINKS = [
  { state: 'open', repo: 'Ibis', pr: '#12086', url: 'https://github.com/ibis-project/ibis/pull/12086', note: 'Polars type to_ibis' },
  { state: 'authored', repo: 'SQLGlot', pr: '#8257', url: 'https://github.com/tobymao/sqlglot/pull/8257', note: 'DuckDB array AST nodes' },
  { state: 'authored', repo: 'SymPy', pr: '#30384', url: 'https://github.com/sympy/sympy/pull/30384', note: 'Decorator typing' },
  { state: 'merged', repo: 'HFlow', pr: '#281', url: 'https://github.com/Hebbian-Robotics/hflow/pull/281', note: 'Curation rules' },
  { state: 'merged', repo: 'SciTeX-io', pr: '#166', url: 'https://github.com/scitex-ai/scitex-io/pull/166', note: 'Feather I/O hardening' },
]

function stateClass(state) {
  if (state === 'merged') return 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
  if (state === 'open') return 'border-sky-400/40 bg-sky-500/10 text-sky-300'
  return 'border-slate-600/50 bg-white/[0.04] text-slate-400'
}

function Section({ label, children }) {
  return (
    <section className="mb-6 last:mb-0">
      <h2 className="mb-3 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
        <span className="size-1.5 rounded-full bg-cyan-400" />
        {label}
      </h2>
      {children}
    </section>
  )
}

export default function ResumeDocument() {
  const p = data.personal

  return (
    <div className="print-resume-area">
      <header className="border-b border-slate-800/80 px-6 py-6 sm:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Ahmad Bilal
        </h1>
        <p className="mt-1 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-[15px] font-medium text-transparent">
          Data Analyst &amp; Systems Tooling Developer
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-[13px] text-slate-400">
          <span>Lahore, Pakistan</span>
          <a className="inline-flex items-center gap-1.5 transition-colors hover:text-cyan-300" href={p.linkedinUrl} target="_blank" rel="noreferrer noopener">
            <LinkedinIcon className="size-3.5" /> linkedin.com/in/AHMADBILALDES
          </a>
          <a className="inline-flex items-center gap-1.5 transition-colors hover:text-cyan-300" href={p.githubUrl} target="_blank" rel="noreferrer noopener">
            <GithubIcon className="size-3.5" /> github.com/AhmadBilalDSA
          </a>
          <a className="inline-flex items-center gap-1.5 transition-colors hover:text-cyan-300" href={`mailto:${p.email}`}>
            <FileText className="size-3.5" /> {p.email}
          </a>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            ['47', 'public repos'],
            ['53', 'PRs authored'],
            ['24', 'merged'],
            ['13', 'open'],
          ].map(([n, label]) => (
            <span key={label} className="rounded-full border border-slate-700/70 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-slate-400">
              <b className="font-semibold text-cyan-300">{n}</b> {label}
            </span>
          ))}
        </div>
      </header>

      <div className="grid gap-8 px-6 py-6 sm:px-8 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <Section label="Technical Summary">
            <p className="text-sm leading-relaxed text-slate-300">
              Data Analyst and systems developer specializing in high-throughput SQL, AST analysis,
              automated data diffing pipelines, and native desktop systems. Verified by 24 merged
              pull requests across SQLGlot, HFlow, SciTeX-io, dbt-duckdb, and tidb, plus 47 public
              repositories.
            </p>
          </Section>

          <Section label="Engineering Projects">
            <div className="space-y-5">
              <ProjectRow
                name="MockForge"
                stack="Rust · Tauri v2 · React Flow · TS · Tailwind"
                points={[
                  'Native AI mock interview simulator & interactive system design workbench.',
                  'Offline heuristic feedback with zero cloud latency; SPOF / cache-pressure analyzer on canvas.',
                  'Windows SAPI speech integration for on-device voice.',
                ]}
              />
              <ProjectRow
                name="duck-diff"
                stack="DuckDB · Python · GitHub Actions · Discord Webhooks"
                points={[
                  'Automated data diff pipeline & visual lineage engine with constant-memory reconciliation.',
                  'Headless CI/CD telemetry tracking and automated regression detection across pipelines.',
                  'Scheduled daily health dispatch; live telemetry feeds the portfolio console.',
                ]}
              />
              <ProjectRow
                name="sqlean-lint PRO"
                stack="Python · SQLGlot · AST parsing · CustomTkinter"
                points={[
                  'Local-first SQL static analysis & AST mutation CLI.',
                  'Multi-dialect linting, query tree inspection, and automated anti-pattern rewrites.',
                ]}
              />
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[15px] font-semibold text-white">Upstream Open Source</h3>
                  <span className="font-mono text-[11px] text-white0">53 PRs · 24 merged · 13 open</span>
                </div>
                <ul className="mt-3 grid gap-2">
                  {PR_LINKS.map((pr) => (
                    <li key={`${pr.repo}-${pr.pr}`} className="flex flex-wrap items-center gap-2 text-[13px] text-slate-300">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] ${stateClass(pr.state)}`}>
                        {pr.state}
                      </span>
                      <a className="font-medium text-cyan-300 transition-colors hover:text-cyan-200" href={pr.url} target="_blank" rel="noreferrer noopener">
                        {pr.repo} {pr.pr}
                      </a>
                      <span className="text-white0">— {pr.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          <Section label="Professional Experience">
            <div className="space-y-5">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[15px] font-semibold text-white">Power BI &amp; Analytics Trainer</h3>
                  <span className="font-mono text-[11px] text-white0">PNY Trainings / NAVTTC · 2026</span>
                </div>
                <ul className="mt-2.5 space-y-2 text-[13px] leading-relaxed text-slate-300">
                  <li className="flex gap-2.5"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />Instructed Star Schema dimensional modeling, advanced DAX measures, and Power Query ETL pipelines.</li>
                  <li className="flex gap-2.5"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />Delivered end-to-end business intelligence and data analytics training to NAVTTC cohorts.</li>
                  <li className="flex gap-2.5"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />Turned real-world finance datasets into hands-on Power BI labs and graded assessments.</li>
                </ul>
              </div>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[15px] font-semibold text-white">Junior Data Scientist &amp; Analyst</h3>
                  <span className="font-mono text-[11px] text-white0">Timmy's Pizza · 2024 - 2026</span>
                </div>
                <ul className="mt-2.5 space-y-2 text-[13px] leading-relaxed text-slate-300">
                  <li className="flex gap-2.5"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />Automated operational telemetry, inventory forecasting, and data audits using Python, SQL, and Excel.</li>
                  <li className="flex gap-2.5"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />Built operational reporting pipelines, sales performance metrics, and scheduled reporting.</li>
                  <li className="flex gap-2.5"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />Designed star-schema models and DAX measures feeding executive Power BI dashboards.</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section label="Education">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[15px] font-semibold text-white">BS (Hons) Accounting &amp; Finance</h3>
              <span className="font-mono text-[11px] text-white0">Graduated {data.metrics.education.graduation}</span>
            </div>
            <p className="mt-1 inline-flex items-center gap-2 text-[13px] text-slate-400">
              <Building2 className="size-4" />
              {data.metrics.education.school}
            </p>
            <p className="mt-2 text-[13px] text-white0">
              Coursework: {data.metrics.education.coursework.join(' · ')}.
            </p>
          </Section>
        </div>

        <aside className="space-y-6">
          <Section label="Arsenal">
            <div className="space-y-4">
              {Object.entries(ARSENAL_TITLES).map(([key, title]) => (
                <div key={key}>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white0">
                    {title}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.arsenal[key].map((tool) => (
                      <span key={tool.label} className="rounded-full border border-cyan-400/30 bg-cyan-500/5 px-2.5 py-1 font-mono text-[11px] text-cyan-300">
                        {tool.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section label="Certifications">
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-white/[0.03] px-3 py-2.5 text-[13px] text-slate-200">
              <Award className="size-4 shrink-0 text-emerald-400" />
              IBM Data Science Professional Certificate
            </div>
          </Section>

          <Section label="Core stack">
            <div className="flex flex-wrap gap-2">
              {data.metrics.coreStack.map((s) => (
                <span key={s} className="flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300">
                  <Workflow className="size-3 text-cyan-400" />
                  {s}
                </span>
              ))}
            </div>
          </Section>

          <a
            href={data.personal.cvPath}
            download
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-3.5 py-2 text-xs font-semibold text-abyss transition-transform hover:-translate-y-px"
          >
            <Download className="size-3.5" />
            Download PDF
            <ExternalLink className="size-3 opacity-70" />
          </a>
        </aside>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-slate-800/80 px-6 py-4 font-mono text-[11px] text-white0">
        <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-400" />ATS-friendly</span>
        <span>© {new Date().getFullYear()} Ahmad Bilal · Lahore, Pakistan</span>
        <span className="ml-auto">github.com/AhmadBilalDSA/ahmadbilaldsa.github.io</span>
      </div>
    </div>
  )
}

function ProjectRow({ name, stack, points }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-white">{name}</h3>
        <span className="font-mono text-[11px] text-white0">{stack}</span>
      </div>
      <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-slate-300">
        {points.map((point) => (
          <li key={point} className="flex gap-2.5">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}