/**
 * Generates a realistic mock startup validation report
 * based on the user's startup idea input.
 */

// ─── Helpers ──────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const pickN = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, n)
}

// ─── Data Pools ───────────────────────────────────────
const marketTrends = [
  'Rapid digital transformation post-2024',
  'Increasing demand for AI-powered solutions',
  'Growing preference for subscription-based models',
  'Mobile-first consumer behavior',
  'Rising focus on data privacy & compliance',
  'Shift toward remote & async collaboration',
  'Expansion of creator economy tools',
  'Enterprise adoption of no-code platforms',
  'Sustainability-driven consumer choices',
  'Hyper-personalization through machine learning',
]

const competitorTemplates = [
  { name: 'VentureAI', type: 'Direct', funding: '$12M Series A', strength: rand(60, 85) },
  { name: 'IdeaForge', type: 'Direct', funding: '$8M Seed', strength: rand(50, 75) },
  { name: 'MarketPulse', type: 'Indirect', funding: '$45M Series B', strength: rand(70, 90) },
  { name: 'LaunchKit Pro', type: 'Direct', funding: '$3M Pre-seed', strength: rand(40, 65) },
  { name: 'Stratify', type: 'Indirect', funding: '$22M Series A', strength: rand(55, 80) },
  { name: 'ValidateHQ', type: 'Direct', funding: 'Bootstrapped', strength: rand(30, 55) },
  { name: 'NexusAI', type: 'Indirect', funding: '$67M Series C', strength: rand(75, 95) },
  { name: 'PivotLab', type: 'Direct', funding: '$5M Seed', strength: rand(45, 70) },
]

const strengthPool = [
  'First-mover advantage in AI-driven validation',
  'Low customer acquisition cost via organic growth',
  'Highly scalable SaaS architecture',
  'Strong network effects potential',
  'Clear value proposition for target audience',
  'Leverages cutting-edge AI/ML capabilities',
  'Low initial capital requirements',
  'High switching cost once adopted',
]

const weaknessPool = [
  'Requires significant user education',
  'Dependent on third-party AI model APIs',
  'Limited brand recognition in early stage',
  'Complex regulatory landscape in some markets',
  'Long sales cycle for enterprise customers',
  'Potential for high churn in freemium model',
  'Technical moat may be hard to maintain',
  'Narrow initial target market segment',
]

const opportunityPool = [
  'Untapped emerging markets in Southeast Asia & Africa',
  'Strategic partnerships with accelerators & VCs',
  'Adjacent product expansion (mentorship, funding)',
  'API/white-label licensing to consulting firms',
  'Growing demand from non-technical founders',
  'Government startup incentive programs',
  'Integration with existing business tools ecosystem',
  'Content marketing & thought leadership potential',
]

const threatPool = [
  'Well-funded incumbents may copy features',
  'Economic downturn reducing startup formation',
  'Rapid changes in AI regulation',
  'Open-source alternatives emerging',
  'Platform risk from AI provider dependency',
  'Market saturation in startup tools space',
  'Changing consumer expectations around AI accuracy',
  'Talent acquisition competition in AI/ML space',
]

const mvpFeatures = [
  { name: 'Idea Input & Parsing Engine', effort: 'Medium', priority: 'Critical' },
  { name: 'Market Size Estimation Module', effort: 'High', priority: 'Critical' },
  { name: 'Competitor Discovery & Analysis', effort: 'High', priority: 'Critical' },
  { name: 'SWOT Auto-Generation', effort: 'Medium', priority: 'High' },
  { name: 'Viability Scoring Algorithm', effort: 'Medium', priority: 'Critical' },
  { name: 'PDF Report Export', effort: 'Low', priority: 'Medium' },
  { name: 'User Dashboard & History', effort: 'Medium', priority: 'High' },
  { name: 'Team Collaboration Features', effort: 'High', priority: 'Low' },
  { name: 'Integration API for Partners', effort: 'High', priority: 'Low' },
  { name: 'Real-time Market Monitoring', effort: 'High', priority: 'Medium' },
]

const revenueModels = [
  { model: 'Freemium SaaS', description: 'Free basic analysis, paid premium reports with deep-dive data', potential: 'High' },
  { model: 'Subscription Tiers', description: 'Monthly/annual plans: Starter ($29), Pro ($79), Enterprise ($199)', potential: 'High' },
  { model: 'Pay-per-Report', description: 'One-time purchase per detailed validation report ($9.99–$49.99)', potential: 'Medium' },
  { model: 'API Licensing', description: 'B2B API access for accelerators, VCs, and consulting firms', potential: 'High' },
  { model: 'White-Label', description: 'Branded version for enterprise clients and partner platforms', potential: 'Medium' },
  { model: 'Affiliate Revenue', description: 'Referral partnerships with legal, hosting, and business services', potential: 'Low' },
]

