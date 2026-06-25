import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Award, TrendingUp, Users, Shield, Map, Code,
  ArrowRight, ChevronRight, Target,
  Zap, AlertTriangle, Eye, Rocket, Download,
} from 'lucide-react'
import CountUp from 'react-countup'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'

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
  let verdictColor = '#cccccc';
  
  if (score >= 80) {
    verdict = 'Excellent';
    verdictColor = '#ffffff';
  } else if (score < 50) {
    verdict = 'Risky';
    verdictColor = '#888888';
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="container max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* ────── STICKY SIDEBAR ────── */}
          <div className="hidden lg:block w-48 shrink-0">
            <div className="sticky top-28 space-y-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Contents</h3>
              <a href="#summary" className="block text-sm text-white/50 hover:text-white transition-colors border-l-2 border-transparent hover:border-white pl-3">Summary</a>
              {marketResearch && <a href="#market" className="block text-sm text-white/50 hover:text-white transition-colors border-l-2 border-transparent hover:border-white pl-3">Market Dynamics</a>}
              {competitors?.competitors && <a href="#competitors" className="block text-sm text-white/50 hover:text-white transition-colors border-l-2 border-transparent hover:border-white pl-3">Competitors</a>}
              {swot && <a href="#swot" className="block text-sm text-white/50 hover:text-white transition-colors border-l-2 border-transparent hover:border-white pl-3">SWOT Analysis</a>}
              {productMVP && <a href="#roadmap" className="block text-sm text-white/50 hover:text-white transition-colors border-l-2 border-transparent hover:border-white pl-3">MVP Roadmap</a>}
              {techStack && <a href="#tech" className="block text-sm text-white/50 hover:text-white transition-colors border-l-2 border-transparent hover:border-white pl-3">Tech Stack</a>}
            </div>
          </div>

          {/* ────── MAIN CONTENT ────── */}
          <div className="flex-1 min-w-0" ref={reportRef}>
            <motion.div variants={stagger} initial="hidden" animate="visible">

          {/* ────── HEADER ────── */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span
              className="badge mb-4 inline-flex group relative cursor-help"
              style={{
                backgroundColor: `${verdictColor}15`,
                color: verdictColor,
                borderColor: `${verdictColor}30`,
              }}
            >
              <Award size={14} />
              {verdict} Potential
              <div className="absolute top-full mt-2 px-3 py-1.5 bg-white text-black text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-lg">
                Powered by LangGraph parallel agents
              </div>
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight max-w-4xl mx-auto">
              {idea}
            </h1>
            <p className="text-white/40 text-lg capitalize">Target Audience: {audience || 'Global'}</p>
          </motion.div>

          {/* ────── SCORE + SUMMARY ────── */}
          <motion.div variants={fadeUp} id="summary" className="glass-card p-8 md:p-10 mb-8 scroll-mt-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
              <div className="flex flex-col items-center col-span-1">
                <ScoreRing score={score} color={verdictColor} size={200} />
                <div className="mt-4 text-center">
                  <span className="text-sm font-bold" style={{ color: verdictColor }}>
                    Viability Score
                  </span>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={18} className="text-white" />
                  <h2 className="text-lg font-bold">VC Verdict</h2>
                </div>
                <p className="text-white/50 leading-relaxed text-sm">
                  {viabilityScore?.reasoning || "Analysis complete."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.05] flex flex-col justify-center">
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Market Gap / Opportunity</h4>
                    <p className="text-white/90 text-sm">{competitors?.opportunity}</p>
                  </div>
                  
                  <div className="h-48 bg-white/[0.02] rounded-xl border border-white/[0.05] p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                        { subject: 'Market', A: Math.min(100, score + 12) },
                        { subject: 'Product', A: Math.min(100, score + 5) },
                        { subject: 'Tech', A: Math.min(100, score + 15) },
                        { subject: 'Competition', A: Math.max(10, score - 10) },
                        { subject: 'Finance', A: score },
                      ]}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }} />
                        <Radar name="Score" dataKey="A" stroke={verdictColor} fill={verdictColor} fillOpacity={0.2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ────── MARKET ANALYSIS ────── */}
          {marketResearch && (
            <motion.div variants={fadeUp} id="market" className="glass-card p-8 mb-8 scroll-mt-24">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={18} className="text-white" />
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
                        <Users size={14} className="text-white mt-0.5 shrink-0" /> {u}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-5">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Pain Points Solved</h4>
                  <ul className="space-y-2">
                    {marketResearch.painPoints?.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                        <Target size={14} className="text-white mt-0.5 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* ────── COMPETITOR LANDSCAPE ────── */}
          {competitors?.competitors && (
            <motion.div variants={fadeUp} id="competitors" className="glass-card p-8 mb-8 scroll-mt-24">
              <div className="flex items-center gap-2 mb-6 group relative w-max cursor-help">
                <Users size={18} className="text-white" />
                <h2 className="text-lg font-bold">Competitor Landscape</h2>
                <div className="absolute bottom-full left-0 mb-2 px-3 py-1.5 bg-white text-black text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-lg">
                  Real-time data via Tavily Search API
                </div>
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
                        <td className="py-4 pr-4 text-white/70">{comp.strength}</td>
                        <td className="py-4 text-white/70">{comp.weakness}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ────── SWOT ANALYSIS ────── */}
          {swot && (
            <motion.div variants={fadeUp} id="swot" className="mb-8 scroll-mt-24">
              <div className="flex items-center gap-2 mb-6">
                <Shield size={18} className="text-white" />
                <h2 className="text-lg font-bold">SWOT Analysis</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SwotCard title="Strengths" items={swot.strengths} color="#ffffff" icon={Zap} />
                <SwotCard title="Weaknesses" items={swot.weaknesses} color="#aaaaaa" icon={AlertTriangle} />
                <SwotCard title="Opportunities" items={swot.opportunities} color="#cccccc" icon={Eye} />
                <SwotCard title="Threats" items={swot.threats} color="#dddddd" icon={Shield} />
              </div>
            </motion.div>
          )}

          {/* ────── MVP ROADMAP ────── */}
          {productMVP && (
            <motion.div variants={fadeUp} id="roadmap" className="glass-card p-8 mb-8 scroll-mt-24">
              <div className="flex items-center gap-2 mb-6">
                <Map size={18} className="text-white" />
                <h2 className="text-lg font-bold">Product Roadmap</h2>
              </div>
              <div className="space-y-6">
                <div className="border-l-2 border-white/10 pl-6 pb-2">
                  <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-white/20 text-white flex items-center justify-center text-xs -ml-9">1</span>
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
                    <span className="w-6 h-6 rounded bg-white/20 text-white flex items-center justify-center text-xs -ml-9">2</span>
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
                    <span className="w-6 h-6 rounded bg-white/20 text-white flex items-center justify-center text-xs -ml-9">3</span>
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
            <motion.div variants={fadeUp} id="tech" className="glass-card p-8 mb-8 scroll-mt-24">
              <div className="flex items-center gap-2 mb-6">
                <Code size={18} className="text-white" />
                <h2 className="text-lg font-bold">Recommended Tech Stack</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Frontend</div>
                  <div className="font-bold text-white text-sm">{techStack.frontend}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Backend</div>
                  <div className="font-bold text-white text-sm">{techStack.backend}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Database</div>
                  <div className="font-bold text-white text-sm">{techStack.database}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Cloud/Infra</div>
                  <div className="font-bold text-white text-sm">{techStack.cloud}</div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Key Modules Needed</h4>
                <div className="flex flex-wrap gap-2">
                  {techStack.modules?.map((m, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20">
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
                    margin: [15, 15, 15, 15],
                    filename: `LaunchLens-Report-${idea.slice(0, 30).replace(/\s+/g, '-')}.pdf`,
                    image: { type: 'jpeg', quality: 1 },
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
                    html2canvas: { 
                      scale: 2, 
                      useCORS: true, 
                      backgroundColor: '#000000', 
                      windowWidth: 1024 
                    },
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
        </div>
      </div>
    </motion.main>
  )
}
