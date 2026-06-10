import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Award, TrendingUp, Users, Shield, Map, Code,
  ArrowRight, ChevronRight, Target,
  Zap, AlertTriangle, Eye, Rocket, Download,
} from 'lucide-react'
import CountUp from 'react-countup'

// ─── Animation Variants ──────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

// ─── Score Ring SVG ──────────────────────────────────
function ScoreRing({ score, color, size = 200 }) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          className="score-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          className="score-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold" style={{ color }}>
          <CountUp end={score} duration={2} delay={0.3} />
        </span>
        <span className="text-white/30 text-xs uppercase tracking-widest mt-1">out of 100</span>
      </div>
    </div>
  )
}

// ─── SWOT Card ───────────────────────────────────────
function SwotCard({ title, items, color, icon: Icon }) {
  if (!items || items.length === 0) return null;
  return (
    <div
      className="glass-card p-6 relative overflow-hidden"
      style={{ borderColor: `${color}20` }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} style={{ color }} />
        <h3 className="font-bold text-sm" style={{ color }}>{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white/50 leading-relaxed">
            <ChevronRight size={14} className="shrink-0 mt-0.5" style={{ color: `${color}80` }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────
export default function ReportPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const reportRef = useRef(null)
  const [exporting, setExporting] = useState(false)
  
  // The API returns { message, analysisId, report: StartupState }
  // or inside analysis logic we pass the report object directly
  const data = location.state?.report || location.state;

  useEffect(() => {
    if (!data || !data.idea) navigate('/', { replace: true })
  }, [data, navigate])

  if (!data || !data.idea) return null

  const {
    idea,
    audience,
    marketResearch,
    competitors,
    swot,
    productMVP,
    techStack,
    viabilityScore,
  } = data;

  const score = viabilityScore?.score || 50;
  let verdict = 'Moderate';
  let verdictColor = '#ffbe0b';
  
  if (score >= 80) {
    verdict = 'Excellent';
    verdictColor = '#06d6a0';
  } else if (score < 50) {
    verdict = 'Risky';
    verdictColor = '#f72585';
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="container max-w-5xl" ref={reportRef}>
        <motion.div variants={stagger} initial="hidden" animate="visible">

          {/* ────── HEADER ────── */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span
              className="badge mb-4 inline-flex"
              style={{
                backgroundColor: `${verdictColor}15`,
                color: verdictColor,
                borderColor: `${verdictColor}30`,
              }}
            >
              <Award size={14} />
              {verdict} Potential
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight max-w-4xl mx-auto">
              {idea}
            </h1>
            <p className="text-white/40 text-lg capitalize">Target Audience: {audience || 'Global'}</p>
          </motion.div>

          {/* ────── SCORE + SUMMARY ────── */}
          <motion.div variants={fadeUp} className="glass-card p-8 md:p-10 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="flex flex-col items-center">
                <ScoreRing score={score} color={verdictColor} size={200} />
                <div className="mt-4 text-center">
                  <span className="text-sm font-bold" style={{ color: verdictColor }}>
                    Viability Score
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={18} className="text-brand-accent" />
                  <h2 className="text-lg font-bold">VC Verdict</h2>
                </div>
                <p className="text-white/50 leading-relaxed text-sm">
                  {viabilityScore?.reasoning || "Analysis complete."}
                </p>
                <div className="mt-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Market Gap / Opportunity</h4>
                  <p className="text-brand-green/90 text-sm">{competitors?.opportunity}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ────── MARKET ANALYSIS ────── */}
          {marketResearch && (
            <motion.div variants={fadeUp} className="glass-card p-8 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={18} className="text-brand-green" />
                <h2 className="text-lg font-bold">Market Dynamics</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/[0.03] rounded-xl p-5">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Market Trend</h4>
                  <p className="text-sm text-white/70">{marketResearch.marketTrend}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-5">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Target Personas</h4>
                  <ul className="space-y-2">
                    {marketResearch.targetUsers?.map((u, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                        <Users size={14} className="text-brand-accent mt-0.5 shrink-0" /> {u}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-5">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Pain Points Solved</h4>
                  <ul className="space-y-2">
                    {marketResearch.painPoints?.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                        <Target size={14} className="text-brand-green mt-0.5 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* ────── COMPETITOR LANDSCAPE ────── */}
          {competitors?.competitors && (
            <motion.div variants={fadeUp} className="glass-card p-8 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Users size={18} className="text-brand-accent" />
                <h2 className="text-lg font-bold">Competitor Landscape</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-white/30 font-medium py-3 pr-4 text-xs uppercase tracking-wider">Competitor</th>
                      <th className="text-left text-white/30 font-medium py-3 pr-4 text-xs uppercase tracking-wider">Key Strength</th>
                      <th className="text-left text-white/30 font-medium py-3 text-xs uppercase tracking-wider">Key Weakness</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitors.competitors.map((comp, idx) => (
                      <tr key={idx} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 pr-4">
                          <span className="font-bold text-white/80">{comp.name}</span>
                        </td>
                        <td className="py-4 pr-4 text-brand-green/70">{comp.strength}</td>
                        <td className="py-4 text-brand-orange/70">{comp.weakness}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ────── SWOT ANALYSIS ────── */}
          {swot && (
            <motion.div variants={fadeUp} className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Shield size={18} className="text-brand-primary" />
                <h2 className="text-lg font-bold">SWOT Analysis</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SwotCard title="Strengths" items={swot.strengths} color="#06d6a0" icon={Zap} />
                <SwotCard title="Weaknesses" items={swot.weaknesses} color="#f72585" icon={AlertTriangle} />
                <SwotCard title="Opportunities" items={swot.opportunities} color="#4cc9f0" icon={Eye} />
                <SwotCard title="Threats" items={swot.threats} color="#ffbe0b" icon={Shield} />
              </div>
            </motion.div>
          )}

          {/* ────── MVP ROADMAP ────── */}
          {productMVP && (
            <motion.div variants={fadeUp} className="glass-card p-8 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Map size={18} className="text-brand-orange" />
                <h2 className="text-lg font-bold">Product Roadmap</h2>
              </div>
              <div className="space-y-6">
                <div className="border-l-2 border-white/10 pl-6 pb-2">
                  <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs -ml-9">1</span>
                    MVP (v1) Features
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {productMVP.mvpFeatures?.map((f, i) => (
                      <li key={i} className="bg-white/[0.03] p-2.5 rounded text-xs text-white/60">{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="border-l-2 border-white/10 pl-6 pb-2">
                  <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-brand-accent/20 text-brand-accent flex items-center justify-center text-xs -ml-9">2</span>
                    Version 2
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {productMVP.v2Features?.map((f, i) => (
                      <li key={i} className="bg-white/[0.03] p-2.5 rounded text-xs text-white/60">{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="border-l-2 border-transparent pl-6">
                  <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-brand-green/20 text-brand-green flex items-center justify-center text-xs -ml-9">3</span>
                    Version 3 (Scale)
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {productMVP.v3Features?.map((f, i) => (
                      <li key={i} className="bg-white/[0.03] p-2.5 rounded text-xs text-white/60">{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* ────── TECH STACK ────── */}
          {techStack && (
            <motion.div variants={fadeUp} className="glass-card p-8 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Code size={18} className="text-brand-purple" />
                <h2 className="text-lg font-bold">Recommended Tech Stack</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Frontend</div>
                  <div className="font-bold text-brand-accent text-sm">{techStack.frontend}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Backend</div>
                  <div className="font-bold text-brand-green text-sm">{techStack.backend}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Database</div>
                  <div className="font-bold text-brand-orange text-sm">{techStack.database}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Cloud/Infra</div>
                  <div className="font-bold text-brand-primary text-sm">{techStack.cloud}</div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Key Modules Needed</h4>
                <div className="flex flex-wrap gap-2">
                  {techStack.modules?.map((m, i) => (
                    <span key={i} className="px-3 py-1 bg-brand-purple/10 text-brand-purple text-xs rounded-full border border-brand-purple/20">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="flex justify-center gap-4 mt-12">
            <button
              className="btn-outline px-8 py-3"
              disabled={exporting}
              onClick={async () => {
                setExporting(true)
                try {
                  const html2pdf = (await import('html2pdf.js')).default
                  const element = reportRef.current
                  const opt = {
                    margin: [10, 10, 10, 10],
                    filename: `LaunchLens-Report-${idea.slice(0, 30).replace(/\s+/g, '-')}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0d0f1c' },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                  }
                  await html2pdf().set(opt).from(element).save()
                } catch (err) {
                  console.error('PDF export failed:', err)
                } finally {
                  setExporting(false)
                }
              }}
            >
              <Download size={18} />
              {exporting ? 'Generating PDF...' : 'Download PDF'}
            </button>
            <button className="btn-primary px-8 py-3" onClick={() => navigate('/')}>
              <Rocket size={18} /> Validate Another Idea
            </button>
          </motion.div>

        </motion.div>
      </div>
    </motion.main>
  )
}
