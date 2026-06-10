import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Users, DollarSign, Shield, Map, BarChart3,
  CheckCircle2, Loader2,
} from 'lucide-react'

// ─── Analysis Steps ───────────────────────────────────
const analysisSteps = [
  { icon: Search, label: 'Analyzing market size & trends', duration: 1400 },
  { icon: Users, label: 'Researching competitors', duration: 1200 },
  { icon: DollarSign, label: 'Evaluating business model', duration: 1100 },
  { icon: Shield, label: 'Building SWOT analysis', duration: 1300 },
  { icon: Map, label: 'Generating MVP roadmap', duration: 1000 },
  { icon: BarChart3, label: 'Calculating viability score', duration: 1500 },
]

// ─── Console Log Lines ───────────────────────────────
const consoleLines = [
  '> Initializing LaunchLens AI Engine v2.4...',
  '> Loading market intelligence database...',
  '> Parsing startup idea input...',
  '> Extracting key industry verticals...',
  '> Querying global market data (148 markets)...',
  '> Estimating TAM/SAM/SOM parameters...',
  '> Scanning competitor landscape...',
  '> Cross-referencing Crunchbase data...',
  '> Analyzing funding patterns...',
  '> Evaluating unit economics viability...',
  '> Running Monte Carlo revenue simulations...',
  '> Generating SWOT matrix...',
  '> Mapping opportunity quadrants...',
  '> Building phased MVP timeline...',
  '> Calculating composite viability score...',
  '> Applying confidence intervals...',
  '> Compiling final report...',
  '> ✓ Analysis complete. Preparing results...',
]

// ─── Component ────────────────────────────────────────
import React from 'react'

class AnalysisErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-white bg-red-900 min-h-screen">
          <h1 className="text-2xl font-bold">AnalysisPage Crash!</h1>
          <pre className="mt-4 text-xs whitespace-pre-wrap">{this.state.error?.stack || this.state.error?.toString()}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function AnalysisPage() {
  return (
    <AnalysisErrorBoundary>
      <AnalysisPageContent />
    </AnalysisErrorBoundary>
  )
}

function AnalysisPageContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const idea = location.state?.idea || ''

  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [visibleLogs, setVisibleLogs] = useState([])
  const [progress, setProgress] = useState(0)
  const logRef = useRef(null)

  // Step progression
  useEffect(() => {
    if (!idea) return
    if (currentStep >= analysisSteps.length) return

    const stepDuration = analysisSteps[currentStep]?.duration || 1000
    const timer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, currentStep])
      setCurrentStep(prev => prev + 1)
    }, stepDuration)

    return () => clearTimeout(timer)
  }, [currentStep, idea])

  // Console log feed
  useEffect(() => {
    if (!idea) return
    let lineIndex = 0
    const interval = setInterval(() => {
      if (lineIndex < consoleLines.length) {
        setVisibleLogs(prev => [...prev, consoleLines[lineIndex]])
        lineIndex++
      } else {
        clearInterval(interval)
      }
    }, 480)
    return () => clearInterval(interval)
  }, [idea])

  // Progress bar
  useEffect(() => {
    if (!idea) return
    const total = analysisSteps.reduce((sum, s) => sum + s.duration, 0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100 }
        return prev + 1
      })
    }, total / 100)
    return () => clearInterval(interval)
  }, [idea])

  // Auto-scroll console
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [visibleLogs])

  const [backendResult, setBackendResult] = useState(null)

  // Trigger backend analysis
  useEffect(() => {
    if (!idea) return;
    const runAnalysis = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idea, audience: 'Global', country: 'Worldwide' })
        });
        const data = await res.json();
        if (data.report) {
          setBackendResult(data.report);
        }
      } catch (err) {
        console.error("Backend analysis failed:", err);
      }
    };
    runAnalysis();
  }, [idea]);

  // Navigate to report when both visual steps and backend are done
  useEffect(() => {
    if (!idea) return
    if (completedSteps.length === analysisSteps.length && backendResult) {
      const timer = setTimeout(() => {
        navigate('/report', { state: { report: backendResult }, replace: true })
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [completedSteps, backendResult, idea, navigate])

  // Redirect if no idea (must be after all hooks to satisfy rules of hooks)
  useEffect(() => {
    if (!idea) {
      navigate('/', { replace: true })
    }
  }, [idea, navigate])

  if (!idea) return null


  const isComplete = completedSteps.length === analysisSteps.length

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center pt-20 pb-12"
    >
      <div className="container max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ─── Left: Steps Panel ─── */}
          <div className="glass-card p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/15 flex items-center justify-center">
                  {isComplete ? (
                    <CheckCircle2 size={20} className="text-brand-green" />
                  ) : (
                    <Loader2 size={20} className="text-brand-primary animate-spin" />
                  )}
                </div>
                {!isComplete && (
                  <div className="absolute inset-0 rounded-xl border-2 border-brand-primary/30 animate-pulse-ring" />
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  {isComplete ? 'Analysis Complete!' : 'Analyzing Your Idea'}
                </h1>
                <p className="text-white/30 text-xs">
                  {isComplete ? 'Preparing your report...' : 'This usually takes about 60 seconds'}
                </p>
              </div>
            </div>

            {/* Idea preview */}
            <div className="bg-white/[0.03] rounded-xl p-3 mb-6 mt-4">
              <p className="text-white/40 text-xs mb-1 font-medium uppercase tracking-wider">Your Idea</p>
              <p className="text-white/70 text-sm leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{idea}</p>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-white/30 mb-2">
                <span>Progress</span>
                <span>{Math.min(progress, 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #6c63ff, #f72585)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {analysisSteps.map((step, i) => {
                const isDone = completedSteps.includes(i)
                const isCurrent = currentStep === i && !isDone
                const Icon = step.icon

                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${isDone ? 'bg-brand-green/[0.06]' : ''}
                      ${isCurrent ? 'bg-brand-primary/[0.08] border border-brand-primary/20' : 'border border-transparent'}
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                      ${isDone ? 'bg-brand-green/15' : isCurrent ? 'bg-brand-primary/15' : 'bg-white/[0.04]'}
                    `}>
                      {isDone ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                          <CheckCircle2 size={16} className="text-brand-green" />
                        </motion.div>
                      ) : isCurrent ? (
                        <Loader2 size={16} className="text-brand-primary animate-spin" />
                      ) : (
                        <Icon size={16} className="text-white/20" />
                      )}
                    </div>

                    <span className={`text-sm transition-colors ${
                      isDone ? 'text-brand-green/80' : isCurrent ? 'text-white' : 'text-white/25'
                    }`}>
                      {step.label}
                    </span>

                    {isDone && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-auto text-xs text-brand-green/50"
                      >
                        Done
                      </motion.span>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* ─── Right: Console Panel ─── */}
          <div className="glass-card p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-brand-orange/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-brand-green/60" />
              </div>
              <span className="text-white/20 text-xs font-mono ml-2">launchlens-ai-engine</span>
            </div>

            <div
              ref={logRef}
              className="flex-1 bg-black/30 rounded-xl p-4 font-mono text-xs overflow-y-auto max-h-[400px] space-y-1"
              style={{ scrollBehavior: 'smooth' }}
            >
              <AnimatePresence>
                {visibleLogs.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`leading-relaxed ${
                      line.includes('✓') ? 'text-brand-green' :
                      line.includes('>') ? 'text-brand-accent/70' :
                      'text-white/30'
                    }`}
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Blinking cursor */}
              {!isComplete && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-brand-primary/60">{'>'}</span>
                  <span className="w-2 h-4 bg-brand-primary/50 animate-pulse" />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </motion.main>
  )
}
