/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#6c63ff',
          secondary: '#f72585',
          accent: '#4cc9f0',
          green: '#06d6a0',
          orange: '#ffbe0b',
        },
        dark: {
          base: '#07080f',
          surface: '#0d0f1c',
          card: 'rgba(255,255,255,0.04)',
          'card-hover': 'rgba(255,255,255,0.08)',
          glass: 'rgba(255,255,255,0.05)',
        },
      },
      backgroundImage: {
        'grad-brand': 'linear-gradient(135deg, #6c63ff, #f72585)',
        'grad-accent': 'linear-gradient(135deg, #4cc9f0, #6c63ff)',
        'grad-green': 'linear-gradient(135deg, #06d6a0, #4cc9f0)',
        'grad-orange': 'linear-gradient(135deg, #ffbe0b, #f72585)',
        'grad-surface': 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(247,37,133,0.05))',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(108,99,255,0.2)',
        'glow-green': '0 0 30px rgba(6,214,160,0.25)',
        'glow-pink': '0 0 30px rgba(247,37,133,0.2)',
        'glow-lg': '0 8px 40px rgba(108,99,255,0.35)',
        'card': '0 4px 20px rgba(0,0,0,0.3)',
      },
      borderColor: {
        subtle: 'rgba(255,255,255,0.07)',
        medium: 'rgba(255,255,255,0.12)',
        accent: 'rgba(108,99,255,0.4)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'fade-in-scale': 'fadeInScale 0.4s ease forwards',
        'agent-pulse': 'agentPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'dot-bounce': 'dotBounce 1.2s ease-in-out infinite',
        'check-in': 'checkIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '0.5' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        agentPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(108,99,255,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(108,99,255,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        dotBounce: {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.5' },
          '40%': { transform: 'translateY(-6px)', opacity: '1' },
        },
        checkIn: {
          '0%': { transform: 'scale(0) rotate(-45deg)', opacity: '0' },
          '60%': { transform: 'scale(1.3) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(108,99,255,0.3)' },
          '50%': { borderColor: 'rgba(108,99,255,0.8)' },
        },
      },
    },
  },
  plugins: [],
}
