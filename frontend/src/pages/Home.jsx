import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Rocket, BarChart3, Shield, Map, Zap, ArrowRight,
  TrendingUp, Users, Globe, Sparkles,
} from 'lucide-react'
import CountUp from 'react-countup'
import toast from 'react-hot-toast'

// ─── Animation Variants ──────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

// ─── Data ─────────────────────────────────────────────
const steps = [
  { icon: Sparkles, title: 'Describe Your Idea', desc: 'Tell us about your startup concept in a few sentences' },
  { icon: Zap, title: 'AI Analyzes', desc: 'Our AI engine runs 6 deep analyses in parallel' },
  { icon: BarChart3, title: 'Get Your Report', desc: 'Receive a comprehensive validation with actionable insights' },
]

const features = [
  {
    icon: TrendingUp, title: 'Market Analysis',
    desc: 'TAM/SAM/SOM sizing, growth trends, and market dynamics assessed in seconds.',
    badge: 'Market', badgeClass: 'badge-green',
  },
  {
    icon: Users, title: 'Competitor Research',
    desc: 'Discover key competitors, their funding, positioning, and threat levels.',
    badge: 'Research', badgeClass: 'badge-blue',
  },
  {
    icon: Shield, title: 'SWOT Analysis',
    desc: 'Auto-generated strengths, weaknesses, opportunities, and threats matrix.',
    badge: 'Strategy', badgeClass: 'badge-pink',
  },
  {
    icon: Map, title: 'MVP Roadmap',
    desc: 'Phased development plan with timelines, budgets, and priority features.',
    badge: 'Product', badgeClass: 'badge-orange',
  },
]

const stats = [
  { value: 12400, suffix: '+', label: 'Ideas Validated' },
  { value: 98, suffix: '%', label: 'Accuracy Rate' },
  { value: 60, suffix: 's', label: 'Avg. Analysis Time' },
  { value: 850, suffix: '+', label: 'Markets Covered' },
]

// ─── Component ────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()
  const [idea, setIdea] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = idea.trim()
    if (trimmed.length < 10) {
      toast.error('Please describe your startup idea in at least a few words.')
      return
    }
    navigate('/analyzing', { state: { idea: trimmed } })
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >

      {/* ────── HERO ────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Ambient orbs */}
        <div className="orb w-[500px] h-[500px] bg-white/5 -top-40 -left-40" />
        <div className="orb w-[400px] h-[400px] bg-white/5 -bottom-32 -right-32" />
        <div className="orb w-[300px] h-[300px] bg-white/5 top-1/3 right-1/4" />

        <div className="container relative z-10 text-center max-w-4xl">
          <motion.div variants={stagger} initial="hidden" animate="visible">

            {/* Badge */}
            <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-8">
              <span className="badge badge-purple">
                <Rocket size={14} />
                AI-Powered Startup Validation
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} custom={1}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] mb-6"
            >
              Validate Your{' '}
              <span className="text-gradient">Startup Idea</span>
              <br />
              in 60 Seconds
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={fadeUp} custom={2}
              className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Get a complete market analysis, competitor research, SWOT breakdown,
              MVP roadmap, and viability score — all powered by AI.
            </motion.p>

            {/* ─── Input Form ─── */}
            <motion.form
              variants={fadeUp} custom={3}
              onSubmit={handleSubmit}
              className="relative max-w-2xl mx-auto"
            >
              <div
                className={`
                  glass-card p-2 transition-all duration-300
                  ${isFocused ? 'border-white/40 shadow-glow' : ''}
                `}
              >
                <textarea
                  id="startup-idea-input"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Describe your startup idea... e.g. An AI platform that helps restaurants reduce food waste by predicting daily demand."
                  rows={4}
                  className="
                    w-full bg-transparent text-white placeholder-white/25
                    resize-none outline-none p-4 text-base leading-relaxed
                    rounded-xl
                  "
                  maxLength={500}
                />
                <div className="flex items-center justify-between px-4 pb-3">
                  <span className="text-xs text-white/25">{idea.length}/500</span>
                  <button
                    id="validate-button"
                    type="submit"
                    className="btn-primary text-sm"
                    disabled={idea.trim().length < 10}
                  >
                    <Rocket size={16} />
                    Validate My Idea
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.form>

            {/* Trust signals */}
            <motion.p variants={fadeUp} custom={4}
              className="text-white/20 text-xs mt-5 flex items-center justify-center gap-2"
            >
              <Globe size={12} />
              Free · No signup required · Results in under a minute
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ────── HOW IT WORKS ────── */}
      <section className="section-padding relative overflow-hidden">
        <div className="container">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="section-heading">
              How It <span className="text-gradient">Works</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="section-subheading">
              Three simple steps to validate any startup concept
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  custom={i}
                  className="glass-card p-8 text-center relative group"
                >
                  {/* Step number */}
                  <div className="absolute top-4 right-4 text-4xl font-extrabold text-white/[0.04] font-display">
                    0{i + 1}
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5 group-hover:bg-white/10 transition-colors">
                    <step.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────── FEATURES ────── */}
      <section className="section-padding relative overflow-hidden">
        <div className="orb w-[400px] h-[400px] bg-white/5 top-0 right-0" />
        <div className="container relative z-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="section-heading">
              What You <span className="text-gradient-green">Get</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="section-subheading">
              A comprehensive AI-generated report covering every angle of your startup
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  variants={fadeUp}
                  custom={i}
                  className="glass-card p-7 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0 group-hover:bg-white/[0.08] transition-colors">
                      <feat.icon size={22} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white">{feat.title}</h3>
                        <span className={`badge ${feat.badgeClass}`} style={{ fontSize: '0.6rem', padding: '2px 8px' }}>
                          {feat.badge}
                        </span>
                      </div>
                      <p className="text-white/40 text-sm leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────── STATS ────── */}
      <section className="section-padding relative">
        <div className="container">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="glass-card p-10 md:p-14"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} variants={fadeUp} custom={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-gradient mb-2">
                    <CountUp end={stat.value} duration={2.5} enableScrollSpy scrollSpyOnce />
                    {stat.suffix}
                  </div>
                  <div className="text-white/40 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────── CTA ────── */}
      <section className="section-padding relative overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-white/5 -bottom-60 left-1/2 -translate-x-1/2" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="section-heading text-4xl md:text-5xl mb-5">
              Ready to <span className="text-gradient-accent">Launch</span>?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/40 text-lg max-w-lg mx-auto mb-8">
              Stop guessing. Let AI validate your next big idea before you invest time and money.
            </motion.p>
            <motion.div variants={fadeUp}>
              <button
                id="cta-validate-button"
                className="btn-primary text-base px-10 py-4"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <Rocket size={18} />
                Start Validating Now
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ────── FOOTER ────── */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/25">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔭</span>
            <span className="font-bold text-white/40">LaunchLens</span>
          </div>
          <p>© {new Date().getFullYear()} LaunchLens. Built with AI. For dreamers & doers.</p>
        </div>
      </footer>
    </motion.main>
  )
}
