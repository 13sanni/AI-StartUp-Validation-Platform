import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Award, TrendingUp, Users, Shield, Map, DollarSign,
  ArrowRight, ChevronRight, ExternalLink, Target,
  Zap, AlertTriangle, Eye, Rocket, Clock, Coins,
  BarChart3,
} from 'lucide-react'
import CountUp from 'react-countup'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

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

// ─── Mini Score Bar ──────────────────────────────────
function MiniScoreBar({ label, score, color, icon: Icon }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
        <Icon size={14} className="text-white/40" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/50">{label}</span>
          <span className="text-xs font-bold" style={{ color }}>{score}/100</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── SWOT Card ───────────────────────────────────────
function SwotCard({ title, items, color, icon: Icon }) {
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

// ─── Custom Tooltip for Chart ────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="text-white/50 mb-1">{label}</p>
      <p className="text-brand-primary font-bold">${payload[0].value.toFixed(1)}B</p>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────
export default function ReportPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const report = location.state?.report

  useEffect(() => {
    if (!report) navigate('/', { replace: true })
  }, [report, navigate])

  if (!report) return null

  const {
    startupName, tagline, viabilityScore, verdict, verdictColor,
    executiveSummary, scores, market, competitors, swot, mvp, revenue,
  } = report

  const scoreBarItems = [
    { label: 'Market Opportunity', score: scores.market, color: '#06d6a0', icon: TrendingUp },
    { label: 'Product Viability', score: scores.product, color: '#6c63ff', icon: Zap },
    { label: 'Financial Potential', score: scores.financial, color: '#ffbe0b', icon: DollarSign },
    { label: 'Traction Potential', score: scores.traction, color: '#4cc9f0', icon: Target },
    { label: 'Team Requirement', score: scores.team, color: '#f72585', icon: Users },
  ]

  const chartColors = ['#6c63ff', '#7c74ff', '#8c85ff', '#6c63ff', '#5c54e0']

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="container max-w-5xl">
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
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
              {startupName}
            </h1>
            <p className="text-white/40 text-lg capitalize">{tagline}</p>
          </motion.div>

          {/* ────── SCORE + BREAKDOWN ────── */}
          <motion.div variants={fadeUp} className="glass-card p-8 md:p-10 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* Score Ring */}
              <div className="flex flex-col items-center">
                <ScoreRing score={viabilityScore} color={verdictColor} size={200} />
                <div className="mt-4 text-center">
                  <span className="text-sm font-bold" style={{ color: verdictColor }}>
                    {verdict} Viability
                  </span>
                  <p className="text-white/25 text-xs mt-1">
                    Composite score across 5 dimensions
                  </p>
                </div>
              </div>

              {/* Score Bars */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-5">
                  Score Breakdown
                </h3>
                {scoreBarItems.map((item) => (
                  <MiniScoreBar key={item.label} {...item} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ────── EXECUTIVE SUMMARY ────── */}
          <motion.div variants={fadeUp} className="glass-card p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Eye size={18} className="text-brand-accent" />
              <h2 className="text-lg font-bold">Executive Summary</h2>
            </div>
            <p className="text-white/50 leading-relaxed text-sm">
              {executiveSummary}
            </p>
          </motion.div>

          {/* ────── MARKET ANALYSIS ────── */}
          <motion.div variants={fadeUp} className="glass-card p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-brand-green" />
              <h2 className="text-lg font-bold">Market Analysis</h2>
              <span className="badge badge-green ml-2" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>
                {market.growth}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Market Sizes */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'TAM', value: market.tam, desc: 'Total Addressable' },
                    { label: 'SAM', value: market.sam, desc: 'Serviceable' },
                    { label: 'SOM', value: market.som, desc: 'Obtainable' },
                  ].map((m) => (
                    <div key={m.label} className="bg-white/[0.03] rounded-xl p-4 text-center">
                      <div className="text-xs text-white/30 mb-1">{m.label}</div>
                      <div className="text-xl font-bold text-gradient-green">{m.value}</div>
                      <div className="text-[10px] text-white/20 mt-1">{m.desc}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Key Trends</h4>
                  <ul className="space-y-2">
                    {market.trends.map((trend, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/45">
                        <TrendingUp size={13} className="text-brand-green/50 shrink-0 mt-0.5" />
                        {trend}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Market Chart */}
              <div>
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                  Market Size Projection
                </h4>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={market.chartData} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                        tickLine={false}
                        tickFormatter={(v) => `$${v}B`}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {market.chartData.map((_, i) => (
                          <Cell key={i} fill={chartColors[i % chartColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ────── COMPETITOR LANDSCAPE ────── */}
          <motion.div variants={fadeUp} className="glass-card p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Users size={18} className="text-brand-accent" />
              <h2 className="text-lg font-bold">Competitor Landscape</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left text-white/30 font-medium py-3 pr-4 text-xs uppercase tracking-wider">Company</th>
                    <th className="text-left text-white/30 font-medium py-3 pr-4 text-xs uppercase tracking-wider">Type</th>
                    <th className="text-left text-white/30 font-medium py-3 pr-4 text-xs uppercase tracking-wider">Funding</th>
                    <th className="text-left text-white/30 font-medium py-3 text-xs uppercase tracking-wider">Threat Level</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((comp) => (
                    <tr key={comp.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center text-xs font-bold text-brand-primary">
                            {comp.name.charAt(0)}
                          </div>
                          <span className="font-medium text-white/80">{comp.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`badge text-[10px] px-2 py-0.5 ${comp.type === 'Direct' ? 'badge-pink' : 'badge-blue'}`}>
                          {comp.type}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-white/50">{comp.funding}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                backgroundColor: comp.strength >= 75 ? '#f72585' :
                                  comp.strength >= 50 ? '#ffbe0b' : '#06d6a0'
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${comp.strength}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                          <span className="text-xs text-white/40">{comp.strength}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ────── SWOT ANALYSIS ────── */}
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

          {/* ────── MVP ROADMAP ────── */}
          <motion.div variants={fadeUp} className="glass-card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Map size={18} className="text-brand-orange" />
                <h2 className="text-lg font-bold">MVP Roadmap</h2>
              </div>
              <div className="flex gap-3 text-xs text-white/30">
                <span className="flex items-center gap-1"><Clock size={12} /> {mvp.timeline}</span>
                <span className="flex items-center gap-1"><Coins size={12} /> {mvp.budget}</span>
              </div>
            </div>

            <div className="space-y-6">
              {mvp.phases.map((phase, pi) => (
                <div key={pi} className="relative">
                  {/* Phase connector */}
                  {pi < mvp.phases.length - 1 && (
                    <div className="absolute left-[15px] top-10 bottom-0 w-px bg-white/[0.06]" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Phase dot */}
                    <div className={`
                      w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold
                      ${pi === 0 ? 'bg-brand-primary/20 text-brand-primary' :
                        pi === 1 ? 'bg-brand-accent/20 text-brand-accent' :
                        'bg-brand-green/20 text-brand-green'}
                    `}>
                      {pi + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-bold text-white text-sm">{phase.name}</h3>
                        <span className="text-xs text-white/25 flex items-center gap-1">
                          <Clock size={10} /> {phase.duration}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {phase.features.map((feat, fi) => (
                          <div key={fi} className="bg-white/[0.03] rounded-lg px-3 py-2.5 text-xs">
                            <div className="text-white/70 font-medium mb-1">{feat.name}</div>
                            <div className="flex items-center gap-2">
                              <span className={`badge text-[9px] px-1.5 py-0 ${
                                feat.priority === 'Critical' ? 'badge-pink' :
                                feat.priority === 'High' ? 'badge-purple' :
                                'badge-blue'
                              }`}>
                                {feat.priority}
                              </span>
                              <span className="text-white/20">{feat.effort} effort</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ────── REVENUE MODELS ────── */}
          <motion.div variants={fadeUp} className="glass-card p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign size={18} className="text-brand-green" />
              <h2 className="text-lg font-bold">Revenue Models</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {revenue.map((rev, i) => (
                <div key={i} className="bg-white/[0.03] rounded-xl p-5 hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-white/80">{rev.model}</h3>
                    <span className={`badge text-[10px] px-2 py-0.5 ${
                      rev.potential === 'High' ? 'badge-green' :
                      rev.potential === 'Medium' ? 'badge-orange' : 'badge-blue'
                    }`}>
                      {rev.potential} Potential
                    </span>
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed">{rev.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ────── FINAL VERDICT ────── */}
          <motion.div variants={fadeUp}
            className="glass-card p-8 md:p-10 text-center relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${verdictColor}, transparent 70%)`,
              }}
            />
            <div className="relative z-10">
              <Award size={40} className="mx-auto mb-4" style={{ color: verdictColor }} />
              <h2 className="text-2xl font-extrabold mb-2">Final Verdict</h2>
              <p className="text-4xl font-extrabold mb-3" style={{ color: verdictColor }}>
                {viabilityScore}/100 — {verdict}
              </p>
              <p className="text-white/40 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
                {viabilityScore >= 75
                  ? 'This startup concept shows excellent potential. With strong execution and strategic market positioning, this idea has a high probability of achieving meaningful traction.'
                  : viabilityScore >= 55
                  ? 'This idea has moderate potential but faces notable challenges. Consider refining your value proposition and addressing the key weaknesses identified above.'
                  : 'This concept faces significant headwinds. We recommend substantial pivoting or exploring adjacent market opportunities before investing significant resources.'
                }
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="new-analysis-button"
                  className="btn-primary"
                  onClick={() => navigate('/')}
                >
                  <Rocket size={16} />
                  Validate Another Idea
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] mt-16 py-8">
        <div className="container text-center text-xs text-white/20">
          Generated by LaunchLens AI · {new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </div>
      </footer>
    </motion.main>
  )
}
