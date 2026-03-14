import { ArrowRight, Leaf, DollarSign, ShieldCheck, Zap, BarChart3, GitBranch } from 'lucide-react'

interface Props { onGetStarted: () => void }

const features = [
  { icon: Leaf,       color: 'bg-emerald-50 text-emerald-600', title: 'Carbon Analysis',     desc: 'Measure CO₂ emissions per deployment with A–F ratings and region-aware carbon intensity.' },
  { icon: DollarSign, color: 'bg-blue-50 text-blue-600',       title: 'Cost Estimation',     desc: 'Break down compute, storage, and network costs with monthly projections.' },
  { icon: ShieldCheck,color: 'bg-purple-50 text-purple-600',   title: 'Risk Scoring',        desc: 'Score deployment risk 0–100 with factor-level breakdown and severity tags.' },
  { icon: Zap,        color: 'bg-amber-50 text-amber-600',     title: 'Policy Enforcement',  desc: 'Automated governance gates that approve, warn, or block pipelines instantly.' },
  { icon: BarChart3,  color: 'bg-rose-50 text-rose-600',       title: 'Executive Reports',   desc: 'Compliance-ready dashboards with actionable optimization recommendations.' },
  { icon: GitBranch,  color: 'bg-teal-50 text-teal-600',       title: 'Multi-Platform',      desc: 'Supports GitHub Actions, Azure DevOps across Azure, AWS, and GCP regions.' },
]

const stats = [
  { value: '6',    label: 'AI Agents' },
  { value: '20–40%', label: 'Carbon Reduction' },
  { value: '15–30%', label: 'Cost Savings' },
  { value: '<30s', label: 'Analysis Time' },
]

export default function HomePage({ onGetStarted }: Props) {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="gradient-hero pt-20 pb-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6 animate-fade-in-up delay-100">
            Smarter Deployments.<br />
            <span className="gradient-text">Greener Operations.</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            GreenOps AI analyzes your CI/CD pipelines in real time — measuring carbon footprint,
            estimating costs, scoring risk, and enforcing governance automatically.
          </p>

          <div className="flex items-center justify-center gap-4 animate-fade-in-up delay-300">
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 text-sm"
            >
              Analyze a Pipeline <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#features"
              className="px-7 py-3.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl transition-colors text-sm"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Mock dashboard preview */}
        <div className="max-w-3xl mx-auto mt-16 animate-fade-in-up delay-400">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs text-slate-400 font-mono">greenops-ai.azurecontainerapps.io</span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm">✓</div>
                <div>
                  <div className="text-sm font-semibold text-emerald-800">Pipeline Approved</div>
                  <div className="text-xs text-emerald-600">All governance checks passed</div>
                </div>
                <div className="ml-auto flex gap-4 text-center">
                  {[['B','Carbon'],['B','Cost'],['LOW','Risk']].map(([v,l]) => (
                    <div key={l}>
                      <div className="text-lg font-bold text-emerald-700">{v}</div>
                      <div className="text-[10px] text-slate-500">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Carbon', value: '0.156 kg', sub: 'CO₂ per deploy', color: 'emerald' },
                  { label: 'Cost',   value: '$0.26',    sub: 'per deployment', color: 'blue' },
                  { label: 'Risk',   value: '10/100',   sub: 'LOW risk score', color: 'orange' },
                ].map(c => (
                  <div key={c.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">{c.label}</div>
                    <div className="text-xl font-bold text-slate-800">{c.value}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{c.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 border-y border-slate-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything you need</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Six specialized AI agents work in parallel to give you a complete picture of every deployment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 card-hover">
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to green your pipeline?</h2>
          <p className="text-slate-500 mb-8">Paste your YAML or upload a PDF and get results in under 30 seconds.</p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 text-sm"
          >
            Start Analyzing <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs">🌱</div>
            <span className="font-semibold text-slate-600 text-sm">GreenOps AI</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} GreenOps AI. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