// ─── Main Generator ───────────────────────────────────
export function generateAnalysis(ideaText) {
  const idea = ideaText.trim()

  // Generate a viability score influenced by idea length/detail
  const baseScore = rand(45, 88)
  const detailBonus = Math.min(idea.length / 20, 10)
  const viabilityScore = Math.min(Math.round(baseScore + detailBonus), 97)

  // Derive a startup name from the idea
  const words = idea.split(/\s+/).filter(w => w.length > 3)
  const startupName = words.length >= 2
    ? words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase() +
      words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase()
    : 'InnoVenture'

  // Market sizing
  const tam = rand(8, 180) // billions
  const sam = Math.round(tam * (rand(8, 25) / 100))
  const som = Math.round(sam * (rand(5, 20) / 100))

  // Scores breakdown
  const marketScore = rand(50, 95)
  const teamScore = rand(40, 85)
  const productScore = rand(55, 92)
  const tractionScore = rand(30, 78)
  const financialScore = rand(45, 88)

  return {
    ideaText: idea,
    startupName,
    tagline: `AI-powered ${idea.split(' ').slice(0, 4).join(' ').toLowerCase()} solution`,
    viabilityScore,
    verdict: viabilityScore >= 75 ? 'Strong' : viabilityScore >= 55 ? 'Moderate' : 'Weak',
    verdictColor: viabilityScore >= 75 ? '#06d6a0' : viabilityScore >= 55 ? '#ffbe0b' : '#f72585',

    executiveSummary: `Based on comprehensive AI analysis, "${startupName}" addresses a growing market opportunity worth $${tam}B globally. The concept demonstrates ${viabilityScore >= 70 ? 'strong' : 'moderate'} market-product fit with ${viabilityScore >= 70 ? 'significant' : 'some'} competitive advantages. Key success factors include rapid execution, strategic positioning against ${rand(3, 7)} identified competitors, and leveraging ${pick(marketTrends).toLowerCase()}. ${viabilityScore >= 75 ? 'This idea shows excellent potential for venture-scale returns.' : viabilityScore >= 55 ? 'With strategic pivots and strong execution, this idea could gain meaningful traction.' : 'This idea faces significant headwinds and would benefit from substantial refinement.'}`,

    scores: {
      market: marketScore,
      team: teamScore,
      product: productScore,
      traction: tractionScore,
      financial: financialScore,
    },

    market: {
      tam: `$${tam}B`,
      sam: `$${sam}B`,
      som: `$${som}B`,
      growth: `${rand(12, 35)}% CAGR`,
      trends: pickN(marketTrends, 4),
      chartData: [
        { name: '2024', value: tam * 0.7 },
        { name: '2025', value: tam * 0.82 },
        { name: '2026', value: tam },
        { name: '2027', value: tam * 1.2 },
        { name: '2028', value: tam * 1.45 },
      ],
    },

    competitors: pickN(competitorTemplates, rand(4, 6)).map((c, i) => ({
      ...c,
      strength: rand(35, 92),
      id: i,
    })),

    swot: {
      strengths: pickN(strengthPool, 3),
      weaknesses: pickN(weaknessPool, 3),
      opportunities: pickN(opportunityPool, 3),
      threats: pickN(threatPool, 3),
    },

    mvp: {
      timeline: `${rand(3, 6)} months`,
      budget: `$${rand(15, 80)}K`,
      phases: [
        {
          name: 'Phase 1 — Foundation',
          duration: `${rand(3, 6)} weeks`,
          features: pickN(mvpFeatures.filter(f => f.priority === 'Critical'), 3),
        },
        {
          name: 'Phase 2 — Core Product',
          duration: `${rand(4, 8)} weeks`,
          features: pickN(mvpFeatures.filter(f => f.priority === 'High' || f.priority === 'Critical'), 3),
        },
        {
          name: 'Phase 3 — Growth',
          duration: `${rand(4, 6)} weeks`,
          features: pickN(mvpFeatures.filter(f => f.priority !== 'Critical'), 3),
        },
      ],
    },

    revenue: pickN(revenueModels, 4),
  }
}
